import { ChatMessage } from './chat-message';
import { User } from './../user/user';
import { environment } from './../../../environments/environment';
import { Injectable, EventEmitter, Output, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import { SessionService } from '../session/session.service';
import { LevelInfo } from '../level/level-info';

@Injectable()
export class ChatService implements OnDestroy {
    public socket: io.Socket;
    @Output() public partner = new EventEmitter();
    @Output() public messageReceived = new EventEmitter();
    @Output() public messageSent = new EventEmitter();

    @Output() public outerAppInviteReceived = new EventEmitter();
    @Output() public outerAppInviteSent = new EventEmitter();
    @Output() public outerAppInviteAccepted = new EventEmitter();
    @Output() public outerAppInviteCanceled = new EventEmitter();

    @Output() public closedYtVideo = new EventEmitter();
    @Output() public toggledYtPlay = new EventEmitter();

    @Output() public isPartnerTyping = new EventEmitter();
    @Output() public partnerDisconnected = new EventEmitter();
    @Output() public userDisconnected = new EventEmitter();
    @Output() public matchingError = new EventEmitter();

    user: User;

    private matchFindRefreshInterval: number;

    constructor(private sessionService: SessionService) { }

    /** Emits object to socket of user currently looking for match, looks for a match every second if nothing is returned */
    intiateMatching(user: User): void {
        this.connect();

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
            avatar: user.avatar,
            experience: user.experience,
            webSocketAuth: '3346841372',
            token: this.sessionService.getToken(),
            levelInfo: user.levelInfo
        };

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

                this.listenForToggleYtPlay();
                this.listenForCloseYtVideo();
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

    /** Emits app invite sent to socket */
    sendOuterAppInvite(partner: User, user: User, outerAppType: string, outerAppLink: string): void {
        const msgObj: ChatMessage = {
            sender: user.name,
            receiver: partner.clientId,
            outerAppType: outerAppType,
            outerAppLink: outerAppLink,
            datetime: moment().format('hh:mm a'),
            type: 'sent'
        };

        this.socket.emit('outer-app-invite-send', msgObj);
        this.outerAppInviteSent.emit(msgObj);
    }

    /** Listens for app invite received from socket */
    listenForOuterAppInvite(): void {
        this.socket.on('outer-app-invite-received', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.outerAppInviteReceived.emit(msgObj);
        });
    }

    /** Emits app invite accepted to socket */
    outerAppInviteAccept(partner: User, user: User, outerAppType: string): void {
        const msgObj: ChatMessage = {
            sender: user.name,
            receiver: partner.clientId,
            outerAppType: outerAppType,
            datetime: moment().format('hh:mm a'),
            type: 'sent'
        };

        this.socket.emit('outer-app-invite-accept', msgObj);
    }

    /** Listens for app invite accepted from socket */
    listenForOuterAppInviteAccept(): void {
        this.socket.on('outer-app-invite-accept', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.outerAppInviteAccepted.emit(msgObj);
        });
    }

    /** Emits app invite canceled to socket */
    outerAppInviteCancel(partner: User, user: User, outerAppType: string): void {
        const msgObj: ChatMessage = {
            sender: user.name,
            receiver: partner.clientId,
            outerAppType: outerAppType,
            datetime: moment().format('hh:mm a'),
            type: 'sent'
        };

        this.socket.emit('outer-app-invite-cancel', msgObj);
    }

    /** Listens for app invite canceled from socket */
    listenForOuterAppInviteCancel(): void {
        this.socket.on('outer-app-invite-cancel', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.outerAppInviteCanceled.emit(msgObj);
        });
    }

    /** Emits to play/pause YT video to socket */
    toggleYtPlay(partner: User, user: User): void {
        const msgObj: ChatMessage = {
            sender: user.name,
            receiver: partner.clientId,
            datetime: moment().format('hh:mm a'),
            type: 'sent'
        };

        this.socket.emit('toggle-yt-play', msgObj);
    }

    /** Listens for play/pause YT video from socket */
    listenForToggleYtPlay(): void {
        this.socket.on('toggle-yt-play', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.toggledYtPlay.emit(msgObj);
        });
    }

    /** Emits to close YT video to socket */
    closeYtVideo(partner: User, user: User): void {
        const msgObj: ChatMessage = {
            sender: user.name,
            receiver: partner.clientId,
            datetime: moment().format('hh:mm a'),
            type: 'sent'
        };

        this.socket.emit('close-yt-video', msgObj);
    }

    /** Listens for close YT video from socket */
    listenForCloseYtVideo(): void {
        this.socket.on('close-yt-video', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.closedYtVideo.emit(msgObj);
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

    /** Connect to socket */
    connect() {
        this.socket = io(environment.apiServer, {
            path: environment.socketIoServer
        });

        // this.socket = io.connect(environment.apiServer + '/' + environment.socketIoServer);
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

