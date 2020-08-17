import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

// X and checkmarks for invalid/valid inputs
@Component({
    selector: 'prt-form-validation-msgs',
    template:
    `<span *ngIf=" ( control.touched || submitted) && control.errors">
        <span class="form-control-feedback" *ngIf="control.hasError('required') || control.hasError('minlength') || control.hasError('maxlength') || control.hasError('pattern') ||
        control.hasError('match')">
            <i class="fas fa-times"></i>
        </span>
    </span>
    <span *ngIf="(control.touched || submitted) && !control.errors">
        <span class="checkmark">&#10003;</span>
    </span>`,
    styleUrls: ['./form-validation-msgs.component.scss']
})
export class FormValidationMsgsComponent {
    // UI
    @Input() submitted: boolean;
    @Input() control: FormControl;
    @Input() example: string;
    @Input() showErrorsOnly = false;
}