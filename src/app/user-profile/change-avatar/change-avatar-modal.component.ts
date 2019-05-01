import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-change-avatar-modal',
    templateUrl: './change-avatar-modal.component.html',
    styleUrls: ['./change-avatar-modal.component.css']
})
export class ChangeAvatarModalComponent implements OnInit {
    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit(): void { }

    applyChanges() {}
}
