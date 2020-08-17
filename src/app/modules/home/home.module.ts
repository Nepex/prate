// Angular
import { NgModule } from '@angular/core';

// NPM
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Modules
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';

// App
import { AttributionsComponent } from './attributions/attributions.component';
import { ChangeLogComponent } from './change-log/change-log.component';
import { DevelopersComponent } from './developers/developers.component';
import { DownloadComponent } from './download/download.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyModalComponent } from './privacy-policy-modal/privacy-policy-modal.component';
import { SummaryComponent } from './summary/summary.component';
import { TermsModalComponent } from './terms-modal/terms-modal.component';

@NgModule({
    declarations: [
        AttributionsComponent,
        ChangeLogComponent,
        DevelopersComponent,
        DownloadComponent,
        LandingPageComponent,
        PrivacyPolicyModalComponent,
        SummaryComponent,
        TermsModalComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        NgbModule,
        SharedModule
    ],
    providers: [],
    entryComponents: [
        PrivacyPolicyModalComponent,
        TermsModalComponent
    ]
})
export class HomeModule { }
