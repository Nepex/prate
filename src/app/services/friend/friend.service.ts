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

    public friendRequestReceived: EventEmitter<FriendRequest> = new EventEmitter();

    public socket: io.Socket;

    private user: User;

    constructor(private sessionService: SessionService, private http: HttpClient) { }

    private connect(): void {
        this.socket = io(`${environment.apiServer}/friends`, {
            path: `${environment.socketIoServer}`
        });

        this.listenForReceivedFriendRequests();
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
            friend_requests: user.friend_requests,
            email: user.email
        };

        this.socket.emit('storeUserInfo', this.user);
    }

    public getFriends(): Observable<User[]> {
        const url = `${this.apiUrl}/get-friends`;

        const req = this.http.get<User[]>(url);

        return req;
    }

    public createFriendRequest(receiver: User): Observable<User> {
        const url = `${this.apiUrl}/send-friend-request`;

        const req = this.http.put<User>(url, receiver).pipe(map(res => res));

        return req;
    }

    public sendFriendRequest(sender: User, receiver: User, receiverEmail?: string): void {
        const msgObj: FriendRequest = {
            senderId: sender.id,
            senderName: sender.name,
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
}
