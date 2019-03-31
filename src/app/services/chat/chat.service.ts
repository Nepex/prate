import { ChatMessage } from './chat-message';
import { User } from './../user/user';
import { environment } from './../../../environments/environment';
import { Injectable, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment';
import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
    public socket: io.Socket;
    @Output() public partner = new EventEmitter();
    @Output() public messageReceived = new EventEmitter();
    @Output() public messageSent = new EventEmitter();
    @Output() public isPartnerTyping = new EventEmitter();
    @Output() public partnerDisconnected = new EventEmitter();

    private matchFindRefreshInterval: number;

    constructor() { }

    intiateMatching(user: User): void {
        this.socket = io.connect(environment.apiBaseUrl);

        this.socket.on('error', err => {
            console.log('Socket error: ' + err);
        });

        const userInfo: User = {
            id: user.id,
            name: user.name,
            interests: user.interests
        };

        this.socket.emit('storeUserInfo', userInfo);

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

    listenForMessageRecevied(): void {
        this.socket.on('message-received', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.messageReceived.emit(msgObj);
        });
    }

    lookForMatch(): void {
        this.socket.emit('searchForMatch');
    }

    userIsTyping(isTyping: boolean, partner: User): void {
        const typingObj = {
            isTyping: isTyping,
            receiver: partner.clientId
        }

        this.socket.emit('user-typed', typingObj);
    }

    listenForPartnerIsTyping(): void {
        this.socket.on('user-typed', typingObj => {
            this.isPartnerTyping.emit(typingObj);
        });
    }

    disconnect(partner: User): void {
        console.log('disconnect called on service')

        this.socket.emit('disconnected', { receiver: partner.clientId })
    }

    listenForPartnerDisconnect(): void {
        this.socket.on('partnerDisconnected', data => {
            console.log('partner disconnected emit')
            this.partnerDisconnected.emit(true);
        });
    }
}

