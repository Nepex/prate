// Angular
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// NPM
import { NgxWebstorageModule } from 'ngx-webstorage';

// App
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { ChatService } from './services/chat.service';
import { FriendService } from './services/friend.service';
import { LevelService } from './services/level.service';
import { ParamSerializer } from './http/param-serializer';
import { SessionService } from './services/session.service';
import { UserService } from './services/user.service';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        NgxWebstorageModule.forRoot()
    ],
    exports: [
    ],
    providers: [
        ChatService,
        FriendService,
        LevelService,
        ParamSerializer,
        SessionService,
        UserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
})
export class CoreModule {}
