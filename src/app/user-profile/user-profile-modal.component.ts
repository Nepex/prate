import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'prt-user-profile-modal',
    templateUrl: './user-profile-modal.component.html',
    styleUrls: ['./user-profile-modal.component.css']
})
export class UserProfileModalComponent implements OnInit {
    userRegex = /^[a-zA-Z0-9]*$/;
    profileForm: FormGroup = new FormGroup({
        avatar: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        interests: new FormControl(['general'], [Validators.required]),
        fontColor: new FormControl([], [Validators.required, Validators.maxLength(25)]),
        bubbleColor: new FormControl([], [Validators.required, Validators.maxLength(25)]),
        fontFace: new FormControl([], [Validators.required, Validators.maxLength(25)]),
    });

    constructor() { }

    ngOnInit(): void { }
}
