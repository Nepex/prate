// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App
import { AttributionsComponent } from './pages/attributions/attributions.component';
import { AuthGuard } from './auth-guard.service';
import { ChangeLogComponent } from './pages/change-log/change-log.component';
import { ChatComponent } from './chat/chat/chat.component';
import { DevelopersComponent } from './pages/developers/developers.component';
import { DownloadComponent } from './pages/download/download.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { PageNotFoundComponent } from './pages/errors/page-not-found.component.ts/page-not-found.component';
import { SummaryComponent } from './pages/summary/summary.component';

export const routes: Routes = [
  // public
  { path: '', component: LandingPageComponent },
  { path: 'attributions', component: AttributionsComponent },
  { path: 'changelog', component: ChangeLogComponent },
  { path: 'developers', component: DevelopersComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'summary', component: SummaryComponent },

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
