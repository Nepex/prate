// Angular
import { Component } from '@angular/core';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Modal to display privacy policy
@Component({
    selector: 'prt-privacy-policy-modal',
    templateUrl: './privacy-policy-modal.component.html',
    styleUrls: ['./privacy-policy-modal.component.scss']
})
export class PrivacyPolicyModalComponent {
    constructor(public activeModal: NgbActiveModal) { }
}
