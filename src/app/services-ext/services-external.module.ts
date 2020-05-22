import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
    NgModule,
} from '@angular/core';

import { GoogleService } from './google/google.service';

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    exports: [
    ],
    providers: [
        GoogleService
    ],
})
export class ServicesExternalModule {}
