import { PrivacyPolicyComponent } from './resources/privacy-policy/privacy-policy.component';
import { DownloadComponent } from './resources/download/download.component';
import { AuthGuard } from './auth-guard.service';
import { ChatComponent } from './chat/chat.component';
import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DevelopersComponent } from './resources/developers/developers.component';
import { SummaryComponent } from './resources/summary/summary.component';
import { TermsOfUseComponent } from './resources/terms-of-use/terms-of-use.component';
import { PageNotFoundComponent } from './resources/errors/page-not-found.component.ts/page-not-found.component';

export const routes: Routes = [
  // public
  { path: '', component: LandingPageComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'terms-of-use', component: TermsOfUseComponent },

  // private
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },

  // path doesn't exist
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
