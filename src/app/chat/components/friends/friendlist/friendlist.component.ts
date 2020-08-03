// Angular
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

// NPM
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';

// App
import { AddFriendModalComponent } from '../add-friend/add-friend-modal.component';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ConfirmationModalComponent } from '../../../../shared/confirmation/confirmation-modal.component';
import { FriendMessageData } from '../../../../services/friend/friend-message-data';
import { FriendRequestsModalComponent } from '../friend-requests/friend-requests-modal.component';
import { FriendService } from '../../../../services/friend/friend.service';
import { OuterAppInviteModalComponent } from '../../invites/outer-app-invite/outer-app-invite-modal.component';
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
    @Input() friendsWithUnreadMessages: string[];
    @Input() messageData: FriendMessageData[];

    // Component Outputs
    @Output() friendlistClosed: EventEmitter<boolean> = new EventEmitter();
    @Output() messageBoxOpened: EventEmitter<User> = new EventEmitter();

    // Subs
    loadingRequest: Observable<User[]>;
    getUserRequest: Observable<User>;
    removeFriendRequest: Observable<User>;

    onlineFriendsReceivedSub: Subscription;
    checkFriendStatusReceivedSub: Subscription;
    friendDataChangedReceivedSub: Subscription;

    acceptedFriendRequestSentSub: Subscription;
    acceptedFriendRequestReceivedSub: Subscription;
    friendRemovalReceivedSub: Subscription;

    matchInviteAcceptedSub: Subscription;
    matchInviteCanceledSub: Subscription;
    matchInviteSentFromMessageBoxSub: Subscription;

    // UI
    hideOnlineFriends: boolean = false;
    hideOfflineFriends: boolean = false;
    matchInviteModal: NgbModalRef;

    // Data Stores
    friends: User[];
    onlineUsers: User[] = [];
    offlineUsers: User[] = [];

    constructor(private modal: NgbModal, private friendService: FriendService, private userService: UserService, private chatService: ChatService) { }

    ngOnInit(): void {
        this.onlineFriendsReceivedSub = this.friendService.onlineFriendsReceived.subscribe(msgObj => this.initFriendlist(msgObj));
        this.checkFriendStatusReceivedSub = this.friendService.checkFriendStatusReceived.subscribe(msgObj => this.pushAcceptedFriend(msgObj));

        this.acceptedFriendRequestSentSub = this.friendService.acceptedFriendRequestSent.subscribe(id => this.acceptedFriendRequestSent(id));
        this.acceptedFriendRequestReceivedSub = this.friendService.acceptedFriendRequestReceived.subscribe(msgObj => this.acceptedFriendRequestReceived(msgObj));
        this.friendRemovalReceivedSub = this.friendService.friendRemovalReceived.subscribe(msgObj => this.spliceRemovedFriend(msgObj.id));

        this.friendDataChangedReceivedSub = this.friendService.friendDataChangeReceived.subscribe(msgObj => this.updateFriendData(msgObj));

        this.matchInviteCanceledSub = this.friendService.matchInviteCanceled.subscribe(() => this.matchInviteCanceled());
        this.matchInviteAcceptedSub = this.friendService.matchInviteAccepted.subscribe(msgObj => this.matchInviteAccepted(msgObj));

        this.matchInviteSentFromMessageBoxSub = this.friendService.matchInviteSentFromMessageBox.subscribe(msgObj => this.sendMatchInvite(msgObj));
    }

    // --- General Purpose Functions ---
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

            this.loadingRequest = null;
        }, err => {
            this.loadingRequest = null;
        });
    }

    openMessageBox(user: User) {
        this.messageBoxOpened.emit(user);
    }

    openViewUserProfileModal(id: string): void {
        const modalRef = this.modal.open(ViewUserProfileModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.userBeingViewedId = id;
        modalRef.componentInstance.currentUser = this.user;
    }

    sortFriends(): void {
        this.onlineUsers = _.sortBy(this.onlineUsers, function (o) { return o.name.toLowerCase(); });
        this.offlineUsers = _.sortBy(this.offlineUsers, function (o) { return o.name.toLowerCase(); });
    }

    closeFriendList(): void {
        this.friendlistClosed.emit();
    }

    // --- Friend Data Changers ---
    toggleUserStatus(): void {
        if (this.user.status === 'matching' || this.user.status === 'matched') {
            return;
        }

        if (this.user.status === 'online') {
            this.user.status = 'away';
        } else if (this.user.status === 'away') {
            this.user.status = 'dnd';
        } else if (this.user.status === 'dnd') {
            this.user.status = 'online';
        }

        this.friendService.sendFriendDataChange(this.user)
    }

    updateFriendData(user: User) {
        this.onlineUsers.forEach(onlineFriend => {
            if (onlineFriend.id === user.id) {
                onlineFriend.name = user.name;
                onlineFriend.avatar = user.avatar;
                onlineFriend.status = user.status;

                if (user.status === 'offline') {
                    this.onlineUsers.splice(this.onlineUsers.indexOf(onlineFriend), 1);
                    this.offlineUsers.push(onlineFriend);
                }
            }
        });

        if (user.status === 'online' && user.firstConnect) {
            this.offlineUsers.forEach(offlineFriend => {
                if (offlineFriend.id === user.id) {
                    this.offlineUsers.splice(this.offlineUsers.indexOf(offlineFriend), 1);
                    offlineFriend.status = 'online';
                    this.onlineUsers.push(offlineFriend);
                }
            });
        }

        this.sortFriends();
    }

    // --- Friend Request Handles ---
    openAddFriendModal(): void {
        const modalRef = this.modal.open(AddFriendModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.user = this.user;
    }

    openFriendRequestsModal(): void {
        const modalRef = this.modal.open(FriendRequestsModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.user = this.user;
    }

    // Called when a friend request is accepted sender-side
    acceptedFriendRequestSent(id: string): void {
        this.friendService.checkFriendStatusSend(id);
    }

    // When adding a friend, check to see if they're online/offline, then pushes them into friendlist
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

    // --- Friend Remove Handles ---
    confirmRemoveFriend(user: User): void {
        const modalRef = this.modal.open(ConfirmationModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.message = `Are you sure you want to remove '${user.name}' from your friendlist?`;

        modalRef.result.then((result) => {
            this.removeFriend(user.id);
        }, (reason) => { });
    }

    removeFriend(id: string): void {
        if (this.removeFriendRequest) {
            return;
        }

        this.removeFriendRequest = this.friendService.removeFriend(id);

        this.removeFriendRequest.subscribe(res => {
            this.friendService.sendFriendRemoval(this.user.id, id);
            this.spliceRemovedFriend(id);
            this.removeFriendRequest = null;
        }, err => {
            this.removeFriendRequest = null;
        });
    }

    spliceRemovedFriend(id: string): void {
        for (let i = 0; i < this.onlineUsers.length; i++) {
            if (id === this.onlineUsers[i].id) {
                this.onlineUsers.splice(i, 1);
            }
        }

        for (let i = 0; i < this.offlineUsers.length; i++) {
            if (id === this.offlineUsers[i].id) {
                this.offlineUsers.splice(i, 1);
            }
        }
    }

    // --- Match Invites ---
    sendMatchInvite(friend: User): void {
        this.friendService.sendMatchInvite(friend, this.user, 'match');

        this.matchInviteModal = this.modal.open(OuterAppInviteModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        this.matchInviteModal.componentInstance.type = 'sent';

        this.matchInviteModal.result.then(res => {
            if (res === 'cancel') {
                this.friendService.matchInviteCancel(friend.id, this.user, 'match');
            }
        });
    }

    matchInviteCanceled(): void {
        if (this.matchInviteModal) {
            this.matchInviteModal.close();
        }
    }

    matchInviteAccepted(obj): void {
        if (this.matchInviteModal) {
            this.matchInviteModal.close();
        }
    }
}
