import { PrivacyPolicyModalComponent } from './../resources/privacy-policy/privacy-policy-modal.component';
import { TermsModalComponent } from 'src/app/resources/terms/terms-modal.component';
import { SessionService } from './../services/session/session.service';
import { UserService } from '../services/user/user.service';
import { AlertMessages } from './../shared/alert-messages/alert-messages.component';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { User } from '../services/user/user';
import { LoginModalComponent } from '../login/login-modal.component';
import { SubmittableFormGroup } from '../shared/submittable-form-group/submittable-form-group';
import { Credentials } from '../services/session/credentials';
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
    signUpForm: SubmittableFormGroup = new SubmittableFormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern(this.emailRegex)]),
        password: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(5)]),
        passwordConfirm: new FormControl('', [Validators.required])
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService, private modal: NgbModal, private sessionService: SessionService,
        private router: Router) { }

    ngOnInit(): void { }

    // openLogin() {
    //     this.modal.open(LoginModalComponent, { centered: true, backdrop: 'static', keyboard: false });
    // }

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
            this.messages.push({ message: 'Account created! Redirecting...', type: 'success' });
            this.signUpForm.reset();

            this.logUserIn(body);
        }, err => {
            this.loadingRequest = null;
            this.signUpForm['submitted'] = false;

            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
        });
    }

    logUserIn(body) {
        if (this.loadingRequest) {
            return;
        }

        delete body.name;

        this.loadingRequest = this.sessionService.login(body);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.signUpForm['submitted'] = false;

            setTimeout(() => {
                this.activeModal.close();
                this.router.navigateByUrl('/chat');
            }, 500);
        }, err => {
            this.loadingRequest = null;
            this.signUpForm['submitted'] = false;
            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
        });
    }

    openTerms() {
        this.activeModal.close();
        this.modal.open(TermsModalComponent, { centered: true, backdrop: 'static', keyboard: false });

        return false;
    }

    openPrivacyPolicy() {
        this.activeModal.close();
        this.modal.open(PrivacyPolicyModalComponent, { centered: true, backdrop: 'static', keyboard: false });

        return false;
    }
}
