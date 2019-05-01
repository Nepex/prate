import { FooterComponent } from './footer/footer.component';
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { FormValidationMsgsComponent } from './form-validation-msgs/form-validation-msgs.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OffClickDirective } from './off-click-directive/off-click.directive';
import { MessageDisplayModalComponent } from './message-display/message-display-modal.component';
import { InterestFormatPipe } from './interest-format-pipe/interest-format.pipe';
import { ServicesModule } from '../services/services.module';

@NgModule({
    declarations: [
        HeaderComponent,
        FormValidationMsgsComponent,
        AlertMessagesComponent,
        OffClickDirective,
        MessageDisplayModalComponent,
        FooterComponent,
        InterestFormatPipe
    ],
    imports: [
        CommonModule,
        NgbModule,
        ServicesModule
    ],
    exports: [
        HeaderComponent,
        FormValidationMsgsComponent,
        AlertMessagesComponent,
        OffClickDirective,
        MessageDisplayModalComponent,
        FooterComponent,
        InterestFormatPipe
    ],
    providers: [],
})
export class SharedModule { }
