// NPM
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { MessageDisplayModalComponent } from 'src/app/shared/message-display/message-display-modal.component';

@Component({
    selector: 'prt-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
    constructor(private modal: NgbModal) { }

    ngOnInit(): void {}

    openComingSoonModal() {
        const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, size: 'sm', backdrop : 'static', keyboard : false, windowClass: 'modal-holder' });

        modalRef.componentInstance.message = "Coming soon...";
    }
}
