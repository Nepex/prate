import { SignUpModalComponent } from './../sign-up/sign-up-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../services/session/session.service';
import { Router } from '@angular/router';

@Component({
    selector: 'prt-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router) {
    }

    ngOnInit(): void {
        if (this.sessionService.isAuthenticated()) {
            this.router.navigateByUrl('/chat');
        }
    }

    openSignUp() {
        this.modal.open(SignUpModalComponent, { centered: true });
    }
}
