// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// NPM
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { FormValidationMsgsComponent } from './form-validation-msgs/form-validation-msgs.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { InterestFormatPipe } from './interest-format-pipe/interest-format.pipe';
import { MessageDisplayModalComponent } from './message-display/message-display-modal.component';
import { OffClickDirective } from './off-click-directive/off-click.directive';
import { SafeHtmlPipe } from './safe-html-pipe/safe-html.pipe';
import { SafeUrlPipe } from './safe-url-pipe/safe-url.pipe';

@NgModule({
    declarations: [
        AlertMessagesComponent,
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
        MessageDisplayModalComponent
    ]
})
export class SharedModule { }
