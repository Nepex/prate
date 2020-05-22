// Angular
import { Component, Input } from '@angular/core';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-message-display',
    templateUrl: './message-display-modal.component.html',
    styleUrls: ['./message-display-modal.component.css']
})
export class MessageDisplayModalComponent {
    @Input() message: string;

    constructor(public activeModal: NgbActiveModal) { }
}
