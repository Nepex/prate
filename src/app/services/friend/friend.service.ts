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
    public friendRequestReceived: EventEmitter<FriendRequest> = new EventEmitter();
    public friendRequestHandled: EventEmitter<string> = new EventEmitter();

    public socket: io.Socket;

    private user: User;

    constructor(private sessionService: SessionService, private http: HttpClient) { }

    // Socket initiation //
    private connect(): void {
        this.socket = io(`${environment.apiServer}/friends`, {
            path: `${environment.socketIoServer}`
        });

        this.listenForReceivedFriendRequests();
        this.listenForReceivedOnlineFriends();
    }

    public disconnect(): void {
        this.socket.disconnect();
        // this.userDisconnected.emit();
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

    // Info getters //
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

    public listenForReceivedOnlineFriends(): void {
        this.socket.on('receive-online-friends', msgObj => {
            this.onlineFriendsReceived.emit(msgObj);
        });
    }

    // Friend requests //
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

        console.log(msgObj);

        this.socket.emit('friend-request-send', msgObj);
    }

    public listenForReceivedFriendRequests(): void {
        this.socket.on('friend-request-received', msgObj => {
            this.friendRequestReceived.emit(msgObj);
        });
    }

    public acceptFriendRequest(id: string): Observable<User> {
        const url = `${this.apiUrl}/accept-friend-request/${id}`;

        const req = this.http.put<User>(url, null).pipe(map(res => res));

        return req;
    }

    public denyFriendRequest(id: string): Observable<User> {
        const url = `${this.apiUrl}/deny-friend-request/${id}`;

        const req = this.http.put<User>(url, null).pipe(map(res => res));

        return req;
    }

    public removeFriend(id: string): Observable<User> {
        const url = `${this.apiUrl}/remove-friend/${id}`;

        const req = this.http.put<User>(url, null).pipe(map(res => res));

        return req;
    }

    public emitFriendRequestHandled(id: string): void {
        this.friendRequestHandled.emit(id);
    }
}
