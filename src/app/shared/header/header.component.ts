import { Router } from '@angular/router';
import { SessionService } from './../../services/session/session.service';
import { LoginModalComponent } from './../../login/login-modal.component';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/services/user/user';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
    selector: 'prt-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() selectedTab: string;
    isCollapsed: boolean = true;
    userAuthed: boolean = false;
    user: User;
    loadingRequest: Observable<User>;

    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router, private userService: UserService) { }

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

    openLogin() {
        this.modal.open(LoginModalComponent, { centered: true, backdrop : 'static', keyboard : false, windowClass: 'modal-holder' });

        return false;
    }

    goToChat() {
        this.router.navigateByUrl('/chat');
    }

    logout() {
        this.sessionService.logout();
        window.location.reload();
    }
}
