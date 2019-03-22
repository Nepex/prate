import { UserService } from './../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session/session.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../services/user/user';

@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    constructor(private sessionService: SessionService, private router: Router, private userService: UserService) { }

    loadingRequest: Observable<User>;

    chatArea = [{},{},{},{},{},{},{},{},{},];

    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            console.log(res);
        });
    }

    logout() {
        this.sessionService.logout();
        this.router.navigateByUrl('/');
    }
}
