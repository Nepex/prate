import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { Router } from '@angular/router';

@Component({
    selector: 'prt-user-info-panel',
    templateUrl: './user-info-panel.component.html',
    styleUrls: ['./user-info-panel.component.css']
})
export class UserInfoPanelComponent implements OnInit {
    isCollapsed = true;

    constructor(private sessionService: SessionService, private router: Router) { }

    ngOnInit(): void { }

    logout() {
        this.sessionService.logout();
        this.router.navigateByUrl('/');
    }
}
