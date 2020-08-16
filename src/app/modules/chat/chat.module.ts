// Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// NPM
import { TagInputModule } from 'ngx-chips';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularDraggableModule } from 'angular2-draggable';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MomentModule } from 'ngx-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Modules
import { SharedModule } from '../shared/shared.module';

// App Components
import { AddFriendModalComponent } from './components/friends/add-friend/add-friend-modal.component';
import { ChatComponent } from './chat/chat.component';
import { ChatGuestComponent } from './chat-guest/chat-guest.component';
import { UserSettingsModalComponent } from './components/profile/user-settings/user-settings-modal.component';
import { ChangeAvatarModalComponent } from './components/profile/change-avatar/change-avatar-modal.component';
import { FriendListComponent } from './components/friends/friendlist/friendlist.component';
import { FriendMessageBoxComponent } from './components/friends/friend-message-box/friend-message-box.component';
import { FriendRequestsModalComponent } from './components/friends/friend-requests/friend-requests-modal.component';
import { GameContainerComponent } from './components/game-container/game-container.component';
import { GuestNameModalComponent } from './chat-guest/guest-name/guest-name-modal.component';
import { HelpModalComponent } from './components/help/help-modal.component';
import { BugReportModalComponent } from './components/bug-report/bug-report-modal.component';
import { OuterAppInviteModalComponent } from './components/invites/outer-app-invite/outer-app-invite-modal.component';
import { UserInfoPanelComponent } from './components/profile/user-info-panel/user-info-panel.component';
import { ViewUserProfileModalComponent } from './components/profile/view-user-profile/view-user-profile-modal.component';
import { YoutubePlayerComponent } from './components/youtube-player/youtube-player.component';

@NgModule({
    declarations: [
        AddFriendModalComponent,
        BugReportModalComponent,
        ChangeAvatarModalComponent,
        ChatComponent,
        ChatGuestComponent,
        FriendListComponent,
        FriendMessageBoxComponent,
        FriendRequestsModalComponent,
        GameContainerComponent,
        GuestNameModalComponent,
        HelpModalComponent,
        OuterAppInviteModalComponent,
        UserInfoPanelComponent,
        UserSettingsModalComponent,
        ViewUserProfileModalComponent,
        YoutubePlayerComponent
    ],
    imports: [
        AngularDraggableModule,
        AngularResizedEventModule,
        BrowserModule,
        BrowserAnimationsModule,
        ColorPickerModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MomentModule,
        SharedModule,
        TagInputModule
    ],
    providers: [],
    entryComponents: [
        AddFriendModalComponent,
        BugReportModalComponent,
        ChangeAvatarModalComponent,
        FriendRequestsModalComponent,
        GuestNameModalComponent,
        HelpModalComponent,
        OuterAppInviteModalComponent,
        UserSettingsModalComponent,
        ViewUserProfileModalComponent
    ]
})
export class ChatModule { }
