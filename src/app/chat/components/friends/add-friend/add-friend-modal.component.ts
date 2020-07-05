// Angular
import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from '../../../../shared/alert-messages/alert-messages.component';
import { FriendService } from '../../../../services/friend/friend.service';
import { SubmittableFormGroup } from '../../../../shared/submittable-form-group/submittable-form-group';
import { User } from '../../../../services/user/user';

// Modal for adding friends by email
@Component({
    selector: 'prt-add-friend-modal',
    templateUrl: './add-friend-modal.component.html',
    styleUrls: ['./add-friend-modal.component.css']
})
export class AddFriendModalComponent {
    // Component inputs
    @Input() user: User;

    // Subs
    loadingRequest: Observable<User>;

    // UI
    messages: AlertMessage[];

    // Forms
    emailRegex: RegExp = /^[^@]+@[^@]+\.[^@]+$/;
    addFriendForm: SubmittableFormGroup = new SubmittableFormGroup({
        email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern(this.emailRegex)]),
    });
    constructor(public activeModal: NgbActiveModal, private friendService: FriendService) {}

    sendFriendRequest(): void {
        this.messages = [];
        this.addFriendForm['submitted'] = true;

        if (!this.addFriendForm.valid || this.loadingRequest) {
            return;
        }

        const body = {
            email: this.addFriendForm.value.email
        };

        this.loadingRequest = this.friendService.createFriendRequest(body);

        this.loadingRequest.subscribe(res => {
            this.addFriendForm.reset();
            this.addFriendForm['submitted'] = false;
            this.messages.push({ message: 'Friend Request Sent', type: 'success' });
            this.friendService.sendFriendRequest(this.user, null, body.email);
            this.loadingRequest = null;
        }, err => {
            this.addFriendForm.reset();
            this.addFriendForm['submitted'] = false;
            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
            this.loadingRequest = null;
        });
    };
}
