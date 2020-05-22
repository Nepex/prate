// Angular
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// App
import { GoogleService } from './google/google.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
    ],
    exports: [],
    providers: [
        GoogleService
    ]
})
export class ServicesExternalModule { }
