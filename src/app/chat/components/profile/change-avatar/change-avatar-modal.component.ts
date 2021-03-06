// Angular
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

// NPM
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from '../../../../shared/alert-messages/alert-messages.component';
import { FriendService } from '../../../../services/friend/friend.service';
import { User } from '../../../../services/user/user';
import { UserService } from '../../../../services/user/user.service';

// Modal for changing the user's profile avatar picture
@Component({
    selector: 'prt-change-avatar-modal',
    templateUrl: './change-avatar-modal.component.html',
    styleUrls: ['./change-avatar-modal.component.css']
})
export class ChangeAvatarModalComponent implements OnInit {
    // Component Inputs
    @Input() user: User;

    // Subs
    loadingRequest: Observable<User>;

    // UI
    messages: AlertMessage[];
    selectedAvatar: string;
    avatars: { name: string }[] = [
        { name: 'default.png' },
        { name: 'male1.png' },
        { name: 'male2.png' },
        { name: 'male3.png' },
        { name: 'male4.png' },
        { name: 'male5.png' },
        { name: 'male6.png' },
        { name: 'male7.png' },
        { name: 'male8.png' },
        { name: 'male9.png' },
        { name: 'male10.png' },
        { name: 'male11.png' },
        { name: 'male12.png' },
        { name: 'male13.png' },
        { name: 'male14.png' },
        { name: 'male15.png' },
        { name: 'male16.png' },
        { name: 'male17.png' },
        { name: 'male18.png' },
        { name: 'male19.png' },
        { name: 'male20.png' },
        { name: 'male21.png' },
        { name: 'female1.png' },
        { name: 'female2.png' },
        { name: 'female3.png' },
        { name: 'female4.png' },
        { name: 'female5.png' },
        { name: 'female6.png' },
        { name: 'female7.png' },
        { name: 'female8.png' },
        { name: 'female9.png' },
        { name: 'female10.png' },
        { name: 'female11.png' },
        { name: 'female12.png' },
        { name: 'female13.png' },
        { name: 'female14.png' }

    ];

    constructor(public activeModal: NgbActiveModal, private userService: UserService, private modal: NgbModal, private friendService: FriendService) { }

    ngOnInit(): void {
        this.selectedAvatar = this.user.avatar;
    }

    selectAvatar(avatar: string): void {
        this.selectedAvatar = avatar;
    }

    applyChanges(): void {
        this.messages = [];

        if (this.loadingRequest) {
            return;
        }

        const body: User = {
            id: this.user.id,
            avatar: this.selectedAvatar,
        };

        this.loadingRequest = this.userService.updateUserAvatar(body);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;

            const friendData = {
                id: this.user.id,
                name: this.user.name,
                avatar: this.selectedAvatar,
                status: this.user.status
            };
            
            this.friendService.sendFriendDataChange(friendData);

            this.userService.avatarChanged.emit(this.selectedAvatar);
            this.activeModal.dismiss();
        }, err => {
            this.loadingRequest = null;
            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
        });
    };
}
