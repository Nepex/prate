// Angular
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { User } from '../../../shared/models';
import { UserService, LevelService, FriendService } from 'src/app/core/services';

// Modal for viewing a user's profile
@Component({
    selector: 'prt-view-user-profile-modal',
    templateUrl: './view-user-profile-modal.component.html',
    styleUrls: ['./view-user-profile-modal.component.scss']
})
export class ViewUserProfileModalComponent implements OnInit {
    // Component Inputs
    @Input() userBeingViewedId: string;
    @Input() currentUser: User;

    // Subs
    loadingRequest: Observable<User>;

    // Data Store
    userBeingViewed: User;

    // UI
    friendReqMessage: string;

    constructor(private userService: UserService, public activeModal: NgbActiveModal, private levelService: LevelService, private friendService: FriendService) {
        window.onpopstate = () => {
            this.activeModal.close();
            return null;
        };
    }

    ngOnInit(): void {
        this.loadingRequest = this.userService.getById(this.userBeingViewedId);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.userBeingViewed = res;
            console.log(res)
            this.userBeingViewed.levelInfo = this.levelService.getLevelInfo(this.userBeingViewed.experience);

            if (this.userBeingViewed.friend_requests.indexOf(this.currentUser.id) > -1) {
                this.friendReqMessage = 'Friend Request Sent';
            }

            if (this.currentUser.friend_requests.indexOf(this.userBeingViewedId) > -1) {
                this.friendReqMessage = `${this.userBeingViewed.name} has sent you a friend request`;
            }

            if (this.currentUser.friends.indexOf(this.userBeingViewedId) > -1) {
                this.friendReqMessage = `${this.userBeingViewed.name} is your friend`;
            }
        });
    }

    sendFriendRequest(): void {
        if (this.loadingRequest) {
            return;
        }

        const body = {
            id: this.userBeingViewedId
        };

        this.loadingRequest = this.friendService.createFriendRequest(body);

        this.loadingRequest.subscribe(res => {
            this.friendReqMessage = 'Friend Request Sent'

            const receiver = {
                id: this.userBeingViewedId,
                name: this.userBeingViewed.name
            }

            this.friendService.sendFriendRequest(this.currentUser, receiver);
            this.loadingRequest = null;
        }, err => {
            this.friendReqMessage = err.error[0];
            this.loadingRequest = null;
        });
    }
}