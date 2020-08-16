// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// NPM
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Modules
import { SharedModule } from '../../shared/shared.module';

// App
import { LoginModalComponent } from './login-modal/login-modal.component';
import { SignUpModalComponent } from './sign-up-modal/sign-up-modal.component';

@NgModule({
    declarations: [
        LoginModalComponent,
        SignUpModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        SharedModule
    ],
    providers: [],
    entryComponents: [
        LoginModalComponent,
        SignUpModalComponent
    ]
})
export class AuthModule { }
