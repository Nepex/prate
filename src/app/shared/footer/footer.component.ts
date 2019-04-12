import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsModalComponent } from '../../resources/terms/terms-modal.component';
import { PrivacyPolicyModalComponent } from '../../resources/privacy-policy/privacy-policy-modal.component';

@Component({
    selector: 'prt-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    constructor(private modal: NgbModal) { }

    ngOnInit(): void { }

    openTerms() {
        this.modal.open(TermsModalComponent, { centered: true });

        return false;
    }

    openPrivacyPolicy() {
        this.modal.open(PrivacyPolicyModalComponent, { centered: true });

        return false;
    }
}
