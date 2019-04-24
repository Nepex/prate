import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-message-display',
    templateUrl: './message-display-modal.component.html',
    styleUrls: ['./message-display-modal.component.css']
})
export class MessageDisplayModalComponent implements OnInit {
    @Input() message: string;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void { }
}
