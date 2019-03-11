import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-sign-up-modal',
    templateUrl: './sign-up-modal.component.html',
    styleUrls: ['./sign-up-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SignUpModalComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void { }
}
