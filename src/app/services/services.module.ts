// Angular
import { AuthInterceptor } from './auth-interceptor';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// NPM
import { NgxWebstorageModule } from 'ngx-webstorage';

// App
import { ChatService } from './chat/chat.service';
import { FriendService } from './friend/friend.service';
import { LevelService } from './level/level.service';
import { ParamSerializer } from './generic/param-serializer';
import { SessionService } from './session/session.service';
import { UserService } from './user/user.service';

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
export class ServicesModule {}
