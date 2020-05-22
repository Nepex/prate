// Angular
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { LoginModalComponent } from './../../pages/login/login-modal.component';
import { SessionService } from './../../services/session/session.service';
import { User } from 'src/app/services/user/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'prt-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() selectedTab: string;

    isCollapsed: boolean = true;
    loadingRequest: Observable<User>;
    user: User;
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
