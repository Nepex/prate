import { Component, Input, OnInit, HostListener, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/services/user/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GoogleService } from 'src/app/services-ext/google/google.service';

@Component({
    selector: 'prt-outer-app-invite-modal',
    templateUrl: './outer-app-invite-modal.component.html',
    styleUrls: ['./outer-app-invite-modal.component.css']
})
export class OuterAppInviteModalComponent implements OnInit {
    @Input() type: string; // sent or received
    @Input() outerApp: string;
    @Input() User: User;
    @Input() url: string;

    @HostListener('document:keydown', ['$event'])
    onKeyDown(evt: KeyboardEvent) {
        if (
            evt.keyCode === 8 || evt.which === 8 ||
            evt.keyCode === 32 || evt.which === 32 ||
            evt.keyCode === 13 || evt.which === 13
        ) {
            evt.preventDefault();
            return false;
        }
    }


    loadingRequest: Observable<any>;
    ytVideoTitle: string;

    constructor(public activeModal: NgbActiveModal, private googleService: GoogleService) {

    }

    ngOnInit() {
        document.querySelectorAll("button").forEach( function(item) {
            item.addEventListener('focus', function() {
                this.blur();
            })
        })

        if (this.outerApp === 'yt' && this.url) {
            this.getVideoInfo();
        }
    }

    passBack(answer) {
        this.activeModal.close(answer);
    }

    getVideoInfo() {
        if (this.loadingRequest) {
            return;
        }

        var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        var match = this.url.match(regExp);
        const videoId = (match && match[1].length == 11) ? match[1] : '';

        this.loadingRequest = this.googleService.getYtVideoInfo(videoId);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.ytVideoTitle = res.items[0].snippet.title;
        });
    }
}
