// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// NPM
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from '../../shared/alert-messages/alert-messages.component';
import { Credentials } from '../../services/session/credentials';
import { PrivacyPolicyModalComponent } from '../privacy-policy/privacy-policy-modal.component';
import { SessionService } from '../../services/session/session.service';
import { SubmittableFormGroup } from '../../shared/submittable-form-group/submittable-form-group';
import { TermsModalComponent } from 'src/app/pages/terms/terms-modal.component';
import { UserService } from '../../services/user/user.service';
import { User } from '../../services/user/user';

@Component({
    selector: 'prt-sign-up-modal',
    templateUrl: './sign-up-modal.component.html',
    styleUrls: ['./sign-up-modal.component.css']
})
export class SignUpModalComponent {
    messages: AlertMessage[];
    loadingRequest: Observable<any>;

    userRegex: RegExp = /^[a-zA-Z0-9]*$/;
    emailRegex: RegExp = /^[^@]+@[^@]+\.[^@]+$/;
    signUpForm: SubmittableFormGroup = new SubmittableFormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)]),
        email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern(this.emailRegex)]),
        password: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(5)]),
        passwordConfirm: new FormControl('', [Validators.required])
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService, private modal: NgbModal, private sessionService: SessionService,
        private router: Router) { }

    createUser(): void {
        this.messages = [];
        this.signUpForm['submitted'] = true;

        if (!this.signUpForm.valid || this.loadingRequest) {
            return;
        }

        if (this.signUpForm.value.password !== this.signUpForm.value.passwordConfirm) {
            this.messages.push({ message: 'Passwords do not match', type: 'error' });
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

    logUserIn(body: User): void {
        if (this.loadingRequest) {
            return;
        }

        const credentials: Credentials = {
            email: body.email,
            password: body.password
        };

        this.loadingRequest = this.sessionService.login(credentials);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
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

    openTermsModal(): boolean {
        this.activeModal.close();
        this.modal.open(TermsModalComponent, { centered: true, backdrop: 'static', keyboard: false });

        return false;
    }

    openPrivacyPolicyModal(): boolean {
        this.activeModal.close();
        this.modal.open(PrivacyPolicyModalComponent, { centered: true, backdrop: 'static', keyboard: false });

        return false;
    }
}
