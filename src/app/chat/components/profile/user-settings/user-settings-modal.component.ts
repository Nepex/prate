// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

// NPM
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from '../../../../shared/alert-messages/alert-messages.component';
import { ChangeAvatarModalComponent } from '../change-avatar/change-avatar-modal.component';
import { LevelService } from '../../../../services/level/level.service';
import { SubmittableFormGroup } from '../../../../shared/submittable-form-group/submittable-form-group';
import { User } from '../../../../services/user/user';
import { UserService } from '../../../../services/user/user.service';

// Modal for managing user settings
@Component({
    selector: 'prt-user-settings-modal',
    templateUrl: './user-settings-modal.component.html',
    styleUrls: ['./user-settings-modal.component.css'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ height: '0%', opacity: '0' }),
                animate('300ms ease-in', style({ height: '20%', opacity: '1.0' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ height: '0%', opacity: '0' }))
            ])
        ])
    ]
})
export class UserSettingsModalComponent implements OnInit {
    // Subs
    loadingRequest: Observable<User>;

    // Data Stores
    user: User;

    // UI
    messages: AlertMessage[];
    customInterests: string[] = [];
    showInterests: boolean = false;
    showBio: boolean = false;
    bioLeftLength: any = 200;
    showChangePassword: boolean = false;
    showMiscOpts: boolean = false;
    expCurValue: number;
    expMaxValue: number;
    interests: { name: string; title: string; }[] = [
        { name: 'movies/tv', title: 'Movies/TV' },
        { name: 'music', title: 'Music' },
        { name: 'gaming', title: 'Gaming' },
        { name: 'books', title: 'Books' },
        { name: 'education', title: 'Education' },
        { name: 'sports', title: 'Sports' },
        { name: 'life', title: 'Life' },
        { name: 'dating', title: 'Dating' }
    ];

    // NGX Chips
    customInterestsValidators: any = [this.customInterestMaxLength];
    customInterestsErrors: ChipsValidators = { 'customInterestMaxLength': 'Too many characters' };
    private customInterestMaxLength(control: FormControl): ChipsValidators {
        if (control.value.length > 20) {
            return {
                'customInterestMaxLength': true
            };
        }

        return null;
    }

    // Forms
    userRegex: RegExp = /^[a-zA-Z0-9]*$/;
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
        img_previews: new FormControl('', [Validators.required]),
        bio: new FormControl('', [Validators.maxLength(200)]),
        oldPassword: new FormControl('', [Validators.maxLength(255), Validators.minLength(5)]),
        newPassword: new FormControl('', [Validators.maxLength(255), Validators.minLength(5)])
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService, private modal: NgbModal,
        private levelService: LevelService) { }

    ngOnInit(): void {
        this.setupModal();

        // Track amount of characters in bio message
        if (this.profileForm.value.bio) {
            this.bioLeftLength = this.bioLeftLength - this.profileForm.value.bio.length;
        }

        this.profileForm.controls['bio'].valueChanges.subscribe((v) => {
            this.bioLeftLength = this.bioLeftLength - v.length;

            if (this.bioLeftLength < 0) {
                this.bioLeftLength = 'Limit exceeded';
            }
        });
    }

    setupModal(): void {
        this.expCurValue = this.levelService.getCurExpBarValue(this.user.levelInfo, this.user.experience);
        this.expMaxValue = this.levelService.getMaxExpBarValue(this.user.levelInfo);

        this.initFormValues();
    }

    initFormValues(): void {
        this.profileForm.controls.name.setValue(this.user.name);
        this.profileForm.controls.font_face.setValue(this.user.font_face);
        this.profileForm.controls.font_color.setValue('#' + this.user.font_color);
        this.profileForm.controls.bubble_color.setValue('#' + this.user.bubble_color);
        this.profileForm.controls.show_avatars.setValue(this.user.show_avatars);
        this.profileForm.controls.bubble_layout.setValue(this.user.bubble_layout);
        this.profileForm.controls.color_theme.setValue(this.user.color_theme);
        this.profileForm.controls.enforce_interests.setValue(this.user.enforce_interests);
        this.profileForm.controls.sounds.setValue(this.user.sounds);
        this.profileForm.controls.img_previews.setValue(this.user.img_previews);
        this.profileForm.controls.bio.setValue(this.user.bio);

        this.profileForm.controls.interests.setValue(this.user.interests ? this.user.interests : []);
        this.pushCustomInterestsToInput();

        this.expCurValue = this.levelService.getCurExpBarValue(this.user.levelInfo, this.user.experience);
        this.expMaxValue = this.levelService.getMaxExpBarValue(this.user.levelInfo);
    }

    openEditAvatar(): void {
        this.activeModal.close();
        let modalRef;

        modalRef = this.modal.open(ChangeAvatarModalComponent, { centered: true, backdrop: 'static', keyboard: false });
        modalRef.componentInstance.user = this.user;

        modalRef.result.then(() => {
        }, () => {
            modalRef = this.modal.open(UserSettingsModalComponent, { centered: true, backdrop: 'static', keyboard: false });
            modalRef.componentInstance.user = this.user;
        });
    }

    toggleInterest(val: string): void {
        const idx = this.profileForm.value.interests.indexOf(val);

        if (idx > -1) {
            this.profileForm.value.interests.splice(idx, 1);
        } else {
            this.profileForm.value.interests.push(val);
        }
    }

    pushCustomInterestsToForm(): void {
        for (let i = 0; i < this.customInterests.length; i++) {
            let isCustomInterest = true;

            for (let j = 0; j < this.interests.length; j++) {
                if (this.customInterests[i] === this.interests[j].name) {
                    isCustomInterest = false;
                    break;
                }
            }

            if (isCustomInterest && this.profileForm.value.interests.indexOf(this.customInterests[i]) === -1) {
                this.profileForm.value.interests.push(this.customInterests[i].toLowerCase());
            }
        }
    }

    pushCustomInterestsToInput(): void {
        for (let i = 0; i < this.user.interests.length; i++) {
            let isCustomInterest = true;

            for (let j = 0; j < this.interests.length; j++) {
                if (this.user.interests[i] === this.interests[j].name) {
                    isCustomInterest = false;
                }
            }

            if (isCustomInterest) {
                this.customInterests.push(this.user.interests[i]);
            }
        }
    }

    onCustomInterestRemoved(e): void {
        if (this.profileForm.value.interests.indexOf(e) > -1) {
            this.profileForm.value.interests.splice(this.profileForm.value.interests.indexOf(e), 1);
        }
    }

    applyChanges(): void {
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

        if (!this.profileForm.valid || this.loadingRequest) {
            return;
        }

        this.pushCustomInterestsToForm();

        const body: User = {
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
            img_previews: this.profileForm.value.img_previews,
            bio: this.profileForm.value.bio
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
            this.user.name = body.name;
        }, err => {
            this.loadingRequest = null;
            this.profileForm['submitted'] = false;
            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
        });
    };
}

export class ChipsValidators {
    customInterestMaxLength?: boolean | null | string;
}
