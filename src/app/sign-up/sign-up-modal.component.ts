import { SessionService } from './../services/session/session.service';
import { UserService } from '../services/user/user.service';
import { AlertMessages } from './../shared/alert-messages/alert-messages.component';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../services/user/user';
import { Router } from '@angular/router';

@Component({
    selector: 'prt-sign-up-modal',
    templateUrl: './sign-up-modal.component.html',
    styleUrls: ['./sign-up-modal.component.css']
})
export class SignUpModalComponent implements OnInit {
    messages: AlertMessages[];
    loadingRequest: Observable<any>;
    userRegex = /^[a-zA-Z0-9]*$/;
    emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    signUpForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern(this.emailRegex)]),
        password: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(5)]),
        passwordConfirm: new FormControl('', [Validators.required])
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService) { }

    ngOnInit(): void {}

    createUser() {
        this.messages = [];
        this.signUpForm['submitted'] = true;

        if (!this.signUpForm.valid) {
            return;
        }

        if (this.signUpForm.value.password !== this.signUpForm.value.passwordConfirm) {
            this.messages.push({ message: 'Passwords do not match', type: 'error' }); 
            return;
        }

        if (this.loadingRequest) {
            return;
        }

        const body: User = {
            name: this.signUpForm.value.name,
            email: this.signUpForm.value.email,
            password: this.signUpForm.value.password
        };

        this.loadingRequest = this.userService.create(body);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.signUpForm['submitted'] = false;
            this.messages.push({ message: 'Account created', type: 'success' }); 

            this.signUpForm.reset();
        }, err => { 
            this.loadingRequest = null;
            this.signUpForm['submitted'] = false;

            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
        });
    }
}
