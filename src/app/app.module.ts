// Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// NPM
import { NgModule } from '@angular/core';

// App
import { AuthGuard } from './core/helpers/auth-guard.service';
import { AuthModule } from './modules/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './modules/chat/chat.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './modules/home/home.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ServicesExternalModule } from './core/services-external/services-external.module';
import { FriendsModule } from './modules/friends/friends.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    CoreModule,
    ChatModule,
    HomeModule,
    ServicesExternalModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule { }
