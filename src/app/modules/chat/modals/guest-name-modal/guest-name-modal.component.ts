// Angular
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from '../../../../shared/models/generic';
import { SubmittableFormGroup } from '../../../../shared/models';

// Modal for choosing guest name
@Component({
    selector: 'prt-guest-name-modal',
    templateUrl: './guest-name-modal.component.html',
    styleUrls: ['./guest-name-modal.component.scss']
})
export class GuestNameModalComponent {
    // UI
    messages: AlertMessage[];

    // Forms
    userRegex: RegExp = /^[a-zA-Z0-9]*$/;
    chooseGuestNameForm: SubmittableFormGroup = new SubmittableFormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern(this.userRegex)])
    });
    constructor(public activeModal: NgbActiveModal) {
        window.onpopstate = () => {
            this.activeModal.close();
            return null;
        };
    }

    chooseGuestName(): void {
        this.messages = [];
        this.chooseGuestNameForm['submitted'] = true;

        if (!this.chooseGuestNameForm.valid) {
            return;
        }

        this.activeModal.close(this.chooseGuestNameForm.value.name);
    };
}
