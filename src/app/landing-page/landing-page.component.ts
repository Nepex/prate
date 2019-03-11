import { SignUpModalComponent } from './../sign-up/sign-up-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    constructor(private modal: NgbModal) {
    }

    ngOnInit(): void { }

    openSignUp() {
        this.modal.open(SignUpModalComponent, { windowClass: 'signup-modal' });
    }
}
