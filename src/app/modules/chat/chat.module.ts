// Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// NPM
import { AngularResizedEventModule } from 'angular-resize-event';
import { MomentModule } from 'ngx-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Modules
import { FriendsModule } from '../friends/friends.module';
import { ProfileModule } from '../profile/profile.module';
import { SharedModule } from '../../shared/shared.module';

// App Components
import { BugReportModalComponent } from './modals/bug-report-modal/bug-report-modal.component';
import { ChatComponent } from './chat.component';
import { GameContainerComponent } from './integrations/game-container/game-container.component';
import { HelpModalComponent } from './modals/help-modal/help-modal.component';
import { OuterAppInviteModalComponent } from './modals/invite-modal/outer-app-invite-modal.component';
import { YoutubePlayerComponent } from './integrations/youtube-player/youtube-player.component';
import { ChatGuestComponent } from './chat-guest/chat-guest.component';
import { GuestNameModalComponent } from './modals/guest-name-modal/guest-name-modal.component';

@NgModule({
    declarations: [
        BugReportModalComponent,
        ChatComponent,
        ChatGuestComponent,
        GuestNameModalComponent,
        GameContainerComponent,
        HelpModalComponent,
        OuterAppInviteModalComponent,
        YoutubePlayerComponent
    ],
    imports: [
        AngularResizedEventModule,
        BrowserModule,
        BrowserAnimationsModule,
        FriendsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MomentModule,
        ProfileModule,
        SharedModule
    ],
    providers: [],
    entryComponents: [
        BugReportModalComponent,
        GuestNameModalComponent,
        HelpModalComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ChatModule { }
