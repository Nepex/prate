import { PrivacyPolicyModalComponent } from './pages/privacy-policy/privacy-policy-modal.component';
import { TermsModalComponent } from './pages/terms/terms-modal.component';
import { PageNotFoundComponent } from './pages/errors/page-not-found.component.ts/page-not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DownloadComponent } from './pages/download/download.component';
import { DevelopersComponent } from './pages/developers/developers.component';
import { AuthGuard } from './auth-guard.service';
import { ServicesModule } from './services/services.module';
import { ChatComponent } from './chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { AngularResizedEventModule } from 'angular-resize-event';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginModalComponent } from './pages/login/login-modal.component';
import { SignUpModalComponent } from './pages/sign-up/sign-up-modal.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SummaryComponent } from './pages/summary/summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeLogComponent } from './pages/change-log/change-log.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MessageDisplayModalComponent } from './shared/message-display/message-display-modal.component';
import { UserInfoPanelComponent } from './chat/components/profile/user-info-panel/user-info-panel.component';
import { ChangeAvatarModalComponent } from './chat/components/profile/change-avatar/change-avatar-modal.component';
import { ChatHelpModalComponent } from './chat/components/chat-help/chat-help-modal.component';
import { BugReportModalComponent } from './chat/components/bug-report/bug-report-modal.component';
import { OffClickDirective } from './shared/off-click-directive/off-click.directive';
import { OuterAppInviteModalComponent } from './chat/components/invites/outer-app-invite/outer-app-invite-modal.component';
import { AttributionsComponent } from './pages/attributions/attributions.component';
import { ServicesExternalModule } from './services-ext/services-external.module';
import { TagInputModule } from 'ngx-chips';
import { ViewUserProfileModalComponent } from './chat/components/profile/view-user-profile/view-user-profile-modal.component';
import { UserSettingsModalComponent } from './chat/components/profile/user-settings/user-settings-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ChatComponent,
    LoginModalComponent,
    SignUpModalComponent,
    UserSettingsModalComponent,
    DevelopersComponent,
    DownloadComponent,
    SummaryComponent,
    AttributionsComponent,
    PageNotFoundComponent,
    TermsModalComponent,
    PrivacyPolicyModalComponent,
    ChangeLogComponent,
    UserInfoPanelComponent,
    ChangeAvatarModalComponent,
    ChatHelpModalComponent,
    BugReportModalComponent,
    OuterAppInviteModalComponent,
    ViewUserProfileModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ServicesModule,
    ServicesExternalModule,
    MomentModule,
    AngularResizedEventModule,
    BrowserAnimationsModule,
    ColorPickerModule,
    TagInputModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginModalComponent,
    SignUpModalComponent,
    UserSettingsModalComponent,
    MessageDisplayModalComponent,
    TermsModalComponent,
    PrivacyPolicyModalComponent,
    ChangeAvatarModalComponent,
    ChatHelpModalComponent,
    BugReportModalComponent,
    OuterAppInviteModalComponent,
    ViewUserProfileModalComponent
  ]
})
export class AppModule { }
