import { UserService } from './../services/user/user.service';
import { Component, OnInit } from '@angular/core';
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
export class ChatComponent implements OnInit {
    user: User;
    partner;

    chatMessages = [];
    matching = false;

    loadingRequest: Observable<User>;
    partnerFoundSub: Subscription;
    messageReceivedSub: Subscription;
    messageSentSub: Subscription;


    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', []),
    });

    constructor(private userService: UserService, private chatService: ChatService) {}


    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.loadingRequest = null;
        });

        this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.setPartner(partner));
        this.messageReceivedSub = this.chatService.messageReceived.subscribe(msgObj => this.messageReceived(msgObj));
        this.messageSentSub = this.chatService.messageSent.subscribe(msgObj => this.messageSent(msgObj));
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

}
