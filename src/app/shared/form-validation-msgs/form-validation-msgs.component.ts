import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'prt-form-validation-msgs',
    template:
    `<span *ngIf=" ( control.touched || submitted) && control.errors">
        <span class="form-control-feedback float-right" *ngIf="control.hasError('required')">
            <i class="fa fa-warning"></i>&nbsp;Required
        </span>
        <span class="form-control-feedback float-right" *ngIf="control.hasError('minlength')">
            <i class="fa fa-warning"></i>&nbsp;At least {{ control.errors.minlength.requiredLength }} characters required.
        </span>
        <span class="form-control-feedback float-right" *ngIf="control.hasError('maxlength')">
            <i class="fa fa-warning"></i>&nbsp;Cannot exceed {{ control.errors.maxlength.requiredLength }} characters.
        </span>
        <span class="form-control-feedback float-right" *ngIf="control.hasError('pattern')">
            <i class="fa fa-warning"></i>&nbsp;Does not meet required format.<span *ngIf="example"> Example: {{ example }}</span>
        </span>
        <span class="form-control-feedback float-right" *ngIf="control.hasError('match')">
            <i class="fa fa-warning"></i>&nbsp;Passwords do not match.
        </span>
    </span>
    <span *ngIf="(control.touched || submitted) && !control.errors">
        <span class="checkmark float-right">&#10003;</span>
    </span>`,
    styleUrls: ['./form-validation-msgs.component.css']
})
export class FormValidationMsgsComponent {
    @Input() submitted: boolean;
    @Input() control: FormControl;
    @Input() example: string;
    @Input() showErrorsOnly = false;
}