// Angular
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { FriendService } from 'src/app/services/friend/friend.service';
import { User } from 'src/app/services/user/user';

// Modal for reviewing friend requests
@Component({
    selector: 'prt-friend-requests-modal',
    templateUrl: './friend-requests-modal.component.html',
    styleUrls: ['./friend-requests-modal.component.css']
})
export class FriendRequestsModalComponent implements OnInit {
    // Component inputs
    @Input() user: User;

    // Subs
    loadingRequest: Observable<User[]>;
    handleFriendRequest: Observable<User>;
    friendRequestReceivedSub: Subscription;

    // Data stores
    friends: User[];

    constructor(public activeModal: NgbActiveModal, private friendService: FriendService) { }

    ngOnInit(): void {
        this.getFriendRequests();
        this.friendRequestReceivedSub = this.friendService.friendRequestReceived.subscribe(msgObj => this.getFriendRequests());
    }

    getFriendRequests() {
        this.loadingRequest = this.friendService.getFriendRequests();

        this.loadingRequest.subscribe(res => {
            this.friends = res;
            this.loadingRequest = null;
        }, err => {
            this.loadingRequest = null;
        });
    }

    acceptFriendRequest(id: string): void {
        if (this.handleFriendRequest) {
            return;
        }

        this.handleFriendRequest = this.friendService.acceptFriendRequest(id);

        this.handleFriendRequest.subscribe(res => {
            this.friends.forEach(friend => {
                if (friend.id === id) {
                    this.friends.splice(this.friends.indexOf(friend), 1)
                }
            });

            this.friendService.emitFriendRequestHandled(id);
            // emit to person their friend request was accepted, also add logic to friendlist to update accordingly
            this.handleFriendRequest = null;
        }, err => {
            this.handleFriendRequest = null;
        });
    }

    denyFriendRequest(id: string): void {
        if (this.handleFriendRequest) {
            return;
        }

        this.handleFriendRequest = this.friendService.denyFriendRequest(id);

        this.handleFriendRequest.subscribe(res => {
            this.friends.forEach(friend => {
                if (friend.id === id) {
                    this.friends.splice(this.friends.indexOf(friend), 1)
                }
            });

            this.friendService.emitFriendRequestHandled(id);
            this.handleFriendRequest = null;
        }, err => {
            this.handleFriendRequest = null;
        });
    }
}
