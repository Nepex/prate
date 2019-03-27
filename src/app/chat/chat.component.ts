import { UserService } from './../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../services/user/user';

@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    constructor(private userService: UserService) { }

    loadingRequest: Observable<User>;

    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
        });
    }
}
