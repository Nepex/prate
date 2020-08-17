// Angular
import { Component } from '@angular/core';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Modal for displaying terms of use
@Component({
    selector: 'prt-terms-modal',
    templateUrl: './terms-modal.component.html',
    styleUrls: ['./terms-modal.component.scss']
})
export class TermsModalComponent {
    constructor(public activeModal: NgbActiveModal) { }
}
