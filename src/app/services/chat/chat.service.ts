import { ChatMessage } from './chat-message';
import { User } from './../user/user';
import { environment } from './../../../environments/environment';
import { Injectable, EventEmitter, Output, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import { SessionService } from '../session/session.service';

@Injectable()
export class ChatService implements OnDestroy {
    public socket: io.Socket;
    @Output() public partner = new EventEmitter();
    @Output() public messageReceived = new EventEmitter();
    @Output() public messageSent = new EventEmitter();
    @Output() public isPartnerTyping = new EventEmitter();
    @Output() public partnerDisconnected = new EventEmitter();
    @Output() public userDisconnected = new EventEmitter();
    @Output() public matchingError = new EventEmitter();

    user: User;

    private matchFindRefreshInterval: number;

    constructor(private sessionService: SessionService) {
        this.socket = io('http://prate.club', {
            path: '/api/socket.io'
          });
     }

    /** Emits object to socket of user currently looking for match, looks for a match every second if nothing is returned */
    intiateMatching(user: User): void {
        // this.socket = io.connect(environment.apiBaseUrl);
        console.log(this.socket, environment.apiBaseUrl);

        this.socket.on('matchError', err => {
            this.matchingError.emit(err);
        });

        this.user = {
            id: user.id,
            name: user.name,
            interests: user.interests,
            font_face: user.font_face,
            font_color: user.font_color,
            bubble_color: user.bubble_color,
            webSocketAuth: '3346841372',
            token: this.sessionService.getToken()
        };

        console.log(this.user);

        this.socket.emit('authAndStoreUserInfo', this.user);

        this.lookForMatch();

        this.socket.on('matchResults', partner => {
            if (!partner) {
                this.matchFindRefreshInterval = window.setTimeout(() => {
                    this.lookForMatch();
                }, 1000);
            } else {
                clearTimeout(this.matchFindRefreshInterval);
                this.partner.emit(partner);

                this.listenForMessageRecevied();
                this.listenForPartnerIsTyping();
                this.listenForPartnerDisconnect();
            }
        });
    }

    /** Stop match timer on destroy */
    ngOnDestroy() {
        clearTimeout(this.matchFindRefreshInterval);
    }

    /** Emits to socket that user is looking for a match */
    lookForMatch(): void {
        this.socket.emit('searchForMatch', this.user);
    }

    /** Emits to socket to stop looking for a match, clears partner if a match has already been made */
    cancelMatching() {
        this.socket.emit('cancelMatching');
    }

    /** Emits message sent to socket */
    sendMessage(partner: User, user: User, message: string): void {
        const msgObj: ChatMessage = {
            sender: user.name,
            receiver: partner.clientId,
            message: message,
            datetime: moment().format('hh:mm a'),
            type: 'sent'
        };

        this.socket.emit('message-send', msgObj);
        this.messageSent.emit(msgObj);
    }

    /** Listens for message received from socket */
    listenForMessageRecevied(): void {
        this.socket.on('message-received', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.messageReceived.emit(msgObj);
        });
    }

    /** Emits to socket that user is currently typing */
    userIsTyping(isTyping: boolean, partner: User): void {
        const typingObj = {
            isTyping: isTyping,
            receiver: partner.clientId
        };

        this.socket.emit('user-typed', typingObj);
    }

    /** Listens for if partner is typing */
    listenForPartnerIsTyping(): void {
        this.socket.on('user-typed', typingObj => {
            this.isPartnerTyping.emit(typingObj);
        });
    }

    /** Emits to socket when user is disconnected from chat */
    disconnect(partner: User): void {
        this.socket.emit('disconnected', { receiver: partner.clientId });
        this.userDisconnected.emit(true);
    }

    /** Listens for if partner disconnects */
    listenForPartnerDisconnect(): void {
        this.socket.on('partnerDisconnected', data => {
            this.partnerDisconnected.emit(true);
        });
    }

    /** Disconnects a user from socket */
    killSocketConnection() {
        this.socket.emit('killSocketConnection', null);
    }
}

