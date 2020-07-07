// Angular
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, debounceTime } from 'rxjs/operators';
import { Subscription, fromEvent } from 'rxjs';

// NPM
import * as moment from 'moment';

// App
import { FriendMessageData } from '../../../../services/friend/friend-message-data';
import { User } from '../../../../services/user/user';
import { FriendService } from '../../../../services/friend/friend.service';
import { ChatMessage } from '../../../../services/chat/chat-message';

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

    // Subs
    userDoneTypingSub: Subscription;

    // UI
    autoScroll: boolean = true;
    userIsTyping: boolean = false;
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

    constructor(private friendService: FriendService) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.listenAndEmitDoneTyping();
        }, 500);
    }

    // --- Chatting ---
    sendMessage(): void {
        if (!this.messageForm.valid) {
            return;
        }

        const previewImg = this.imagify(this.messageForm.value.message);

        const msgObj: ChatMessage = {
            sender: this.user.id,
            senderName: this.user.name,
            receiver: this.friendData.id,
            font_face: this.user.font_face,
            font_color: this.user.font_color,
            bubble_color: this.user.bubble_color,
            avatar: this.user.avatar,
            status: this.user.status,
            message: this.messageForm.value.message,
            datetime: moment().format('hh:mm a'),
            type: 'sent',
            previewImg: previewImg
        };

        this.friendService.sendFriendMessage(msgObj);
        this.messageForm.reset();
    }

    maximizeWindow(): void {
        if (!this.isMaximized) {
            this.windowPosition = { x: 0, y: 0 };
            this.isMaximized = true;
        } else {
            this.windowPosition = { x: 20, y: 20 };
            this.isMaximized = false;
        }
    }

    sendMatchInvite(friend: User) {
        this.friendService.sendMatchInviteFromMessageBox(friend);
    }

    // Chat Formatting
    insertEmojiCodeInMsg(code: string): void {
        let message = this.messageForm.value.message;
        if (!message) { message = ''; }

        this.messageForm.value.message = this.messageForm.controls.message.setValue(message + code);
        this.hideEmojis = true;
        this.messageInput.nativeElement.focus();
    }

    imagify(plainTextMessage: string): string {
        let imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/gi;

        const imgUrlArray = plainTextMessage.match(imageRegex);

        if (!imgUrlArray) {
            return null;
        }

        return imgUrlArray[0];
    }

    emitIsTyping(): void {
        if (this.userIsTyping) {
            return;
        }

        this.userIsTyping = true;
        this.friendService.userIsTyping(true, this.friendData, this.user);
    }

    listenAndEmitDoneTyping(): void {
        const input = document.getElementById('messageInput');
        const event = fromEvent(input, 'input').pipe(map(i => i.currentTarget['value']));
        const debouncedInput = event.pipe(debounceTime(500));

        this.userDoneTypingSub = debouncedInput.subscribe(val => {
            this.userIsTyping = false;
            this.friendService.userIsTyping(false, this.friendData, this.user);
        });
    }

    scrollToChatBottom(): void {
        let element = document.getElementById(this.friendData.id);

        element.scrollTop = element.scrollHeight;
    }

    // if chat is scrolled, check if user is at the bottom, if not, allow for free scrolling
    chatScrolled(): void {
        let element = document.getElementById(this.friendData.id);
        let atBottom = (element.scrollTop + element.offsetHeight + 90) >= element.scrollHeight;

        if (atBottom) {
            this.autoScroll = true;
        } else {
            this.autoScroll = false;
        }
    }

    // If user is at the bottom, auto scroll chat with messages sent/received
    checkForAutoScroll(): void {
        let element = document.getElementById(this.friendData.id);

        if (this.autoScroll) {
            element.scrollTop = element.scrollHeight;
        }
    }
}
