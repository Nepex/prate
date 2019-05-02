import { UserService } from '../../services/user/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { Router } from '@angular/router';
import { UserProfileModalComponent } from 'src/app/chat/user-profile/user-profile-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/services/user/user';
import { ChatService } from 'src/app/services/chat/chat.service';
import { MessageDisplayModalComponent } from '../../shared/message-display/message-display-modal.component';
import { LevelService } from 'src/app/services/level/level.service';

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
    expNeeded: number;
    level: number;
    rank: string;

    partnerFoundSub: Subscription;
    userDisconnectSub: Subscription;
    partnerDisconnectSub: Subscription;
    avatarChangedSub: Subscription;

    constructor(private modal: NgbModal, private sessionService: SessionService, private router: Router, private userService: UserService,
        private chatService: ChatService, private levelService: LevelService) { }

    ngOnInit(): void {
        this.getUser();
        this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.partner = partner);
        this.partnerDisconnectSub = this.chatService.partnerDisconnected.subscribe(() => this.updateExpAndClearPartner());
        this.userDisconnectSub = this.chatService.userDisconnected.subscribe(() => this.updateExpAndClearPartner());
        this.avatarChangedSub = this.userService.avatarChanged.subscribe(() => this.getUser());
    }

    ngOnDestroy() {
        this.partnerFoundSub.unsubscribe();
        this.partnerDisconnectSub.unsubscribe();
        this.userDisconnectSub.unsubscribe();
        this.avatarChangedSub.unsubscribe();
    }

    openProfile() {
        if (this.partner) {
            const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true });
            modalRef.componentInstance.message = 'User settings cannot be editted while chatting.';
            return;
        }

        const modalRef = this.modal.open(UserProfileModalComponent, { centered: true });
        modalRef.componentInstance.user = this.user;

        modalRef.result.then(() => {
        }, () => {
            this.getUser();
        });
    }

    openFriends() {
        const modalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, size: 'sm' });

        modalRef.componentInstance.message = "Coming soon...";
    }

    getUser() {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            
            this.expNeeded = this.levelService.getExpNeeded(this.user.experience);
            this.level = this.levelService.getLevel(this.user.experience);
            this.rank = this.levelService.getRank(this.user.experience);

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
        this.sessionService.logout();
        this.router.navigateByUrl('/');
    }
}