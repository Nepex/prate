// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// NPM
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Modules
import { SharedModule } from '../shared/shared.module';

// App Components
import { AttributionsComponent } from './attributions/attributions.component';
import { ChangeLogComponent } from './change-log/change-log.component';
import { DevelopersComponent } from './developers/developers.component';
import { DownloadComponent } from './download/download.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginModalComponent } from './login/login-modal.component';
import { PageNotFoundComponent } from './errors/page-not-found.component.ts/page-not-found.component';
import { PrivacyPolicyModalComponent } from './privacy-policy/privacy-policy-modal.component';
import { SignUpModalComponent } from './sign-up/sign-up-modal.component';
import { SummaryComponent } from './summary/summary.component';
import { TermsModalComponent } from './terms/terms-modal.component';

@NgModule({
  declarations: [
    AttributionsComponent,
    ChangeLogComponent,
    DevelopersComponent,
    DownloadComponent,
    LandingPageComponent,
    LoginModalComponent,
    PageNotFoundComponent,
    PrivacyPolicyModalComponent,
    SignUpModalComponent,
    SummaryComponent,
    TermsModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [],
  entryComponents: [
    LoginModalComponent,
    PrivacyPolicyModalComponent,
    SignUpModalComponent,
    TermsModalComponent
  ]
})
export class PagesModule { }
