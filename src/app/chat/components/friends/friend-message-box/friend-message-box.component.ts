// Angular
import { Component, OnInit, Input } from '@angular/core';

// NPM

// App
import { FriendMessageData } from '../../../../services/friend/friend-message-data';
import { User } from '../../../../services/user/user';

// Modal for reviewing friend requests
@Component({
    selector: 'prt-friend-message-box',
    templateUrl: './friend-message-box.component.html',
    styleUrls: ['./friend-message-box.component.css']
})
export class FriendMessageBoxComponent implements OnInit {
    @Input() user: User;
    @Input() friendData: FriendMessageData;

    constructor() { }

    ngOnInit(): void {
    }
}
