// Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { style, trigger, transition, animate } from '@angular/animations';

// NPM
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage, Credentials } from '../../../shared/models/generic';
import { PrivacyPolicyModalComponent } from '../../home/privacy-policy-modal/privacy-policy-modal.component';
import { TermsModalComponent } from '../../home/terms-modal/terms-modal.component';
import { User, SubmittableFormGroup } from '../../../shared/models';
import { UserService, SessionService } from 'src/app/core/services';

// Modal for creating new users
@Component({
    selector: 'prt-sign-up-modal',
    templateUrl: './sign-up-modal.component.html',
    styleUrls: ['./sign-up-modal.component.css'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('300ms ease-in', style({ opacity: '1.0' }))
            ])
        ])
    ]
})
export class SignUpModalComponent {
    // Subs
    loadingRequest: Observable<User>;

    // UI
    messages: AlertMessage[];

    // Forms
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
