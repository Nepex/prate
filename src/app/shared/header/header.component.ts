// Angular
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { LoginModalComponent } from './../../pages/login/login-modal.component';
import { SessionService } from './../../services/session/session.service';
import { User } from '../../services/user/user';
import { UserService } from '../../services/user/user.service';

// Header component for base website
@Component({
    selector: 'prt-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    // Component Inputs
    @Input() selectedTab: string;

    // Subs
    loadingRequest: Observable<User>;
    
    // Data Stores
    user: User;

    // UI
    isCollapsed: boolean = true;
    userAuthed: boolean = false;

    constructor(private modal: NgbModal, private sessionService: SessionService, private userService: UserService) { }

    ngOnInit(): void {
        if (this.sessionService.isAuthenticated()) {
            this.userAuthed = true;

            this.loadingRequest = this.userService.getUser();

            this.loadingRequest.subscribe(res => {
                this.user = res;
                this.loadingRequest = null;
            });
        }
    }

    openLoginModal(): boolean {
        this.modal.open(LoginModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });

        return false;
    }

    logout(): void {
        this.sessionService.logout();
        window.location.reload();
    }
}
