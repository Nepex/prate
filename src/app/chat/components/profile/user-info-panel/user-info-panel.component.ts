import { UserService } from '../../../../services/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/services/user/user';
import { ChatService } from 'src/app/services/chat/chat.service';
import { MessageDisplayModalComponent } from '../../../../shared/message-display/message-display-modal.component';
import { LevelService } from 'src/app/services/level/level.service';
import { LevelInfo } from 'src/app/services/level/level-info';
import { BugReportModalComponent } from '../../bug-report/bug-report-modal.component';
import { UserSettingsModalComponent } from '../user-settings/user-settings-modal.component';
import { HelpModalComponent } from '../../help/help-modal.component';

@Component({
    selector: 'prt-user-info-panel',
    templateUrl: './user-info-panel.component.html',
    styleUrls: ['./user-info-panel.component.css']
})
export class UserInfoPanelComponent implements OnInit, OnDestroy {
    isCollapsed = true;
    loadingRequest: Observable<any>;
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

    ngOnInit() {
        this.getUser();
        this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.partner = partner);
        this.partnerDisconnectSub = this.chatService.partnerDisconnected.subscribe(() => this.updateExpAndClearPartner());
        this.userDisconnectSub = this.chatService.userDisconnected.subscribe(() => this.updateExpAndClearPartner());
        this.avatarChangedSub = this.userService.avatarChanged.subscribe(avatar => { this.user.avatar = avatar; });
        this.settingsChangedSub = this.userService.userSettingsChanged.subscribe(user => this.user.name = user.name);
    }

    ngOnDestroy() {
        this.partnerFoundSub.unsubscribe();
        this.partnerDisconnectSub.unsubscribe();
        this.userDisconnectSub.unsubscribe();
        this.avatarChangedSub.unsubscribe();
        this.settingsChangedSub.unsubscribe();
    }

    openProfile() {
        if (this.partner) {
            const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
            modalRef.componentInstance.message = 'User settings cannot be editted while chatting.';
            return;
        }

        this.modal.open(UserSettingsModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }

    openFriends() {
        const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, size: 'sm', backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });

        modalRef.componentInstance.message = "Coming soon...";
    }

    openHelp() {
        this.modal.open(HelpModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }

    openBugReport () {
        this.modal.open(BugReportModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
    }

    getUser() {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(this.user.experience);
            this.expCurValue = this.levelService.getCurExpBarValue(this.user.levelInfo, this.user.experience);
            this.expMaxValue = this.levelService.getMaxExpBarValue(this.user.levelInfo);

            this.loadingRequest = null;
        });
    }

    updateExpAndClearPartner() {
        this.partner = null;

        // find a better way to wait for exp reward
        setTimeout(() => {
            this.getUser();
        }, 1000);
    }

    logout() {
        if (this.partner) {
            this.chatService.disconnect(this.partner);
        }
        this.sessionService.logout();
        this.router.navigateByUrl('/');
    }
}
