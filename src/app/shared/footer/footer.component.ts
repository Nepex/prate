import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TermsModalComponent } from '../../pages/terms/terms-modal.component';
import { PrivacyPolicyModalComponent } from '../../pages/privacy-policy/privacy-policy-modal.component';

@Component({
    selector: 'prt-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    constructor(private modal: NgbModal) { }

    ngOnInit(): void { }

    openTerms() {
        this.modal.open(TermsModalComponent, { centered: true, backdrop : 'static', keyboard : false, windowClass: 'modal-holder' });

        return false;
    }

    openPrivacyPolicy() {
        this.modal.open(PrivacyPolicyModalComponent, { centered: true, backdrop : 'static', keyboard : false, windowClass: 'modal-holder' });

        return false;
    }
}
