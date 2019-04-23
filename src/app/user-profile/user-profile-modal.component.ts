import { UserService } from './../services/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertMessages } from '../shared/alert-messages/alert-messages.component';
import { Observable } from 'rxjs';
import { User } from '../services/user/user';

@Component({
    selector: 'prt-user-profile-modal',
    templateUrl: './user-profile-modal.component.html',
    styleUrls: ['./user-profile-modal.component.css']
})
export class UserProfileModalComponent implements OnInit {
    @Input() user: User;
    messages: AlertMessages[];
    loadingRequest: Observable<any>;
    userRegex = /^[a-zA-Z0-9]*$/;
    profileForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        font_face: new FormControl('', [Validators.required, Validators.maxLength(25)]),
        font_color: new FormControl('', [Validators.required, Validators.maxLength(9)]),
        bubble_color: new FormControl('', [Validators.required, Validators.maxLength(9)]),
        interests: new FormControl('', []),
        oldPassword: new FormControl('', [Validators.maxLength(255), Validators.minLength(5)]),
        newPassword: new FormControl('', [Validators.maxLength(255), Validators.minLength(5)])
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService) { }

    ngOnInit(): void {
        console.log(this.user);
        this.profileForm.controls.name.setValue(this.user.name);
        this.profileForm.controls.font_face.setValue(this.user.font_face);
        this.profileForm.controls.font_color.setValue('#' + this.user.font_color);
        this.profileForm.controls.bubble_color.setValue('#' + this.user.bubble_color);

        this.profileForm.controls.interests.setValue(this.user.interests ? this.user.interests : []);
    }

    applyChanges() {
        this.messages = [];
        this.profileForm['submitted'] = true;

        if (this.profileForm.value.oldPassword || this.profileForm.value.newPassword) {
            this.profileForm.controls.oldPassword.setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(5)]);
            this.profileForm.controls.newPassword.setValidators([Validators.required, Validators.maxLength(255), Validators.minLength(5)]);
            this.profileForm.controls.oldPassword.updateValueAndValidity();
            this.profileForm.controls.newPassword.updateValueAndValidity();
        } else {
            this.profileForm.controls.oldPassword.setValidators([Validators.maxLength(255), Validators.minLength(5)]);
            this.profileForm.controls.newPassword.setValidators([Validators.maxLength(255), Validators.minLength(5)]);
            this.profileForm.controls.oldPassword.updateValueAndValidity();
            this.profileForm.controls.newPassword.updateValueAndValidity();
        }

        if (!this.profileForm.valid) {
            return;
        }

        if (this.loadingRequest) {
            return;
        }

        const body: any = {
            id: this.user.id,
            name: this.profileForm.value.name,
            font_face: this.profileForm.value.font_face,
            font_color: this.profileForm.value.font_color.substring(1),
            bubble_color: this.profileForm.value.bubble_color.substring(1),
            interests: this.profileForm.value.interests ? this.profileForm.value.interests : []
        };

        console.log(body);

        if (this.profileForm.value.oldPassword && this.profileForm.value.newPassword) {
            body.oldPassword = this.profileForm.value.oldPassword;
            body.newPassword = this.profileForm.value.newPassword;
        }

        this.loadingRequest = this.userService.updateUser(body);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.profileForm['submitted'] = false;
            this.messages.push({ message: 'Settings saved', type: 'success' });
        }, err => {
            this.loadingRequest = null;
            this.profileForm['submitted'] = false;
            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
        });
    };

    toggleInterest(val) {
        const idx = this.profileForm.value.interests.indexOf(val);

        if (idx > -1) {
            this.profileForm.value.interests.splice(idx, 1);
        } else {
            this.profileForm.value.interests.push(val);
        }
    }
}
