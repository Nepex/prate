// Angular
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from 'src/app/shared/models/generic';
import { FriendService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';

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

    // UI
    messages: AlertMessage[] = [];

    constructor(public activeModal: NgbActiveModal, private friendService: FriendService) {
        window.onpopstate = () => {
            this.activeModal.close('cancel');
            return null;
        };
     }

    ngOnInit(): void {
        this.getFriendRequests();
        this.friendRequestReceivedSub = this.friendService.friendRequestReceived.subscribe(msgObj => this.getFriendRequests());
    }

    getFriendRequests(): void {
        if (this.loadingRequest) {
            return;
        }

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
            this.friendService.sendAcceptedFriendRequest(this.user.id, id);
            this.messages.push({ message: 'Friend request accepted', type: 'success' });
            this.handleFriendRequest = null;
        }, err => {
            this.messages.push({ message: err.error[0], type: 'error' });
            this.handleFriendRequest = null;
        });
    }

    denyFriendRequest(id: string): void {
        this.messages = [];
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
            this.messages.push({ message: 'Friend request denied', type: 'success' });

            this.handleFriendRequest = null;
        }, err => {
            this.messages.push({ message: err.error[0], type: 'error' });
            this.handleFriendRequest = null;
        });
    }
}
