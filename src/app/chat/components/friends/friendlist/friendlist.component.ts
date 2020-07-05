// Angular
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AddFriendModalComponent } from '../add-friend/add-friend-modal.component';
import { FriendRequestsModalComponent } from '../friend-requests/friend-requests-modal.component';
import { FriendService } from 'src/app/services/friend/friend.service';
import { User } from 'src/app/services/user/user';
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
    onlineFriendsReceivedSub: Subscription;

    // UI
    userStatus: string = 'online';
    hideOnlineFriends: boolean = false;
    hideOfflineFriends: boolean = false;

    // Data Stores
    friends: User[];
    onlineUsers: User[] = [];
    offlineUsers: User[] = [];

    constructor(private modal: NgbModal, private friendService: FriendService) { }

    ngOnInit() {
        this.onlineFriendsReceivedSub = this.friendService.onlineFriendsReceived.subscribe(msgObj => this.initFriendlist(msgObj));
    }

    initFriendlist(onlineFriends: User[]) {
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

    closeFriendList(): void {
        this.friendlistClosed.emit();
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
}
