// Angular
import { Component, Input } from '@angular/core';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Cookie cutter modal for displaying a message
@Component({
    selector: 'prt-message-display',
    templateUrl: './message-display-modal.component.html',
    styleUrls: ['./message-display-modal.component.css']
})
export class MessageDisplayModalComponent {
    // UI
    @Input() message: string;
    @Input() showClose: boolean = true;

    constructor(public activeModal: NgbActiveModal) { }
}
