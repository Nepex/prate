// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// NPM
import { TagInputModule } from 'ngx-chips';
import { ColorPickerModule } from 'ngx-color-picker';
import { MomentModule } from 'ngx-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Modules
import { SharedModule } from '../../shared/shared.module';

// App Components
import { ChangeAvatarModalComponent } from './change-avatar-modal/change-avatar-modal.component';
import { UserInfoPanelComponent } from './user-info-panel/user-info-panel.component';
import { UserSettingsModalComponent } from './user-settings-modal/user-settings-modal.component';
import { ViewUserProfileModalComponent } from './view-user-profile-modal/view-user-profile-modal.component';


@NgModule({
    declarations: [
        ChangeAvatarModalComponent,
        UserInfoPanelComponent,
        UserSettingsModalComponent,
        ViewUserProfileModalComponent,
    ],
    imports: [
        CommonModule,
        ColorPickerModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MomentModule,
        SharedModule,
        TagInputModule
    ],
    providers: [],
    exports: [
        ChangeAvatarModalComponent,
        UserInfoPanelComponent,
        UserSettingsModalComponent,
        ViewUserProfileModalComponent,
    ],
    entryComponents: [
        ChangeAvatarModalComponent,
        UserSettingsModalComponent,
        ViewUserProfileModalComponent,
    ]
})
export class ProfileModule { }
