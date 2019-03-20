import { AuthGuard } from './auth-guard.service';
import { ChatComponent } from './chat/chat.component';
import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
