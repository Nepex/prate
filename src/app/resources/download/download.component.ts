import { ComingSoonModalComponent } from './../../shared/coming-soon/coming-soon-modal.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
    constructor(private modal: NgbModal) { }

    ngOnInit() {}

    openComingSoon() {
        this.modal.open(ComingSoonModalComponent, { centered: true, size: 'sm' });
    }
}
