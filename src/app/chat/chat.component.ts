import { UserService } from './../services/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '../services/user/user';
import { ChatService } from '../services/chat/chat.service';


import { distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    user: User;
    partner;

    chatMessages = [];
    matching: boolean = false;

    loadingRequest: Observable<User>;
    partnerFoundSub: Subscription;
    messageReceivedSub: Subscription;
    messageSentSub: Subscription;

    autoScroll: boolean = true;

    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', []),
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
    }

    ngOnDestroy() {
        this.partnerFoundSub.unsubscribe();
        this.messageSentSub.unsubscribe();
        this.messageReceivedSub.unsubscribe();
    }

    searchForMatch() {
        this.matching = true;
        this.chatService.intiateMatching(this.user);
    }

    sendMessage() {
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
