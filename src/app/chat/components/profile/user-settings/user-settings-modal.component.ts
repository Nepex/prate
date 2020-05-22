import { UserService } from '../../../../services/user/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertMessages } from '../../../../shared/alert-messages/alert-messages.component';
import { Observable } from 'rxjs';
import { User } from '../../../../services/user/user';
import { LevelService } from '../../../../services/level/level.service';
import { ChangeAvatarModalComponent } from '../change-avatar/change-avatar-modal.component';
import { SubmittableFormGroup } from 'src/app/shared/submittable-form-group/submittable-form-group';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
    selector: 'prt-user-settings-modal',
    templateUrl: './user-settings-modal.component.html',
    styleUrls: ['./user-settings-modal.component.css'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ height: '0%', opacity: '0' }),
                animate('300ms ease-in', style({ height: '20%', opacity: '1.0'}))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ height: '0%', opacity: '0'  }))
            ])
        ])
    ]
})
export class UserSettingsModalComponent implements OnInit {
    user: User;
    messages: AlertMessages[];
    loadingRequest: Observable<any>;
    customInterests: string[] = [];
    customInterestsValidators = [this.customInterestMaxLength];
    customInterestsErrors = { 'customInterestMaxLength': 'Too many characters' };

    showChangePassword: boolean = false;
    showMiscOpts: boolean = false;
    showBio: boolean = false;
    showInterests: boolean = false;

    bioLeftLength: any = 200;

    expCurValue: number;
    expMaxValue: number;

    private customInterestMaxLength(control: FormControl) {
        if (control.value.length > 20) {
            return {
                'customInterestMaxLength': true
            };
        }

        return null;
    }

    userRegex = /^[a-zA-Z0-9]*$/;
    profileForm: SubmittableFormGroup = new SubmittableFormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        font_face: new FormControl('', [Validators.required, Validators.maxLength(25)]),
        font_color: new FormControl('', [Validators.required, Validators.maxLength(9)]),
        bubble_color: new FormControl('', [Validators.required, Validators.maxLength(9)]),
        interests: new FormControl('', []),
        show_avatars: new FormControl('', [Validators.required]),
        bubble_layout: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        color_theme: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        enforce_interests: new FormControl('', [Validators.required]),
        sounds: new FormControl('', [Validators.required]),
        bio: new FormControl('', [Validators.maxLength(200)]),
        oldPassword: new FormControl('', [Validators.maxLength(255), Validators.minLength(5)]),
        newPassword: new FormControl('', [Validators.maxLength(255), Validators.minLength(5)])
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService, private modal: NgbModal,
        private levelService: LevelService) { }

    ngOnInit(): void {
        this.getUser();

        this.profileForm.controls['bio'].valueChanges.subscribe((v) => {
            if (!v) {
                this.bioLeftLength = 200;

                return;
            }

            this.bioLeftLength = 200 - v.length;

            if (this.bioLeftLength < 0) {
                this.bioLeftLength = 'Limit exceeded';
            }
        });
    }

    getUser() {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(this.user.experience);
            this.expCurValue = this.levelService.getCurExpBarValue(this.user.levelInfo, this.user.experience);
            this.expMaxValue = this.levelService.getMaxExpBarValue(this.user.levelInfo);

            this.initFormValues();

            this.loadingRequest = null;
        });
    }

    initFormValues() {
        this.pushCustomInterestsToInput();
        this.profileForm.controls.name.setValue(this.user.name);
        this.profileForm.controls.font_face.setValue(this.user.font_face);
        this.profileForm.controls.font_color.setValue('#' + this.user.font_color);
        this.profileForm.controls.bubble_color.setValue('#' + this.user.bubble_color);
        this.profileForm.controls.show_avatars.setValue(this.user.show_avatars);
        this.profileForm.controls.bubble_layout.setValue(this.user.bubble_layout);
        this.profileForm.controls.color_theme.setValue(this.user.color_theme);
        this.profileForm.controls.enforce_interests.setValue(this.user.enforce_interests);
        this.profileForm.controls.sounds.setValue(this.user.sounds);
        this.profileForm.controls.bio.setValue(this.user.bio);

        this.profileForm.controls.interests.setValue(this.user.interests ? this.user.interests : []);

        this.expCurValue = this.levelService.getCurExpBarValue(this.user.levelInfo, this.user.experience);
        this.expMaxValue = this.levelService.getMaxExpBarValue(this.user.levelInfo);
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

        this.pushCustomInterestsToForm();

        const body: any = {
            id: this.user.id,
            name: this.profileForm.value.name,
            font_face: this.profileForm.value.font_face,
            font_color: this.profileForm.value.font_color.substring(1),
            bubble_color: this.profileForm.value.bubble_color.substring(1),
            interests: this.profileForm.value.interests ? this.profileForm.value.interests : [],
            experience: this.user.experience,
            show_avatars: this.profileForm.value.show_avatars,
            bubble_layout: this.profileForm.value.bubble_layout,
            color_theme: this.profileForm.value.color_theme,
            enforce_interests: this.profileForm.value.enforce_interests,
            sounds: this.profileForm.value.sounds,
            bio: this.profileForm.value.bio,
        };

        if (this.profileForm.value.oldPassword && this.profileForm.value.newPassword) {
            body.oldPassword = this.profileForm.value.oldPassword;
            body.newPassword = this.profileForm.value.newPassword;
        }

        this.loadingRequest = this.userService.updateUser(body);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.profileForm['submitted'] = false;
            this.messages.push({ message: 'Settings saved', type: 'success' });
            this.userService.userSettingsChanged.emit(body);
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

    pushCustomInterestsToForm() {
        for (let i = 0; i < this.customInterests.length; i++) {
            if (this.customInterests[i] !== 'movies/tv' && this.customInterests[i] !== 'music' && this.customInterests[i] !== 'gaming' && this.customInterests[i] !== 'books'
                && this.customInterests[i] !== 'education' && this.customInterests[i] !== 'sports' && this.customInterests[i] !== 'life' && this.customInterests[i] !== 'dating' &&
                this.profileForm.value.interests.indexOf(this.customInterests[i]) === -1) {
                this.profileForm.value.interests.push(this.customInterests[i].toLowerCase());
            }
        }
    }

    pushCustomInterestsToInput() {
        for (let i = 0; i < this.user.interests.length; i++) {
            if (this.user.interests[i] !== 'movies/tv' && this.user.interests[i] !== 'music' && this.user.interests[i] !== 'gaming' && this.user.interests[i] !== 'books'
                && this.user.interests[i] !== 'education' && this.user.interests[i] !== 'sports' && this.user.interests[i] !== 'life' && this.user.interests[i] !== 'dating') {
                this.customInterests.push(this.user.interests[i]);
            }
        }
    }

    onCustomInterestRemoved(e) {
        if (this.profileForm.value.interests.indexOf(e) > -1) {
            this.profileForm.value.interests.splice(this.profileForm.value.interests.indexOf(e), 1);
        }
    }

    openEditAvatar() {
        this.activeModal.close();
        const modalRef = this.modal.open(ChangeAvatarModalComponent, { centered: true, backdrop: 'static', keyboard: false });

        modalRef.componentInstance.user = this.user;
        modalRef.componentInstance.userSettingsRef = this;

        modalRef.result.then(() => {
        }, () => {
            this.modal.open(UserSettingsModalComponent, { centered: true, backdrop: 'static', keyboard: false });
        });
    }
}
