// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// App
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule)
  },
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
