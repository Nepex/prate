// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { SessionService } from '../../../core/services/session.service';
import { SignUpModalComponent } from '../../auth/sign-up-modal/sign-up-modal.component';

// Home page, first page loaded
@Component({
    selector: 'prt-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    // UI
    userAuthed: boolean = false;

    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router, private titleService: Title) {}

    ngOnInit(): void {
        this.titleService.setTitle('Prate | Free Chat Matching');
        
        if (this.sessionService.isAuthenticated()) {
            this.userAuthed = true;
        }
    }

    goToChat(): void {
        this.router.navigateByUrl('/chat');
    }

    goToChatGuest(): void {
        this.router.navigateByUrl('/chat-guest');
    }

    openSignUpModal(): void {
        this.modal.open(SignUpModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }
}
