// NPM
import { NgModule } from '@angular/core';

// App
import { AuthGuard } from './auth-guard.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { ChatModule } from './chat/chat.module';
import { ServicesExternalModule } from './services/services-ext/services-external.module';
import { ServicesModule } from './services/services.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    ChatModule,
    PagesModule,
    ServicesExternalModule,
    ServicesModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
