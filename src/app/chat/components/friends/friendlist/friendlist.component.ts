// Angular
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AddFriendModalComponent } from '../add-friend/add-friend-modal.component';
import { FriendRequestsModalComponent } from '../friend-requests/friend-requests-modal.component';
import { FriendService } from 'src/app/services/friend/friend.service';
import { User } from 'src/app/services/user/user';

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
        ])
    ]
})
export class FriendListComponent {
    // Component Inputs
    @Input() showFriends: boolean = false;
    @Input() user: User;
    @Input() partner: User;
    @Input() matching: boolean;

    // Component Outputs
    @Output() friendlistClosed: EventEmitter<boolean> = new EventEmitter();

    // Subs

    // UI
    userStatus: string = 'online';
    onlineUsers = [];
    offlineUsers = [];

    constructor(private modal: NgbModal, private friendService: FriendService) { }

    toggleUserStatus(): void {
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
}
