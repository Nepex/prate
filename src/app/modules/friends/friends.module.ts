// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// NPM
import { AngularDraggableModule } from 'angular2-draggable';
import { MomentModule } from 'ngx-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// App Modules
import { SharedModule } from '../../shared/shared.module';

// App Components
import { AddFriendModalComponent } from './add-friend-modal/add-friend-modal.component';
import { FriendMessageBoxComponent } from './friend-message-box/friend-message-box.component';
import { FriendRequestsModalComponent } from './friend-requests-modal/friend-requests-modal.component';
import { FriendListComponent } from './friendlist/friendlist.component';

@NgModule({
    declarations: [
        AddFriendModalComponent,
        FriendMessageBoxComponent,
        FriendRequestsModalComponent,
        FriendListComponent
    ],
    imports: [
        AngularDraggableModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MomentModule,
        SharedModule
    ],
    exports: [
        AddFriendModalComponent,
        FriendMessageBoxComponent,
        FriendRequestsModalComponent,
        FriendListComponent
    ],
    providers: [],
    entryComponents: [
        AddFriendModalComponent,
        FriendRequestsModalComponent
    ],
})
export class FriendsModule { }
