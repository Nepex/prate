import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/services/user/user';
import { UserService } from 'src/app/services/user/user.service';
import { AlertMessages } from 'src/app/shared/alert-messages/alert-messages.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'prt-change-avatar-modal',
    templateUrl: './change-avatar-modal.component.html',
    styleUrls: ['./change-avatar-modal.component.css']
})
export class ChangeAvatarModalComponent implements OnInit {
    @Input() user: User;
    messages: AlertMessages[];
    loadingRequest: Observable<any>;

    avatarForm: FormGroup = new FormGroup({
        avatar: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService) { }

    ngOnInit(): void {
        this.avatarForm.controls.avatar.setValue(this.user.avatar);
    }

    applyChanges() {
        this.messages = [];
        this.avatarForm['submitted'] = true;

        if (!this.avatarForm.valid) {
            return;
        }

        if (this.loadingRequest) {
            return;
        }

        const body: any = {
            id: this.user.id,
            avatar: this.avatarForm.value.avatar,
        };

        this.loadingRequest = this.userService.updateUserAvatar(body);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.avatarForm['submitted'] = false;
            this.messages.push({ message: 'Avatar updated', type: 'success' });

            this.userService.avatarChanged.emit();
        }, err => {
            this.loadingRequest = null;
            this.avatarForm['submitted'] = false;
            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
        });
    };
}
