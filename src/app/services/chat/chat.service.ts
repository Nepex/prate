// Angular
import { Injectable, EventEmitter, Output, OnDestroy } from '@angular/core';

// NPM
import * as moment from 'moment';
import * as io from 'socket.io-client';

// App
import { ChatMessage } from './chat-message';
import { environment } from './../../../environments/environment';
import { OuterAppInfo } from './outer-app-info';
import { SessionService } from '../session/session.service';
import { User } from './../user/user';

// Service for managing chat connections
@Injectable()
export class ChatService implements OnDestroy {
    public partner: EventEmitter<User> = new EventEmitter();
    public messageReceived: EventEmitter<ChatMessage> = new EventEmitter();
    public isPartnerTyping: EventEmitter<void> = new EventEmitter();

    public outerAppInviteReceived: EventEmitter<OuterAppInfo> = new EventEmitter();
    public outerAppInviteSent: EventEmitter<OuterAppInfo> = new EventEmitter();
    public outerAppInviteAccepted: EventEmitter<void> = new EventEmitter();
    public outerAppInviteCanceled: EventEmitter<void> = new EventEmitter();
    public toggledOuterAppFunction: EventEmitter<void> = new EventEmitter();
    
    public partnerDisconnected: EventEmitter<boolean> = new EventEmitter();
    public userDisconnected: EventEmitter<boolean> = new EventEmitter();
    public matchingError: EventEmitter<void> = new EventEmitter();

    public socket: io.Socket;

    private user: User;
    private matchFindRefreshInterval: number;

    constructor(private sessionService: SessionService) { }

    // stop match timer on destroy
    ngOnDestroy(): void {
        clearTimeout(this.matchFindRefreshInterval);
    }

    private connect(): void {
        this.socket = io(`${environment.apiServer}/chat`, {
            path: `${environment.socketIoServer}`
        });
    }

    public disconnect(): void {
        this.socket.disconnect();
        this.userDisconnected.emit();
    }

    private listenForPartnerDisconnect(): void {
        this.socket.on('partnerDisconnected', data => {
            this.partnerDisconnected.emit();
        });
    }

    // --- Matching ---
    // emits object to socket of user currently looking for match, looks for a match every second if nothing is returned
    public intiateMatching(user: User, forcedMatchWith: string): void {
        this.connect();

        this.socket.on('matchError', err => {
            this.matchingError.emit(err);
        });

        this.user = {
            id: user.id,
            name: user.name,
            interests: user.interests,
            experience: user.experience,
            enforce_interests: user.enforce_interests,
            webSocketAuth: '3346841372',
            token: this.sessionService.getToken(),
            levelInfo: user.levelInfo,
            forcedMatchedWith: null
        };

        if (forcedMatchWith) {
            this.user.forcedMatchedWith = forcedMatchWith;
        }

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

                this.listenForOuterAppInvite();
                this.listenForOuterAppInviteAccept();
                this.listenForOuterAppInviteCancel();

                this.listenForToggleOuterAppFunction();
            }
        });
    }

    private lookForMatch(): void {
        this.socket.emit('searchForMatch', this.user);
    }

    // --- Basic Messaging ---
    public sendMessage(msgObj: ChatMessage): void {
        this.socket.emit('message-send', msgObj);
    }

    private listenForMessageRecevied(): void {
        this.socket.on('message-received', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.messageReceived.emit(msgObj);
        });
    }

    public userIsTyping(isTyping: boolean, partner: User): void {
        const typingObj = {
            isTyping: isTyping,
            receiver: partner.clientId
        };

        this.socket.emit('user-typed', typingObj);
    }

    private listenForPartnerIsTyping(): void {
        this.socket.on('user-typed', typingObj => {
            this.isPartnerTyping.emit(typingObj);
        });
    }

    // --- Outer App Control ---
    public sendOuterAppInvite(partner: User, user: User, outerApp: string, outerAppLink: string): void {
        const msgObj: OuterAppInfo = {
            sender: user.name,
            receiver: partner.clientId,
            outerApp: outerApp,
            outerAppLink: outerAppLink,
            type: 'sent'
        };

        this.socket.emit('outer-app-invite-send', msgObj);
        this.outerAppInviteSent.emit(msgObj);
    }

    private listenForOuterAppInvite(): void {
        this.socket.on('outer-app-invite-received', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.outerAppInviteReceived.emit(msgObj);
        });
    }

    public outerAppInviteAccept(partner: User, user: User, outerApp: string): void {
        const msgObj: OuterAppInfo = {
            sender: user.name,
            receiver: partner.clientId,
            outerApp: outerApp,
            type: 'sent'
        };

        this.socket.emit('outer-app-invite-accept', msgObj);
    }

    private listenForOuterAppInviteAccept(): void {
        this.socket.on('outer-app-invite-accept', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.outerAppInviteAccepted.emit(msgObj);
        });
    }

    public outerAppInviteCancel(partner: User, user: User, outerApp: string): void {
        const msgObj: OuterAppInfo = {
            sender: user.name,
            receiver: partner.clientId,
            outerApp: outerApp,
            type: 'sent'
        };

        this.socket.emit('outer-app-invite-cancel', msgObj);
    }

    private listenForOuterAppInviteCancel(): void {
        this.socket.on('outer-app-invite-cancel', msgObj => {
            msgObj.type = 'received';

            this.outerAppInviteCanceled.emit();
        });
    }

    public toggleOuterAppFunction(partner: User, user: User, outerApp: string, activity: string): void {
        const msgObj: OuterAppInfo = {
            sender: user.name,
            receiver: partner.clientId,
            type: 'sent',
            outerApp: outerApp,
            activity: activity
        };

        this.socket.emit('toggle-outer-app-function', msgObj);
    }

    private listenForToggleOuterAppFunction(): void {
        this.socket.on('toggle-outer-app-function', msgObj => {
            msgObj.type = 'received';

            this.toggledOuterAppFunction.emit(msgObj);
        });
    }
}
