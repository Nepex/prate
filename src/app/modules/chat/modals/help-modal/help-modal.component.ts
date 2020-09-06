// Angular
import { Component } from '@angular/core';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { RankInfo } from '../../../../shared/models';
import { LevelService } from '../../../../core/services';

// Help modal that displays chat help and information
@Component({
    selector: 'prt-help-modal',
    templateUrl: './help-modal.component.html',
    styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {
    // UI
    selectedTab: string = 'basics';
    ranks: RankInfo[] = [];

    constructor(public activeModal: NgbActiveModal, private levelService: LevelService) {
        window.onpopstate = () => {
            this.activeModal.close();
            return null;
        };

        this.ranks = this.levelService.getRankInfo();
     }
}

