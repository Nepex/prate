// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// NPM
import { TagInputModule } from 'ngx-chips';
import { ColorPickerModule } from 'ngx-color-picker';
import { AngularResizedEventModule } from 'angular-resize-event';
import { MomentModule } from 'ngx-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Modules
import { SharedModule } from '../shared/shared.module';

// App Components
import { ChatComponent } from './chat/chat.component';
import { UserSettingsModalComponent } from './components/profile/user-settings/user-settings-modal.component';
import { ChangeAvatarModalComponent } from './components/profile/change-avatar/change-avatar-modal.component';
import { HelpModalComponent } from './components/help/help-modal.component';
import { BugReportModalComponent } from './components/bug-report/bug-report-modal.component';
import { OuterAppInviteModalComponent } from './components/invites/outer-app-invite/outer-app-invite-modal.component';
import { ViewUserProfileModalComponent } from './components/profile/view-user-profile/view-user-profile-modal.component';
import { UserInfoPanelComponent } from './components/profile/user-info-panel/user-info-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        ChatComponent,
        UserSettingsModalComponent,
        ViewUserProfileModalComponent,
        ChangeAvatarModalComponent,
        UserInfoPanelComponent,
        OuterAppInviteModalComponent,
        HelpModalComponent,
        BugReportModalComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AngularResizedEventModule,
        ReactiveFormsModule,
        FormsModule,
        ColorPickerModule,
        NgbModule,
        MomentModule,
        TagInputModule,
        SharedModule
    ],
    providers: [],
    entryComponents: [
        ChangeAvatarModalComponent,
        UserSettingsModalComponent,
        ViewUserProfileModalComponent,
        OuterAppInviteModalComponent,
        BugReportModalComponent,
        HelpModalComponent
    ]
})
export class ChatModule { }
