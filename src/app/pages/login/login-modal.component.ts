// Angular
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from '../../shared/alert-messages/alert-messages.component';
import { Credentials } from './../../services/session/credentials';
import { SessionService } from '../../services/session/session.service';
import { SubmittableFormGroup } from '../../shared/submittable-form-group/submittable-form-group';
import { User } from '../../services/user/user';

// Modal for logging users in
@Component({
    selector: 'prt-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {
    // Subs
    loadingRequest: Observable<User>;

    // UI
    messages: AlertMessage[];

    // Forms
    emailRegex: RegExp = /^[^@]+@[^@]+\.[^@]+$/;
    loginForm: SubmittableFormGroup = new SubmittableFormGroup({
        email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern(this.emailRegex)]),
        password: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    });

    constructor(public activeModal: NgbActiveModal, private sessionService: SessionService, private router: Router) { }

    attemptLogin(): void {
        this.messages = [];
        this.loginForm['submitted'] = true;

        if (!this.loginForm.valid || this.loadingRequest) {
            return;
        }

        const body: Credentials = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        };

        this.loadingRequest = this.sessionService.login(body);

        this.loadingRequest.subscribe(() => {
            this.loadingRequest = null;
            this.loginForm['submitted'] = false;
            this.activeModal.close();
            this.router.navigateByUrl('/chat');
        }, err => {
            this.loadingRequest = null;
            this.loginForm['submitted'] = false;
            err.error.forEach(error => {
                this.messages.push({ message: error, type: 'error' });
            });
        });
    }
}
