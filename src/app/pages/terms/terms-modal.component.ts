// Angular
import { Component } from '@angular/core';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-terms-modal',
    templateUrl: './terms-modal.component.html',
    styleUrls: ['./terms-modal.component.css']
})
export class TermsModalComponent {
    constructor(public activeModal: NgbActiveModal) { }
}
