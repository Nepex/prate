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
    private matchFindRefreshInterval: number;

    constructor() {}

    intiateMatching(user: User) { 
        this.socket = io.connect(environment.apiBaseUrl);

        this.socket.on('error', err => {
            console.log('Socket error: ' + err);
        });

        const userInfo = {
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
            }
        });

        this.socket.on('message-received', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.messageReceived.emit(msgObj);
        });
    }

    sendMessage(partner, user, message) {
        const msgObj = {
            sender: user.name,
            receiver: partner.clientId,
            message: message,
            datetime: moment().format('hh:mm a'),
            type: 'sent'
        };

        this.socket.emit('message-send', msgObj);
        this.messageSent.emit(msgObj);
    }

    lookForMatch() {
        this.socket.emit('searchForMatch');
    }
}

