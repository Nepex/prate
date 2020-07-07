// Angular
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// NPM
import * as io from 'socket.io-client';
import * as moment from 'moment';

// App
import { environment } from './../../../environments/environment';
import { FriendRequest } from './friend-request';
import { SessionService } from '../session/session.service';
import { User } from './../user/user';
import { OuterAppInfo } from '../chat/outer-app-info';
import { ChatMessage } from '../chat/chat-message';

// Service for managing chat connections
@Injectable()
export class FriendService {
    private apiUrl = `${environment.apiBaseUrl}/friends`;

    public friendMessageSent: EventEmitter<ChatMessage> = new EventEmitter();
    public friendMessageReceived: EventEmitter<ChatMessage> = new EventEmitter();
    public isFriendTyping: EventEmitter<void> = new EventEmitter();

    public onlineFriendsReceived: EventEmitter<User[]> = new EventEmitter();
    public checkFriendStatusReceived: EventEmitter<User> = new EventEmitter();

    public friendRequestReceived: EventEmitter<FriendRequest> = new EventEmitter();
    public friendRequestHandled: EventEmitter<string> = new EventEmitter();

    public acceptedFriendRequestSent: EventEmitter<string> = new EventEmitter();
    public acceptedFriendRequestReceived: EventEmitter<User> = new EventEmitter();

    public friendRemovalSent: EventEmitter<string> = new EventEmitter();
    public friendRemovalReceived: EventEmitter<string> = new EventEmitter();

    public friendDataChangeSent: EventEmitter<User> = new EventEmitter();
    public friendDataChangeReceived: EventEmitter<User> = new EventEmitter();

    public matchInviteReceived: EventEmitter<OuterAppInfo> = new EventEmitter();
    public matchInviteSent: EventEmitter<OuterAppInfo> = new EventEmitter();
    public matchInviteAccepted: EventEmitter<void> = new EventEmitter();
    public matchInviteCanceled: EventEmitter<void> = new EventEmitter();

    public matchInviteSentFromMessageBox: EventEmitter<User> = new EventEmitter();


    public socket: io.Socket;

    private user: User;

    constructor(private sessionService: SessionService, private http: HttpClient) { }

    // --- Connect/disconnect and initialization ---
    private connect(): void {
        this.socket = io(`${environment.apiServer}/friends`, {
            path: `${environment.socketIoServer}`
        });

        this.listenForFriendMessageRecevied();
        this.listenForFriendIsTyping();

        this.listenForReceivedFriendRequests();

        this.listenForReceivedOnlineFriends();
        this.listenForCheckFriendStatusReceived();

        this.listenForAcceptedFriendRequest();
        this.listenForReceivedFriendRemoval();

        this.listenForFriendDataChangeReceived();

        this.listenForMatchInviteReceived();
        this.listenForMatchInviteAccept();
        this.listenForMatchInviteCancel();
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

    public connectAndStoreUser(user: User): void {
        this.connect();

        this.user = {
            id: user.id,
            name: user.name,
            webSocketAuth: '3346841372',
            token: this.sessionService.getToken(),
            friends: user.friends,
            email: user.email,
            status: 'online',
            avatar: user.avatar
        };

        this.socket.emit('storeUserInfo', this.user);
        this.socket.emit('get-online-friends', this.user.friends);
    }

    // --- Friends info calls ---
    // Get friends, requests, statuses DB and WS calls
    public getFriends(): Observable<User[]> {
        const url = `${this.apiUrl}/get-friends`;

        const req = this.http.get<User[]>(url);

        return req;
    }

    public getFriendRequests(): Observable<User[]> {
        const url = `${this.apiUrl}/get-friend-requests`;

        const req = this.http.get<User[]>(url);

        return req;
    }

    // This is being called in connectAndStoreUser, online friends are fetched on initialization
    public listenForReceivedOnlineFriends(): void {
        this.socket.on('receive-online-friends', msgObj => {
            this.onlineFriendsReceived.emit(msgObj);
        });
    }

    // Checks to see if a recipient user of a friend request is online, to display for sending user
    public checkFriendStatusSend(id: string): void {
        this.socket.emit('check-friend-status-send', { id: id });
    }

    public listenForCheckFriendStatusReceived(): void {
        this.socket.on('check-friend-status-received', msgObj => {
            this.checkFriendStatusReceived.emit(msgObj);
        });
    }

    // --- Friend requests ---
    // Send request DB and WS calls
    public createFriendRequest(receiver: User): Observable<User> {
        const url = `${this.apiUrl}/send-friend-request`;

        const req = this.http.put<User>(url, receiver).pipe(map(res => res));

        return req;
    }

    public sendFriendRequest(sender: User, receiver: User, receiverEmail?: string): void {
        const msgObj: FriendRequest = {
            senderId: sender.id,
            senderName: sender.name,
            senderEmail: sender.email,
            receiverId: receiver ? receiver.id : null,
            receiverName: receiver ? receiver.name : null,
            receiverEmail: receiverEmail ? receiverEmail : null
        };

        this.socket.emit('friend-request-send', msgObj);
    }

    public listenForReceivedFriendRequests(): void {
        this.socket.on('friend-request-received', msgObj => {
            this.friendRequestReceived.emit(msgObj);
        });
    }

    // Accept request DB and WS calls
    public acceptFriendRequest(id: string): Observable<User> {
        const url = `${this.apiUrl}/accept-friend-request/${id}`;

        const req = this.http.put<User>(url, null).pipe(map(res => res));

        return req;
    }

    public sendAcceptedFriendRequest(userSendingId: string, userReceivingId: string): void {
        this.socket.emit('accepted-friend-request-send', { userSendingId: userSendingId, userReceivingId: userReceivingId });
        this.acceptedFriendRequestSent.emit(userReceivingId);
    }

    public listenForAcceptedFriendRequest() {
        this.socket.on('accepted-friend-request-received', msgObj => {
            this.acceptedFriendRequestReceived.emit(msgObj);
        });
    }

    // Deny request DB call
    public denyFriendRequest(id: string): Observable<User> {
        const url = `${this.apiUrl}/deny-friend-request/${id}`;

        const req = this.http.put<User>(url, null).pipe(map(res => res));

        return req;
    }

    // Tells pages a friend request has been handled and splices that friend request from friend_requests[] 
    // Whether it's accepted or denied is handled by sendAcceptedFriendRequest, listenForAcceptedFriendRequest, denyFriendRequest
    public emitFriendRequestHandled(id: string): void {
        this.friendRequestHandled.emit(id);
    }

    // --- Friend Removal ---
    // Remove friend DB and WS calls
    public removeFriend(id: string): Observable<User> {
        const url = `${this.apiUrl}/remove-friend/${id}`;

        const req = this.http.put<User>(url, null).pipe(map(res => res));

        return req;
    }

    public sendFriendRemoval(userSendingId: string, userReceivingId: string): void {
        this.socket.emit('friend-removal-send', { userSendingId: userSendingId, userReceivingId: userReceivingId });
        this.friendRemovalSent.emit(userReceivingId);
    }

    public listenForReceivedFriendRemoval(): void {
        this.socket.on('friend-removal-received', msgObj => {
            this.friendRemovalReceived.emit(msgObj);
        });
    }

    // --- Changing Status/Name/Avatar
    public sendFriendDataChange(user: User): void {
        const body = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            status: user.status
        };

        this.socket.emit('friend-data-change-send', body);
        this.friendDataChangeSent.emit(body);
    }

