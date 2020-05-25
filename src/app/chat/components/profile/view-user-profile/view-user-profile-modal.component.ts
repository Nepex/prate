// Angular
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// App
import { LevelService } from '../../../../services/level/level.service';
import { User } from '../../../../services/user/user';
import { UserService } from '../../../../services/user/user.service';

// Modal for viewing a user's profile
@Component({
    selector: 'prt-view-user-profile-modal',
    templateUrl: './view-user-profile-modal.component.html',
    styleUrls: ['./view-user-profile-modal.component.css']
})
export class ViewUserProfileModalComponent implements OnInit {
    // Component Inputs
    @Input() userId: string;

    // Subs
    loadingRequest: Observable<User>;

    // Data Store
    user: User;

    constructor(private userService: UserService, public activeModal: NgbActiveModal, private levelService: LevelService) {}

    ngOnInit(): void {
        this.loadingRequest = this.userService.getById(this.userId);

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(this.user.experience);
        });
    }
}
