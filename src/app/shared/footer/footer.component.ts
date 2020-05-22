// Angular
import { Component } from '@angular/core';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { PrivacyPolicyModalComponent } from '../../pages/privacy-policy/privacy-policy-modal.component';
import { TermsModalComponent } from '../../pages/terms/terms-modal.component';

@Component({
    selector: 'prt-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    constructor(private modal: NgbModal) { }

    openTermsModal() {
        this.modal.open(TermsModalComponent, { centered: true, backdrop : 'static', keyboard : false, windowClass: 'modal-holder' });

        return false;
    }

    openPrivacyPolicyModal() {
        this.modal.open(PrivacyPolicyModalComponent, { centered: true, backdrop : 'static', keyboard : false, windowClass: 'modal-holder' });

        return false;
    }
}
