import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-terms-modal',
    templateUrl: './terms-modal.component.html',
    styleUrls: ['./terms-modal.component.css']
})
export class TermsModalComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void { }
}
