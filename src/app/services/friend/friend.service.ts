// Angular
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// NPM
import * as io from 'socket.io-client';

// App
import { environment } from './../../../environments/environment';
import { FriendRequest } from './friend-request';
import { SessionService } from '../session/session.service';
import { User } from './../user/user';
import { Observable } from 'rxjs';

// Service for managing chat connections
@Injectable()
export class FriendService {
    private apiUrl = `${environment.apiBaseUrl}/friends`;

    public onlineFriendsReceived: EventEmitter<User[]> = new EventEmitter();
    public checkFriendStatusReceived: EventEmitter<User> = new EventEmitter();
    public friendRequestReceived: EventEmitter<FriendRequest> = new EventEmitter();
    public friendRequestHandled: EventEmitter<string> = new EventEmitter();

    public acceptedFriendRequestSent: EventEmitter<string> = new EventEmitter();
    public acceptedFriendRequestReceived: EventEmitter<User> = new EventEmitter();

    public socket: io.Socket;

    private user: User;

    constructor(private sessionService: SessionService, private http: HttpClient) { }

    // --- Connect/disconnect and initialization ---
    private connect(): void {
        this.socket = io(`${environment.apiServer}/friends`, {
            path: `${environment.socketIoServer}`
        });

        this.listenForReceivedFriendRequests();
        this.listenForReceivedOnlineFriends();
        this.listenForAcceptedFriendRequest();
        this.listenForCheckFriendStatusReceived();
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
    

    // --- Changing Status/Name/Avatar

    // --- Messaging ---
}
