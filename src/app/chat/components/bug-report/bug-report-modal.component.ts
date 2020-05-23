// Angular
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessage } from '../../../shared/alert-messages/alert-messages.component';
import { BugReport } from '../../../services/generic/bug-report';
import { SubmittableFormGroup } from '../../../shared/submittable-form-group/submittable-form-group';
import { UserService } from '../../../services/user/user.service';

// Modal for client to send bug reports
@Component({
    selector: 'prt-bug-report-modal',
    templateUrl: './bug-report-modal.component.html',
    styleUrls: ['./bug-report-modal.component.css']
})
export class BugReportModalComponent {
    // Subs
    loadingRequest: Observable<BugReport>;

    // UI
    messages: AlertMessage[];
    messageLeftLength: string | number;
    disableForm: boolean = false;

    // Forms
    bugReportForm: SubmittableFormGroup = new SubmittableFormGroup({
        message: new FormControl('', [Validators.required, Validators.maxLength(200)])
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService) {
        // Track amount of characters on message
        this.bugReportForm.controls['message'].valueChanges.subscribe((v) => {
            if (!v) {
                this.messageLeftLength = null;

                return;
            }

            this.messageLeftLength = 200 - v.length;

            if (this.messageLeftLength < 0) {
                this.messageLeftLength = 'Limit exceeded';
            }
        });
    }

    sendReport(): void {
        this.messages = [];
        this.bugReportForm['submitted'] = true;
        this.disableForm = true;

        if (!this.bugReportForm.valid || this.loadingRequest) {
            return;
        }

        this.loadingRequest = this.userService.sendBugReport(this.bugReportForm.value.message);

        this.loadingRequest.subscribe(res => {
            this.disableForm = false;
            this.loadingRequest = null;
            this.bugReportForm['submitted'] = false;
            this.messages.push({ message: 'Bug Report Sent', type: 'success' });
        }, err => {
            this.disableForm = false;
            this.loadingRequest = null;
            this.bugReportForm['submitted'] = false;
            this.messages.push({ message: 'There was a problem sending the report', type: 'error' });
        });
    };
}
