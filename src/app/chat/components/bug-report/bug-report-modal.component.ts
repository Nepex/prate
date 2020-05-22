import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmittableFormGroup } from 'src/app/shared/submittable-form-group/submittable-form-group';
import { FormControl, Validators } from '@angular/forms';
import { AlertMessages } from 'src/app/shared/alert-messages/alert-messages.component';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { BugReport } from 'src/app/services/generic/bug-report';

@Component({
    selector: 'prt-bug-report-modal',
    templateUrl: './bug-report-modal.component.html',
    styleUrls: ['./bug-report-modal.component.css']
})
export class BugReportModalComponent {
    messages: AlertMessages[];
    messageLeftLength;
    loadingRequest: Observable<BugReport>;
    disableForm: boolean = false;

    bugReportForm: SubmittableFormGroup = new SubmittableFormGroup({
        message: new FormControl('', [Validators.required, Validators.maxLength(200)])
    });

    constructor(public activeModal: NgbActiveModal, private userService: UserService) {
        // Track characters on message
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

    sendReport() {
        this.messages = [];
        this.bugReportForm['submitted'] = true;
        this.disableForm = true;

        if (!this.bugReportForm.valid) {
            return;
        }

        if (this.loadingRequest) {
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
