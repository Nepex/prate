// Angular
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { GoogleService } from '../../../../core/services-external/google/google.service';
import { User } from '../../../../shared/models';

// Modal for accepting/canceling outside application invites
@Component({
    selector: 'prt-outer-app-invite-modal',
    templateUrl: './outer-app-invite-modal.component.html',
    styleUrls: ['./outer-app-invite-modal.component.css']
})
export class OuterAppInviteModalComponent implements OnInit {
    // Component Inputs
    @Input() User: User;
    @Input() type: string; // 'sent' or 'received'
    @Input() outerApp: string; // 'yt', 'gartic', etc
    @Input() url: string;

    // Subs
    loadingRequest: Observable<any>;

    // UI
    ytVideoTitle: string;

    // So keys don't trigger modal/browser activities (enter, spacebar, backspace)...
    @HostListener('document:keydown', ['$event'])
    onKeyDown(evt: KeyboardEvent): boolean {
        if (
            evt.keyCode === 8 || evt.which === 8 ||
            evt.keyCode === 32 || evt.which === 32 ||
            evt.keyCode === 13 || evt.which === 13
        ) {
            evt.preventDefault();
            return false;
        }
    }

    constructor(public activeModal: NgbActiveModal, private googleService: GoogleService) { }

    ngOnInit(): void {
        // Incase they receive the invite while typing, unfocus all elements so spacebar doesn't trigger anything
        // Only using this because stopping spacebar propagation doesn't seem to work in all browsers
        document.querySelectorAll("button").forEach(function (item) {
            item.addEventListener('focus', function () {
                this.blur();
            })
        })

        if (this.outerApp === 'yt' && this.url) {
            this.getVideoInfo();
        }

        window.onpopstate = () => {
            this.activeModal.close('cancel');
            return null;
        };
    }

    passBack(answer: string): void {
        this.activeModal.close(answer);
    }

    getVideoInfo(): void {
        if (this.loadingRequest) {
            return;
        }

        const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
        const match = this.url.match(regExp);
        const videoId = (match && match[1].length == 11) ? match[1] : '';

        this.loadingRequest = this.googleService.getYtVideoInfo(videoId);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.ytVideoTitle = res.items[0].snippet.title;
        });
    }
}
