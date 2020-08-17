// Angular
import { Component, Input } from '@angular/core';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Component for asking users if they're sure they want to proceed with an action
@Component({
    selector: 'prt-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
    @Input() message;

    constructor(public activeModal: NgbActiveModal) { 
        window.onpopstate = () => {
            this.activeModal.close('cancel');
            return null;
        };
    }
}