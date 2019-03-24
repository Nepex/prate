import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { Router } from '@angular/router';
import { UserProfileModalComponent } from 'src/app/user-profile/user-profile-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-user-info-panel',
    templateUrl: './user-info-panel.component.html',
    styleUrls: ['./user-info-panel.component.css']
})
export class UserInfoPanelComponent implements OnInit {
    isCollapsed = true;

    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router) { }

    ngOnInit(): void { }

    openProfile() {
        console.log('here')
        this.modal.open(UserProfileModalComponent);
    }

    logout() {
        this.sessionService.logout();
        this.router.navigateByUrl('/');
    }
}
