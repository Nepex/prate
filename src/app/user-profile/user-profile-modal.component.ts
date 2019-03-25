import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-user-profile-modal',
    templateUrl: './user-profile-modal.component.html',
    styleUrls: ['./user-profile-modal.component.css']
})
export class UserProfileModalComponent implements OnInit {
    userRegex = /^[a-zA-Z0-9]*$/;
    profileForm: FormGroup = new FormGroup({
        name: new FormControl('PrateMaster1', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        interests: new FormControl([], [Validators.required]),
        oldPassword: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(5)]),
        newPassword: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(5)])
    });

    passwordForm: FormGroup = new FormGroup({

    });

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void { }

    applyChanges() {
        
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
