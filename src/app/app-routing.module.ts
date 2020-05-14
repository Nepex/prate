import { ChangeLogComponent } from './resources/change-log/change-log.component';
import { DownloadComponent } from './resources/download/download.component';
import { AuthGuard } from './auth-guard.service';
import { ChatComponent } from './chat/chat.component';
import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DevelopersComponent } from './resources/developers/developers.component';
import { SummaryComponent } from './resources/summary/summary.component';
import { PageNotFoundComponent } from './resources/errors/page-not-found.component.ts/page-not-found.component';
import { AttributionsComponent } from './resources/attributions/attributions.component';

export const routes: Routes = [
  // public
  { path: '', component: LandingPageComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'changelog', component: ChangeLogComponent },
  { path: 'attributions', component: AttributionsComponent },

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
