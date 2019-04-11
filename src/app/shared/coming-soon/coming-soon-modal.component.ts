import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-coming-soon',
    templateUrl: './coming-soon-modal.component.html',
    styleUrls: ['./coming-soon-modal.component.css']
})
export class ComingSoonModalComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void { }
}
