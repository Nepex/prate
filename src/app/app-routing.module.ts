import { ChangeLogComponent } from './pages/change-log/change-log.component';
import { DownloadComponent } from './pages/download/download.component';
import { AuthGuard } from './auth-guard.service';
import { ChatComponent } from './chat/chat.component';
import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DevelopersComponent } from './pages/developers/developers.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { PageNotFoundComponent } from './pages/errors/page-not-found.component.ts/page-not-found.component';
import { AttributionsComponent } from './pages/attributions/attributions.component';

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
