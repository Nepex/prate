// Angular
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';

// App
import { AddFriendModalComponent } from '../add-friend/add-friend-modal.component';
import { ConfirmationModalComponent } from '../../../../shared/confirmation/confirmation-modal.component';
import { FriendRequestsModalComponent } from '../friend-requests/friend-requests-modal.component';
import { FriendService } from '../../../../services/friend/friend.service';
import { User } from '../../../../services/user/user';
import { UserService } from '../../../../services/user/user.service';
import { ViewUserProfileModalComponent } from '../../profile/view-user-profile/view-user-profile-modal.component';

// Component for displaying friendlist
@Component({
    selector: 'prt-friendlist',
    templateUrl: './friendlist.component.html',
    styleUrls: ['./friendlist.component.css'],
    animations: [
        trigger('slideInOut', [
            state('show', style({
                left: '0px',
            })),
            state('hide', style({
                left: '-300px'
            })),
            transition('show => hide', [
                animate('.25s')
            ]),
            transition('hide => show', [
                animate('.25s')
            ]),
        ]),
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('300ms ease-in', style({ opacity: '1.0' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ opacity: '0' }))
            ])
        ]),
        trigger('showHide', [
            state('show', style({
                opacity: 1,
                transform: 'scaleY(1)',
                'transform-origin': 'top',
                height: 'auto'
            })),
            state('hide', style({
                opacity: 0,
                'transform-origin': 'top',
                transform: 'scaleY(0)',
                height: '0',
                display: 'block',
                overflow: 'hidden'
            })),
            transition('show => hide', [
                animate('.4s ease')
            ]),
            transition('hide => show', [
                animate('.4s ease')
            ]),
        ]),
    ]
})
export class FriendListComponent implements OnInit {
    // Component Inputs
    @Input() showFriends: boolean = false;
    @Input() user: User;
    @Input() partner: User;
    @Input() matching: boolean;

    // Component Outputs
    @Output() friendlistClosed: EventEmitter<boolean> = new EventEmitter();

    // Subs
    loadingRequest: Observable<User[]>;
    getUserRequest: Observable<User>;
    onlineFriendsReceivedSub: Subscription;
    checkFriendStatusReceivedSub: Subscription;
    acceptedFriendRequestSentSub: Subscription;
    acceptedFriendRequestReceivedSub: Subscription;

    // UI
    userStatus: string = 'online';
    hideOnlineFriends: boolean = false;
    hideOfflineFriends: boolean = false;

    // Data Stores
    friends: User[];
    onlineUsers: User[] = [];
    offlineUsers: User[] = [];

    constructor(private modal: NgbModal, private friendService: FriendService, private userService: UserService) { }

    ngOnInit(): void {
        this.onlineFriendsReceivedSub = this.friendService.onlineFriendsReceived.subscribe(msgObj => this.initFriendlist(msgObj));
        this.checkFriendStatusReceivedSub = this.friendService.checkFriendStatusReceived.subscribe(msgObj => this.pushAcceptedFriend(msgObj));

        this.acceptedFriendRequestSentSub = this.friendService.acceptedFriendRequestSent.subscribe(id => this.acceptedFriendRequestSent(id));
        this.acceptedFriendRequestReceivedSub = this.friendService.acceptedFriendRequestReceived.subscribe(msgObj => this.acceptedFriendRequestReceived(msgObj));
    }

    initFriendlist(onlineFriends: User[]): void {
        this.loadingRequest = this.friendService.getFriends();

        this.loadingRequest.subscribe(res => {
            this.friends = res;
            this.offlineUsers = res;

            this.offlineUsers.forEach(offlineUser => {
                onlineFriends.forEach(onlineUser => {
                    if (onlineUser.id === offlineUser.id) {
                        this.offlineUsers.splice(this.offlineUsers.indexOf(offlineUser), 1)
                        this.onlineUsers.push(onlineUser);
                    }
                });
            });

            console.log(this.offlineUsers, this.onlineUsers);

            this.loadingRequest = null;
        }, err => {
            this.loadingRequest = null;
        });
    }

    acceptedFriendRequestSent(id: string): void {
        this.friendService.checkFriendStatusSend(id);
    }

    pushAcceptedFriend(user: User): void {
        if (user.status === 'offline') {
            if (this.getUserRequest) {
                return;
            }

            this.getUserRequest = this.userService.getById(user.id);

            this.getUserRequest.subscribe(res => {
                const user = {
                    id: res.id,
                    name: res.name,
                    avatar: res.avatar,
                    status: 'offline'
                };

                this.offlineUsers.push(user)
                this.sortFriends();
                this.getUserRequest = null;
            });
        } else {
            this.onlineUsers.push(user);
            this.sortFriends();
        }
    }

    acceptedFriendRequestReceived(user: User): void {
        this.onlineUsers.push(user);
        this.sortFriends();
    }

    toggleUserStatus(): void {
        if (this.userStatus === 'matching' || this.partner) {
            return;
        }

        if (this.userStatus === 'online') {
            this.userStatus = 'away';
        } else {
            this.userStatus = 'online';
        }
    }

    confirmRemoveFriend(user: User): void {
        const modalRef = this.modal.open(ConfirmationModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.message = `Are you sure you want to remove '${user.name}' from your friendlist?`;
        
        modalRef.result.then((result) => {
            this.removeFriend(user.id);
        }, (reason) => { });
    }

    removeFriend(id: string): void {
        console.log('friend will be removed');
        // splice, db call, emits
    }

    openAddFriendModal(): void {
        const modalRef = this.modal.open(AddFriendModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.user = this.user;
    }

    openFriendRequestsModal(): void {
        const modalRef = this.modal.open(FriendRequestsModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.user = this.user;
    }

    openViewUserProfileModal(id: string): void {
        const modalRef = this.modal.open(ViewUserProfileModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.userBeingViewedId = id;
        modalRef.componentInstance.currentUser = this.user;
    }

    closeFriendList(): void {
        this.friendlistClosed.emit();
    }

    sortFriends(): void {
        this.onlineUsers = _.sortBy(this.onlineUsers, function (o) { return o.name; });
        this.offlineUsers = _.sortBy(this.offlineUsers, function (o) { return o.name; });
    }
}
