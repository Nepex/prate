import { Routes, RouterModule } from '@angular/router';

import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: LandingPageComponent },

  { path: '**', component: LandingPageComponent }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
