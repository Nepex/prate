import { LoginModalComponent } from './../../login/login-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    isCollapsed = true;

    constructor(private modal: NgbModal) { }

    ngOnInit(): void { }

    openLogin() {
        this.modal.open(LoginModalComponent);
    }
}
