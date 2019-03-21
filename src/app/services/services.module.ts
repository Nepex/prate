import { AuthInterceptor } from './auth-interceptor';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
    NgModule,
} from '@angular/core';

import { NgxWebstorageModule } from 'ngx-webstorage';
import { ParamSerializer } from './generic/param-serializer';
import { UserService } from './user/user.service';
import { SessionService } from './session/session.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        NgxWebstorageModule.forRoot()
    ],
    exports: [],
    providers: [
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