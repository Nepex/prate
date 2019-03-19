import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Credentials } from './../services/session/credentials';
import { Component, OnInit } from '@angular/core';
import { AlertMessages } from '../shared/alert-messages/alert-messages.component';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
        password: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(5)]),
    });

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void { }

    createUser() {
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

        // this.loadingRequest = this.userService.create(body);

        // this.loadingRequest.subscribe(res => {
        //     this.loadingRequest = null;
        //     this.loginForm['submitted'] = false;
        //     this.messages.push({ message: 'Account created', type: 'success' }); 

        //     this.loginForm.reset();
        // }, err => { 
        //     this.loadingRequest = null;
        //     this.loginForm['submitted'] = false;
        //     this.messages.push({ message: err.error.msg, type: 'error' }); 
        // });
    }
}