    public listenForFriendDataChangeReceived(): void {
        this.socket.on('friend-data-change-received', msgObj => {
            this.friendDataChangeReceived.emit(msgObj);
        });
    }


    // --- Messaging ---
    public sendFriendMessage(msgObj: ChatMessage): void {
        this.socket.emit('friend-message-send', msgObj);
        this.friendMessageSent.emit(msgObj);
    }

    private listenForFriendMessageRecevied(): void {
        this.socket.on('friend-message-received', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.friendMessageReceived.emit(msgObj);
        });
    }

    public userIsTyping(isTyping: boolean, friend: User, sender: User): void {
        const typingObj = {
            isTyping: isTyping,
            sender: sender.id,
            receiver: friend.id
        };

        this.socket.emit('user-typed', typingObj);
    }

    private listenForFriendIsTyping(): void {
        this.socket.on('friend-typed', typingObj => {
            this.isFriendTyping.emit(typingObj);
        });
    }

    // --- Invite to Match ---
    public sendMatchInvite(friend: User, user: User, outerApp: string): void {
        const msgObj: OuterAppInfo = {
            sender: user.name,
            senderId: user.id,
            receiverId: friend.id,
            outerApp: outerApp,
            type: 'sent'
        };

        this.socket.emit('match-invite-send', msgObj);
        this.matchInviteSent.emit(msgObj);
    }

    sendMatchInviteFromMessageBox(friend: User) {
        this.matchInviteSentFromMessageBox.emit(friend);
    }

    private listenForMatchInviteReceived(): void {
        this.socket.on('match-invite-received', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.matchInviteReceived.emit(msgObj);
        });
    }

    public matchInviteAccept(friendId: string, user: User, outerApp: string): void {
        const msgObj: OuterAppInfo = {
            sender: user.name,
            senderId: user.id,
            receiverId: friendId,
            outerApp: outerApp,
            type: 'sent'
        };

        this.socket.emit('match-invite-accept', msgObj);
    }

    private listenForMatchInviteAccept(): void {
        this.socket.on('match-invite-accept', msgObj => {
            msgObj.datetime = moment().format('hh:mm a');
            msgObj.type = 'received';

            this.matchInviteAccepted.emit(msgObj);
        });
    }

    public matchInviteCancel(friendId: string, user: User, outerApp: string): void {
        const msgObj: OuterAppInfo = {
            sender: user.name,
            senderId: user.id,
            receiverId: friendId,
            outerApp: outerApp,
            type: 'sent'
        };

        this.socket.emit('match-invite-cancel', msgObj);
    }

    private listenForMatchInviteCancel(): void {
        this.socket.on('match-invite-cancel', msgObj => {
            msgObj.type = 'received';

            this.matchInviteCanceled.emit();
        });
    }

}
