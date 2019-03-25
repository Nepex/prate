import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Credentials } from './../services/session/credentials';
import { Component, OnInit } from '@angular/core';
import { AlertMessages } from '../shared/alert-messages/alert-messages.component';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../services/session/session.service';
import { Router } from '@angular/router';

@Component({
    selector: 'prt-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {
    messages: AlertMessages[];
    loadingRequest: Observable<any>;
    emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    loginForm: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.maxLength(60), Validators.pattern(this.emailRegex)]),
        password: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    });

    constructor(public activeModal: NgbActiveModal, private sessionService: SessionService, private router: Router) { }

    ngOnInit(): void {}

    attemptLogin() {
        this.messages = [];
        this.loginForm['submitted'] = true;

        if (!this.loginForm.valid) {
            return;
        }

        if (this.loadingRequest) {
            return;
        }

        const body: Credentials = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        };

        this.loadingRequest = this.sessionService.login(body);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.loginForm['submitted'] = false;
            this.messages.push({ message: 'Success! Redirecting...', type: 'success' });
            this.loginForm.reset();

            setTimeout(() => {
                this.activeModal.close();
                this.router.navigateByUrl('/chat');
            }, 500);
        }, err => {
            this.loadingRequest = null;
            this.loginForm['submitted'] = false;
            this.messages.push({ message: err.error.msg, type: 'error' });
        });
    }
}
