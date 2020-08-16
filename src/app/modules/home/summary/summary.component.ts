// Angular
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { SignUpModalComponent } from '../../auth/sign-up/sign-up-modal.component';

// Why Prate? page, shows basic app info
@Component({
    selector: 'prt-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    fadeMatchIcon: boolean = false;
    fadeCustomIcon: boolean = false;
    fadeProgIcon: boolean = false;

    constructor(private titleService: Title, private modal: NgbModal) {}

    ngOnInit(): void {
        this.titleService.setTitle('Prate | Summary');
    }

    openSignUpModal(): void {
        this.modal.open(SignUpModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }
}
