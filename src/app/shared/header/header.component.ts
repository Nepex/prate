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
    isCollapsed = true;

    constructor(private modal: NgbModal) { }

    ngOnInit(): void {
        console.log(this.selectedTab)
    }

    openLogin() {
        this.modal.open(LoginModalComponent, { centered: true });
    }
}
