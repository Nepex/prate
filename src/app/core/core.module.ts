// Angular
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// NPM
import { NgxWebstorageModule } from 'ngx-webstorage';

// App
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { ChatService, FriendService, LevelService, SessionService, UserService } from './services';
import { ParamSerializer } from './http/param-serializer';

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
