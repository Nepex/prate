import { FooterComponent } from './footer/footer.component';
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { FormValidationMsgsComponent } from './form-validation-msgs/form-validation-msgs.component';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserInfoPanelComponent } from './user-info-panel/user-info-panel.component';
import { OffClickDirective } from './off-click-directive/off-click.directive';
import { MessageDisplayModalComponent } from './message-display/message-display-modal.component';
import { InterestFormatPipe } from './interest-format-pipe/interest-format.pipe';

@NgModule({
    declarations: [
        HeaderComponent,
        FormValidationMsgsComponent,
        AlertMessagesComponent,
        UserInfoPanelComponent,
        OffClickDirective,
        MessageDisplayModalComponent,
        FooterComponent,
        InterestFormatPipe
    ],
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [
        HeaderComponent,
        FormValidationMsgsComponent,
        AlertMessagesComponent,
        UserInfoPanelComponent,
        OffClickDirective,
        MessageDisplayModalComponent,
        FooterComponent,
        InterestFormatPipe
    ],
    providers: [],
})
export class SharedModule { }
