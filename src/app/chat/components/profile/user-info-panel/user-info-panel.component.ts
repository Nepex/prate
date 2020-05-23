// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

// NPM
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { BugReportModalComponent } from '../../bug-report/bug-report-modal.component';
import { ChatService } from 'src/app/services/chat/chat.service';
import { HelpModalComponent } from '../../help/help-modal.component';
import { LevelService } from 'src/app/services/level/level.service';
import { MessageDisplayModalComponent } from '../../../../shared/message-display/message-display-modal.component';
import { SessionService } from 'src/app/services/session/session.service';
import { User } from 'src/app/services/user/user';
import { UserService } from '../../../../services/user/user.service';
import { UserSettingsModalComponent } from '../user-settings/user-settings-modal.component';

@Component({
    selector: 'prt-user-info-panel',
    templateUrl: './user-info-panel.component.html',
    styleUrls: ['./user-info-panel.component.css']
})
export class UserInfoPanelComponent implements OnInit, OnDestroy {
    isCollapsed = true;
    loadingRequest: Observable<User>;
    user: User;
    partner: User;

    expMaxValue: number;
    expCurValue: number;

    partnerFoundSub: Subscription;
    userDisconnectSub: Subscription;
    partnerDisconnectSub: Subscription;
    avatarChangedSub: Subscription;
    settingsChangedSub: Subscription;

    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router, private userService: UserService,
        private chatService: ChatService, private levelService: LevelService) { }

    ngOnInit(): void {
        this.getUser();
        this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.partner = partner);
        this.partnerDisconnectSub = this.chatService.partnerDisconnected.subscribe(() => this.updateExpAndClearPartner());
        this.userDisconnectSub = this.chatService.userDisconnected.subscribe(() => this.updateExpAndClearPartner());
        this.avatarChangedSub = this.userService.avatarChanged.subscribe(avatar => { this.user.avatar = avatar; });
        this.settingsChangedSub = this.userService.userSettingsChanged.subscribe(user => this.user.name = user.name);
    }

    ngOnDestroy(): void {
        this.partnerFoundSub.unsubscribe();
        this.partnerDisconnectSub.unsubscribe();
        this.userDisconnectSub.unsubscribe();
        this.avatarChangedSub.unsubscribe();
        this.settingsChangedSub.unsubscribe();
    }

    openProfile(): void {
        if (this.partner) {
            const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
            modalRef.componentInstance.message = 'User settings cannot be editted while chatting.';
            return;
        }

        this.modal.open(UserSettingsModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }

    openFriends(): void {
        const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, size: 'sm', backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });

        modalRef.componentInstance.message = "Coming soon...";
    }

    openHelp(): void {
        this.modal.open(HelpModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }

    openBugReport(): void {
        this.modal.open(BugReportModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }

    getUser(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(this.user.experience);
            this.expCurValue = this.levelService.getCurExpBarValue(this.user.levelInfo, this.user.experience);
            this.expMaxValue = this.levelService.getMaxExpBarValue(this.user.levelInfo);

            this.loadingRequest = null;
        });
    }

    updateExpAndClearPartner(): void {
        this.partner = null;

        // find a better way to wait for exp reward
        setTimeout(() => {
            this.getUser();
        }, 1000);
    }

    logout(): void {
        if (this.partner) {
            this.chatService.disconnect(this.partner);
        }
        this.sessionService.logout();
        this.router.navigateByUrl('/');
    }
}
