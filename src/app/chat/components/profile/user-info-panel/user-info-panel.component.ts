// Angular
import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { BugReportModalComponent } from '../../bug-report/bug-report-modal.component';
import { ChatService } from '../../../../services/chat/chat.service';
import { FriendService } from '../../../../services/friend/friend.service';
import { HelpModalComponent } from '../../help/help-modal.component';
import { LevelInfo } from '../../../../services/level/level-info';
import { LevelService } from '../../../../services/level/level.service';
import { MessageDisplayModalComponent } from '../../../../shared/message-display/message-display-modal.component';
import { SessionService } from '../../../../services/session/session.service';
import { User } from '../../../../services/user/user';
import { UserSettingsModalComponent } from '../user-settings/user-settings-modal.component';
import { FriendMessageData } from '../../../../services/friend/friend-message-data';
import { FriendRequestsModalComponent } from '../../friends/friend-requests/friend-requests-modal.component';

// Component that's placed on the Chat page (top-right) to display user information and navigation
@Component({
    selector: 'prt-user-info-panel',
    templateUrl: './user-info-panel.component.html',
    styleUrls: ['./user-info-panel.component.css']
})
export class UserInfoPanelComponent implements OnInit, OnChanges {
    // Component Inputs
    @Input() user: User;
    @Input() partner: User;
    @Input() exp: number;
    @Input() friendsShown: boolean;
    @Input() friendsWithUnreadMessages: string[];
    
    // Component Outputs
    @Output() friendlistToggled: EventEmitter<boolean> = new EventEmitter();

    // UI
    navIsCollapsed: boolean = true;
    expCurValue: number;
    expMaxValue: number;
    levelInfo: LevelInfo;

    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router,
        private chatService: ChatService, private levelService: LevelService, private friendService: FriendService) { }

    ngOnInit(): void { }

    ngOnChanges(changes: { [property: string]: SimpleChange }): void {
        if (changes.exp) {
            this.exp = changes.exp.currentValue;

            this.levelInfo = this.levelService.getLevelInfo(this.exp);
            this.expCurValue = this.levelService.getCurExpBarValue(this.levelInfo, this.exp);
            this.expMaxValue = this.levelService.getMaxExpBarValue(this.levelInfo);
        }
    }

    openSettingsModal(): void {
        let modalRef;
        modalRef = this.modal.open(UserSettingsModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.user = this.user;
    }

    openFriendRequestsModal(): void {
        const modalRef = this.modal.open(FriendRequestsModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.user = this.user;
    }

    toggleFriendlist(): void {
        this.friendsShown = !this.friendsShown;
        this.friendlistToggled.emit(this.friendsShown);
    }

    openHelpModal(): void {
        this.modal.open(HelpModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }

    openBugReportModal(): void {
        this.modal.open(BugReportModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }

    logout(): void {
        if (this.partner) {
            this.chatService.disconnect();
        }
        this.friendService.disconnect();
        this.sessionService.logout();
        this.router.navigateByUrl('/');
    }
}
