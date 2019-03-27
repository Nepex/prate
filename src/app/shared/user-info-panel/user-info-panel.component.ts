import { UserService } from './../../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { Router } from '@angular/router';
import { UserProfileModalComponent } from 'src/app/user-profile/user-profile-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { User } from 'src/app/services/user/user';

@Component({
    selector: 'prt-user-info-panel',
    templateUrl: './user-info-panel.component.html',
    styleUrls: ['./user-info-panel.component.css']
})
export class UserInfoPanelComponent implements OnInit {
    isCollapsed = true;
    loadingRequest: Observable<any>;
    user: User;
    
    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router, private userService: UserService) { }

    ngOnInit(): void { 
        this.getUser();
    }

    openProfile() {
        const modalRef = this.modal.open(UserProfileModalComponent, { centered: true });
        modalRef.componentInstance.user = this.user;

        modalRef.result.then(() => {
        }, () => {
            this.getUser();
         });
    }

    getUser() {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            console.log(res)
            this.user = res;
            this.loadingRequest = null;
        });
    }

    logout() {
        this.sessionService.logout();
        this.router.navigateByUrl('/');
    }
}
