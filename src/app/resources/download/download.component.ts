import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageDisplayModalComponent } from 'src/app/shared/message-display/message-display-modal.component';

@Component({
    selector: 'prt-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
    constructor(private modal: NgbModal) { }

    ngOnInit() {}

    openComingSoon() {
        const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, size: 'sm' });

        modalRef.componentInstance.message = "Coming soon...";
    }
}
