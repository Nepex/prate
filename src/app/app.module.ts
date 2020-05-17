import { PrivacyPolicyModalComponent } from './resources/privacy-policy/privacy-policy-modal.component';
import { TermsModalComponent } from './resources/terms/terms-modal.component';
import { PageNotFoundComponent } from './resources/errors/page-not-found.component.ts/page-not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DownloadComponent } from './resources/download/download.component';
import { DevelopersComponent } from './resources/developers/developers.component';
import { UserProfileModalComponent } from './chat/user-profile/user-profile-modal.component';
import { AuthGuard } from './auth-guard.service';
import { ServicesModule } from './services/services.module';
import { ChatComponent } from './chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MomentModule } from 'ngx-moment';
import { AngularResizedEventModule } from 'angular-resize-event';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginModalComponent } from './login/login-modal.component';
import { SignUpModalComponent } from './sign-up/sign-up-modal.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SummaryComponent } from './resources/summary/summary.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeLogComponent } from './resources/change-log/change-log.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MessageDisplayModalComponent } from './shared/message-display/message-display-modal.component';
import { UserInfoPanelComponent } from './chat/user-info-panel/user-info-panel.component';
import { ChangeAvatarModalComponent } from './chat/change-avatar/change-avatar-modal.component';
import { ChatHelpModalComponent } from './chat/chat-help/chat-help-modal.component';
import { BugReportModalComponent } from './chat/bug-report/bug-report-modal.component';
import { OffClickDirective } from './shared/off-click-directive/off-click.directive';
import { OuterAppInviteModalComponent } from './chat/invite-modals/outer-app-invite/outer-app-invite-modal.component';
import { AttributionsComponent } from './resources/attributions/attributions.component';
import { ServicesExternalModule } from './services-external/services-external.module';
import { TagInputModule } from 'ngx-chips';
import { ViewUserProfileModalComponent } from './chat/view-user-profile/view-user-profile-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ChatComponent,
    LoginModalComponent,
    SignUpModalComponent,
    UserProfileModalComponent,
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
    UserProfileModalComponent,
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
