import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/services/user/user';

@Component({
    selector: 'prt-outer-app-invite-modal',
    templateUrl: './outer-app-invite-modal.component.html',
    styleUrls: ['./outer-app-invite-modal.component.css']
})
export class OuterAppInviteModalComponent {
    @Input() type: string; // sent or received
    @Input() outerAppType: string;
    @Input() User: User;


    constructor(public activeModal: NgbActiveModal) {}

    passBack(answer) { 
        this.activeModal.close(answer); 
    }
}
