// NPM
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-privacy-policy-modal',
    templateUrl: './privacy-policy-modal.component.html',
    styleUrls: ['./privacy-policy-modal.component.css']
})
export class PrivacyPolicyModalComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void { }
}
