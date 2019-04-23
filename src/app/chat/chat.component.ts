import { ChatMessage } from './../services/chat/chat-message';
import { UserService } from './../services/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { User } from '../services/user/user';
import { ChatService } from '../services/chat/chat.service';


import { map, debounceTime, throttleTime } from 'rxjs/operators';
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

    chatTimerInterval: number;
    inactivityTimer: number = 0;
    chatTimer: number = 0;

    disconnectMessage: string;
    warningMessage: string;

    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', [Validators.maxLength(300), Validators.minLength(1), Validators.required]),
    });

    constructor(private userService: UserService, private chatService: ChatService) { }

    /** Populates user data, sets up listeners from chat service and component */
    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            console.log(this.user);
            this.loadingRequest = null;
        });

        this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.setPartner(partner));
        this.messageSentSub = this.chatService.messageSent.subscribe(msgObj => this.messageSent(msgObj));
        this.messageReceivedSub = this.chatService.messageReceived.subscribe(msgObj => this.messageReceived(msgObj));
        this.isPartnerTypingSub = this.chatService.isPartnerTyping.subscribe(typingObj => this.isPartnerTyping(typingObj));
        this.partnerDisconnectSub = this.chatService.partnerDisconnected.subscribe(isDisconnected => this.partnerDisconnect(isDisconnected));

        // if page is refreshed or browser is closed, disconnect the user
        window.onbeforeunload = () => {
            if (this.matching) {
                this.cancelMatching();
            } else {
                this.disconnect();
            }
        };

        this.listenForUserDoneTyping();
    }

    /** Unsubscribe from subscriptions on page destroy */
    ngOnDestroy(): void {
        this.partnerFoundSub.unsubscribe();
        this.messageSentSub.unsubscribe();
        this.messageReceivedSub.unsubscribe();
        this.userDoneTypingSub.unsubscribe();
        this.isPartnerTypingSub.unsubscribe();
        this.partnerDisconnectSub.unsubscribe();

        clearTimeout(this.chatTimerInterval);
    }

    /** Commences matching, looks for available partners */
    searchForMatch(): void {
        this.chatMessages = [];
        this.matching = true;
        this.warningMessage = null;
        this.chatService.intiateMatching(this.user);
    }

    /** Sets partner object after a match is sucessfully made */
    setPartner(partner: User): void {
        this.matching = false;
        this.partner = partner;

        this.accumulateTime();
    }

    /** Accumulates chat time and kicks user if inactive for 10 minutes */
    accumulateTime(): void {
        this.chatTimerInterval = window.setTimeout(() => {
            this.chatTimer = this.chatTimer + 10;
            this.inactivityTimer = this.inactivityTimer + 10;

            if (this.inactivityTimer >= 570) {
                this.warningMessage = 'Inactivity detected, please send a message';
            }

            // disconnect user after 10 minutes of inactivity
            if (this.inactivityTimer >= 600) {
                this.disconnect();
                return;
            }

            this.accumulateTime();
        }, 10000);
    }

    /** Attempt to send a message */
    sendMessage(): void {
        if (!this.messageForm.valid || !this.partner) {
            return;
        }

        const message = this.messageForm.value.message;
        this.chatService.sendMessage(this.partner, this.user, message);
        this.inactivityTimer = 0;
        this.warningMessage = null;
        this.messageForm.reset();
    }

    /** Listens for messages sucessfully sent by user */
    messageSent(msgObj: ChatMessage): void {
        this.chatMessages.push(msgObj);
    }

    /** Listens for messages received from partner */
    messageReceived(msgObj: ChatMessage): void {
        this.chatMessages.push(msgObj);
    }

    /** If host starts typin */
    listenForUserTyping(): void {
        if (!this.partner || this.userIsTyping) {
            return;
        }

        this.userIsTyping = true;
        this.chatService.userIsTyping(true, this.partner);
    }

    /** Listens for last key up event, sets user as done typing after .5 seconds */
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

    /** If partner is typing, display a message */
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

    /** On cancel button clicked, halt matching */
    cancelMatching(): void {
        if (this.partner) {
            this.disconnect();
            return;
        }
        this.chatService.cancelMatching();
        this.matching = false;
    }

    /** If user leaves the chat or is disconnected - unmatch both user and partner */
    disconnect(): void {
        this.chatService.disconnect(this.partner);
        this.warningMessage = 'Left the chat';
        this.chatMessages = [];
        this.partner = null;

        this.stopTimerAndGiveExp();
    }

    /** If partner is disconnected, unmatch user */
    partnerDisconnect(isDisconnected: boolean): void {
        if (isDisconnected) {
            this.partnerIsTyping = false;
            this.warningMessage = this.partner.name + ' has left';
            this.chatMessages = [];
            this.partner = null;

            this.stopTimerAndGiveExp();
        }
    }

    /** Resets timers and awards exp */
    stopTimerAndGiveExp() {
        clearTimeout(this.chatTimerInterval);

        // award EXP here

        this.chatTimer = 0;
        this.inactivityTimer = 0;
    }

    /** If chat is scrolled, check if user is at the bottom, if not, allow for free scrolling. */
    chatScrolled() {
        let element = document.getElementById('chatMessages');
        let atBottom = (element.scrollTop + element.offsetHeight + 100) >= element.scrollHeight;
        if (atBottom) {
            this.autoScroll = true;
        } else {
            this.autoScroll = false;
        }
    }

    /** If user is at the bottom, auto scroll chat with messages sent/received */
    checkForAutoScroll() {
        let element = document.getElementById('chatMessages');

        if (this.autoScroll) {
            element.scrollTop = element.scrollHeight;
        }
    }
}
