// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App
import { AuthGuard } from '../../core/helpers/auth-guard.service';
import { ChatComponent } from './chat.component';
import { ChatGuestComponent } from './chat-guest/chat-guest.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: ChatComponent, canActivate: [AuthGuard] },
    { path: 'chat-guest', pathMatch: 'full', component: ChatGuestComponent },
];

// Module for Chat routing
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ChatRoutingModule { }
