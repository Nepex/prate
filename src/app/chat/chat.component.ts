import { UserService } from './../services/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { User } from '../services/user/user';
import { ChatService } from '../services/chat/chat.service';


import { map, debounceTime } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    user: User;
    partner = null;

    chatMessages = [];
    matching: boolean = false;

    loadingRequest: Observable<User>;
    partnerFoundSub: Subscription;
    messageReceivedSub: Subscription;
    messageSentSub: Subscription;
    userDoneTypingSub: Subscription;
    isPartnerTypingSub: Subscription;

    autoScroll: boolean = true;
    userIsTyping: boolean = false;
    partnerIsTyping: boolean = false;

    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', [Validators.maxLength(300), Validators.minLength(1), Validators.required]),
    });

    constructor(private userService: UserService, private chatService: ChatService) { }


    ngOnInit() {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.loadingRequest = null;
        });

        this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.setPartner(partner));
        this.messageSentSub = this.chatService.messageSent.subscribe(msgObj => this.messageSent(msgObj));
        this.messageReceivedSub = this.chatService.messageReceived.subscribe(msgObj => this.messageReceived(msgObj));
        this.isPartnerTypingSub = this.chatService.isPartnerTyping.subscribe(typingObj => this.isPartnerTyping(typingObj));

        this.listenForUserDoneTyping();
    }

    ngOnDestroy() {
        this.partnerFoundSub.unsubscribe();
        this.messageSentSub.unsubscribe();
        this.messageReceivedSub.unsubscribe();
        this.userDoneTypingSub.unsubscribe();
        this.isPartnerTypingSub.unsubscribe();
    }

    searchForMatch() {
        this.matching = true;
        this.chatService.intiateMatching(this.user);
    }

    sendMessage() {
        if (!this.messageForm.valid || !this.partner) {
            return;
        }

        const message = this.messageForm.value.message;
        this.chatService.sendMessage(this.partner, this.user, message);
        this.messageForm.reset();
    }

    messageSent(msgObj) {
        this.chatMessages.push(msgObj);
    }

    messageReceived(msgObj) {
        this.chatMessages.push(msgObj);
    }

    setPartner(partner) {
        this.matching = false;
        this.partner = partner;
    }

    listenForUserTyping() {
        if (!this.partner || this.userIsTyping) {
            return;
        }

        console.log('user typing')


        this.userIsTyping = true;
        this.chatService.userIsTyping(true, this.partner);
    }

    listenForUserDoneTyping() {
        const input = document.getElementById('messageInput');
        const event = fromEvent(input, 'keyup').pipe(map(i => i.currentTarget['value']));
        const debouncedInput = event.pipe(debounceTime(500));

        this.userDoneTypingSub = debouncedInput.subscribe(val => {
            if (this.partner) {
                this.userIsTyping = false;
                this.chatService.userIsTyping(false, this.partner);
            }
        });
    }

    isPartnerTyping(typingObj) {
        if (!this.partner) {
            return;
        }

        if (typingObj.isTyping) {
            this.partnerIsTyping = true;
        } else {
            this.partnerIsTyping = false;
        }
    }

    chatScrolled() {
        let element = document.getElementById('chatMessages');
        let atBottom = (element.scrollTop + element.offsetHeight + 100) >= element.scrollHeight;
        if (atBottom) {
            this.autoScroll = true;
        } else {
            this.autoScroll = false;
        }
    }

    checkForAutoScroll() {
        let element = document.getElementById('chatMessages');

        if (this.autoScroll) {
            element.scrollTop = element.scrollHeight;
        }
    }
}
