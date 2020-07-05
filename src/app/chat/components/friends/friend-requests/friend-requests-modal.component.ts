// Angular
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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

    // Data stores
    friends: User[];

    constructor(public activeModal: NgbActiveModal, private friendService: FriendService) { }

    ngOnInit(): void {
        this.loadingRequest = this.friendService.getFriends();

        this.loadingRequest.subscribe(res => {
            this.friends = res;
            console.log(this.friends);
            this.loadingRequest = null;
        }, err => {
            this.loadingRequest = null;
        });
    }

    acceptFriendRequest(id: string): void { }

    denyFriendRequest(id: string): void { }
}
