import { SignUpModalComponent } from './../sign-up/sign-up-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../services/session/session.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { User } from '../services/user/user';
import { Observable } from 'rxjs';

@Component({
    selector: 'prt-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    userAuthed: boolean = false;

    constructor(private modal: NgbModal, private sessionService: SessionService, private userService: UserService, private router: Router) {
    }

    ngOnInit(): void {
        if (this.sessionService.isAuthenticated()) {
            this.userAuthed = true;

            // use this if ever wanting to just redirect to chat is user is authed
            // this.router.navigateByUrl('/chat');
        }
    }

    goToChat() {
        this.router.navigateByUrl('/chat');
    }

    openSignUp() {
        this.modal.open(SignUpModalComponent, { centered: true, backdrop: 'static', keyboard: false });
    }
}
