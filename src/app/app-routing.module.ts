// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App
import { AuthGuard } from './core/guards/auth-guard.service';
import { AttributionsComponent } from './modules/home/attributions/attributions.component';
import { ChangeLogComponent } from './modules/home/change-log/change-log.component';
import { ChatComponent } from './modules/chat/chat.component';
import { DevelopersComponent } from './modules/home/developers/developers.component';
import { DownloadComponent } from './modules/home/download/download.component';
import { LandingPageComponent } from './modules/home/landing-page/landing-page.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { SummaryComponent } from './modules/home/summary/summary.component';

export const routes: Routes = [
  // public
  { path: '', component: LandingPageComponent },
  { path: 'attributions', component: AttributionsComponent },
  { path: 'changelog', component: ChangeLogComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'summary', component: SummaryComponent },
  // { path: 'chat-guest', component: ChatGuestComponent },

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
