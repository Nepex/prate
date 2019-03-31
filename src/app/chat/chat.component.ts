import { ChatMessage } from './../services/chat/chat-message';
import { UserService } from './../services/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { User } from '../services/user/user';
import { ChatService } from '../services/chat/chat.service';


import { map, debounceTime } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IsTyping } from '../services/chat/is-typing';

@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    user: User;
    partner: User = null;
    chatMessages: ChatMessage[] = [];

    loadingRequest: Observable<User>;
    partnerFoundSub: Subscription;
    messageReceivedSub: Subscription;
    messageSentSub: Subscription;
    userDoneTypingSub: Subscription;
    isPartnerTypingSub: Subscription;
    partnerDisconnectSub: Subscription;

    matching: boolean = false;
    autoScroll: boolean = true;
    userIsTyping: boolean = false;
    partnerIsTyping: boolean = false;

    disconnectMessage: string;

    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', [Validators.maxLength(300), Validators.minLength(1), Validators.required]),
    });

    constructor(private userService: UserService, private chatService: ChatService) { }

    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.loadingRequest = null;
        });

        this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.setPartner(partner));
        this.messageSentSub = this.chatService.messageSent.subscribe(msgObj => this.messageSent(msgObj));
        this.messageReceivedSub = this.chatService.messageReceived.subscribe(msgObj => this.messageReceived(msgObj));
        this.isPartnerTypingSub = this.chatService.isPartnerTyping.subscribe(typingObj => this.isPartnerTyping(typingObj));
        this.partnerDisconnectSub = this.chatService.partnerDisconnected.subscribe(isDisconnected => this.partnerDisconnect(isDisconnected));

        window.onbeforeunload = () => {
            this.disconnect();
        };

        this.listenForUserDoneTyping();
    }

    ngOnDestroy(): void {
        this.partnerFoundSub.unsubscribe();
        this.messageSentSub.unsubscribe();
        this.messageReceivedSub.unsubscribe();
        this.userDoneTypingSub.unsubscribe();
        this.isPartnerTypingSub.unsubscribe();
        this.partnerDisconnectSub.unsubscribe();
    }

    searchForMatch(): void {
        this.matching = true;
        this.disconnectMessage = null;
        this.chatService.intiateMatching(this.user);
    }

    sendMessage(): void {
        if (!this.messageForm.valid || !this.partner) {
            return;
        }

        const message = this.messageForm.value.message;
        this.chatService.sendMessage(this.partner, this.user, message);
        this.messageForm.reset();
    }

    messageSent(msgObj: ChatMessage): void {
        this.chatMessages.push(msgObj);
    }

    messageReceived(msgObj: ChatMessage): void {
        this.chatMessages.push(msgObj);
    }

    setPartner(partner: User): void {
        this.matching = false;
        this.partner = partner;
    }

    listenForUserTyping(): void {
        if (!this.partner || this.userIsTyping) {
            return;
        }

        this.userIsTyping = true;
        this.chatService.userIsTyping(true, this.partner);
    }

    listenForUserDoneTyping(): void {
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

    isPartnerTyping(typingObj: IsTyping): void {
        if (!this.partner) {
            return;
        }

        if (typingObj.isTyping) {
            this.partnerIsTyping = true;
        } else {
            this.partnerIsTyping = false;
        }
    }

    disconnect(): void {
        console.log('disconnect called on component')
        this.chatService.disconnect(this.partner);
        this.disconnectMessage = 'Left the chat'
        this.partner = null;
    }

    partnerDisconnect(isDisconnected: boolean): void {
        if (isDisconnected) {
            this.partnerIsTyping = false;
            this.disconnectMessage = this.partner.name + ' has left';
            this.partner = null;
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
