// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// NPM
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessagesComponent } from './components/alert-messages/alert-messages.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { FormValidationMsgsComponent } from './components/form-validation-msgs/form-validation-msgs.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { InterestFormatPipe } from './pipes/interest-format-pipe/interest-format.pipe';
import { MessageDisplayModalComponent } from './components/message-display-modal/message-display-modal.component';
import { OffClickDirective } from './directives/off-click-directive/off-click.directive';
import { SafeHtmlPipe } from './pipes/safe-html-pipe/safe-html.pipe';
import { SafeUrlPipe } from './pipes/safe-url-pipe/safe-url.pipe';

// App

@NgModule({
    declarations: [
        AlertMessagesComponent,
        ConfirmationModalComponent,
        FormValidationMsgsComponent,
        FooterComponent,
        HeaderComponent,
        InterestFormatPipe,
        MessageDisplayModalComponent,
        OffClickDirective,
        SafeHtmlPipe,
        SafeUrlPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule
    ],
    exports: [
        AlertMessagesComponent,
        ConfirmationModalComponent,
        FormValidationMsgsComponent,
        FooterComponent,
        HeaderComponent,
        InterestFormatPipe,
        MessageDisplayModalComponent,
        OffClickDirective,
        SafeHtmlPipe,
        SafeUrlPipe,
    ],
    providers: [],
    entryComponents: [
        ConfirmationModalComponent,
        MessageDisplayModalComponent
    ]
})
export class SharedModule { }
