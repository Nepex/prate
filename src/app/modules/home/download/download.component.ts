// Angular
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { MessageDisplayModalComponent } from '../../../shared/components/message-display-modal/message-display-modal.component';

// Page for downloading external app
@Component({
    selector: 'prt-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
    constructor(private modal: NgbModal, private titleService: Title) { }

    ngOnInit(): void {
        this.titleService.setTitle('Prate | Download');
    }

    openComingSoonModal(): void {
        const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, size: 'sm', backdrop : 'static', keyboard : false, windowClass: 'modal-holder' });

        modalRef.componentInstance.message = "Coming soon...";
    }
}
