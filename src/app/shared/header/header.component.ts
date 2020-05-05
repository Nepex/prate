import { Router } from '@angular/router';
import { SessionService } from './../../services/session/session.service';
import { LoginModalComponent } from './../../login/login-modal.component';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() selectedTab: string;
    isCollapsed: boolean = true;
    userAuthed: boolean = false;

    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router) { }

    ngOnInit(): void {
        if (this.sessionService.isAuthenticated()) {
            this.userAuthed = true;
        }
    }

    openLogin() {
        this.modal.open(LoginModalComponent, { centered: true, backdrop : 'static', keyboard : false });

        return false;
    }

    redirectToChat() {
        this.router.navigateByUrl('/chat');
    }
}
