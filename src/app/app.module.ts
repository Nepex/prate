import { PrivacyPolicyComponent } from './resources/privacy-policy/privacy-policy.component';
import { DownloadComponent } from './resources/download/download.component';
import { DevelopersComponent } from './resources/developers/developers.component';
import { UserProfileModalComponent } from './user-profile/user-profile-modal.component';
import { AuthGuard } from './auth-guard.service';
import { ServicesModule } from './services/services.module';
import { ChatComponent } from './chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginModalComponent } from './login/login-modal.component';
import { SignUpModalComponent } from './sign-up/sign-up-modal.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SummaryComponent } from './resources/summary/summary.component';
import { TermsOfUseComponent } from './resources/terms-of-use/terms-of-use.component';

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
    PrivacyPolicyComponent,
    SummaryComponent,
    TermsOfUseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ServicesModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginModalComponent,
    SignUpModalComponent,
    UserProfileModalComponent
]
})
export class AppModule { }
