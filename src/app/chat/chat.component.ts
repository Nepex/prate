import { UserService } from './../services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../services/user/user';
import { ChatService } from '../services/chat/chat.service';


// import * as moment from 'moment';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/skipWhile';
// import 'rxjs/add/operator/scan';
// import 'rxjs/add/operator/takeWhile';
// import 'rxjs/add/operator/throttleTime';

@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    chatMessages = [];
    secretCode: string;
    conversation: boolean = false;
    loadingRequest: Observable<User>;
    user: User;

    constructor(private userService: UserService, private chatService: ChatService) {
    }


    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.loadingRequest = null;
        });


        // this.chatService
        //     .getMessages()
        //     .distinctUntilChanged()
        //     .filter((message) => message.trim().length > 0)
        //     .throttleTime(1000)
        //     .takeWhile(() => this.conversation === true)
        //     .scan((acc: string, message: string, index: number) =>
        //         `${message}(${index + 1})`
        //         , 1)
        //     .subscribe((message: string) => {
        //         const currentTime = moment().format('hh:mm:ss a');
        //         const messageWithTimestamp = `${currentTime}: ${message}`;
        //         this.chatMessages.push(messageWithTimestamp);
        //     });
    }

    searchForMatch() {
        this.chatService.intiateMatching(this.user);
    }

    sendMessage() {
        // this.chatService.sendMessage('hello!');
    }

}
