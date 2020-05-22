// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { SessionService } from '../../services/session/session.service';
import { SignUpModalComponent } from '../sign-up/sign-up-modal.component';

@Component({
    selector: 'prt-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    userAuthed: boolean = false;

    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router) {}

    ngOnInit() {
        if (this.sessionService.isAuthenticated()) {
            this.userAuthed = true;
        }
    }

    goToChat() {
        this.router.navigateByUrl('/chat');
    }

    openSignUpModal() {
        this.modal.open(SignUpModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }
}
