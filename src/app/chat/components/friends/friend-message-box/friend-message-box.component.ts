// Angular
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// NPM

// App
import { FriendMessageData } from '../../../../services/friend/friend-message-data';
import { User } from '../../../../services/user/user';

// Modal for reviewing friend requests
@Component({
    selector: 'prt-friend-message-box',
    templateUrl: './friend-message-box.component.html',
    styleUrls: ['./friend-message-box.component.css']
})
export class FriendMessageBoxComponent implements OnInit {
    // HTML Element Refs
    @ViewChild('messageInput')
    messageInput: ElementRef;

    // Component inputs
    @Input() user: User;
    @Input() friendData: FriendMessageData;

    // Component outputs
    @Output() isFocused: EventEmitter<FriendMessageData> = new EventEmitter();

    // UI
    isMaximized: boolean = false;
    windowPosition = {
        x: 20,
        y: 20
    };

     // Emojis
     hideEmojis: boolean = true;
     emojis: { code: string; img: string; }[] = [
         { code: ':smile:', img: 'smile.png' },
         { code: ':smile-eyesclosed:', img: 'smile-eyesclosed.png' },
         { code: ':smile-open:', img: 'smile-open.png' },
         { code: ':smile-tongue:', img: 'smile-tongue.png' },
         { code: ':cool:', img: 'cool.png' },
         { code: ':laugh:', img: 'laugh.png' },
         { code: ':laugh-crying:', img: 'laugh-crying.png' },
         { code: ':crying-happy:', img: 'crying-happy.png' },
 
         { code: ':frown:', img: 'frown.png' },
         { code: ':frown-angry:', img: 'frown-angry.png' },
         { code: ':frown-exhausted:', img: 'frown-exhausted.png' },
         { code: ':frown-sad:', img: 'frown-sad.png' },
         { code: ':crying-sad:', img: 'crying-sad.png' },
 
         { code: ':confused:', img: 'confused.png' },
         { code: ':uncertain:', img: 'uncertain.png' },
         { code: ':unamused:', img: 'unamused.png' },
         { code: ':thinking:', img: 'thinking.png' },
         { code: ':cringe:', img: 'cringe.png' },
         { code: ':dead:', img: 'dead.png' },
         { code: ':thumbsup:', img: 'thumbsup.png' },
         { code: ':thumbsdown:', img: 'thumbsdown.png' },
         { code: ':facepalm:', img: 'facepalm.png' },
 
         { code: ':angry:', img: 'angry.png' },
         // { code: ':angry-fuming:', img: 'angry-fuming.png'},
 
         { code: ':poop:', img: 'poop.png' },
     ];

     // Forms
    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', [Validators.maxLength(500), Validators.minLength(1), Validators.required]),
    });

    constructor() { }

    ngOnInit(): void {
    }

    onMoveEnd(e) {
        console.log(e)
    }

    maximizeWindow(): void {
        if (!this.isMaximized) {
            this.windowPosition = { x: 0, y: 0}; 
            this.isMaximized = true;
        } else {
            this.windowPosition = { x: 20, y: 20}; 
            this.isMaximized = false;
        }
    }

    insertEmojiCodeInMsg(code: string): void {
        let message = this.messageForm.value.message;
        if (!message) { message = ''; }

        this.messageForm.value.message = this.messageForm.controls.message.setValue(message + code);
        this.hideEmojis = true;
        this.messageInput.nativeElement.focus();
    }

    emitIsTyping(): void {
        
    }
}
