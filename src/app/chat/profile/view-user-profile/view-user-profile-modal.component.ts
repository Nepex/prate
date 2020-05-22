import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LevelService } from 'src/app/services/level/level.service';

@Component({
    selector: 'prt-view-user-profile-modal',
    templateUrl: './view-user-profile-modal.component.html',
    styleUrls: ['./view-user-profile-modal.component.css']
})
export class ViewUserProfileModalComponent implements OnInit {
    @Input() userId: string;
    user: any;

    loadingRequest: Observable<any>;

    constructor(private userService: UserService, public activeModal: NgbActiveModal, private levelService: LevelService) {}

    ngOnInit() {
        this.loadingRequest = this.userService.getById(this.userId);

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(this.user.experience);
        });
    }
}
