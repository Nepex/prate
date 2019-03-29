import { User } from './../user/user';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

@Injectable()
export class ChatService {
    public socket: io.Socket;

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
                // use interval instead, cancel on find
                setTimeout(() => {
                    this.lookForMatch();
                }, 1000);
            } else {
                // find way to store partner on frontend
                this.socket.emit('connectToPartner', partner);
            }
        });
    }

    lookForMatch() {
        this.socket.emit('searchForMatch');
    }
}

