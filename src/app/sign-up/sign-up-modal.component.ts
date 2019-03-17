import { UserService } from '../services/user/user.service';
import { AlertMessages } from './../shared/alert-messages/alert-messages.component';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../services/user/user';

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
        password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(5)]),
        passwordConfirm: new FormControl('', [Validators.required])
    }, this.validateMatchingPasswords());

    constructor(public activeModal: NgbActiveModal, private userService: UserService) { }

    ngOnInit(): void { }

    validateMatchingPasswords() {
        return (group: FormGroup): { [key: string]: any } => {
            const password = group.controls['password'];
            const passwordConfirm = group.controls['passwordConfirm'];

            if (password.value !== passwordConfirm.value) {

                passwordConfirm.setErrors({ match: 'Passwords must match' });

                return {
                    mismatchedPasswords: true
                };
            }

            return null;
        };
    }

    createUser() {
        this.messages = [];
        this.signUpForm['submitted'] = true;

        if (!this.signUpForm.valid) {
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

            console.log(res);

            this.signUpForm.reset();
        });
    }
}
