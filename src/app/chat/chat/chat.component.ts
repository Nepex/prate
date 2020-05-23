// Angular
import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, debounceTime } from 'rxjs/operators';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// NPM
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// App
import { ChatMessage } from '../../services/chat/chat-message';
import { ChatService } from '../../services/chat/chat.service';
import { IsTyping } from '../../services/chat/is-typing';
import { LevelService } from '../../services/level/level.service';
import { OuterAppInfo } from 'src/app/services/chat/outer-app-info';
import { OuterAppInviteModalComponent } from '../components/invites/outer-app-invite/outer-app-invite-modal.component';
import { User } from '../../services/user/user';
import { UserService } from '../../services/user/user.service';
import { ViewUserProfileModalComponent } from '../components/profile/view-user-profile/view-user-profile-modal.component';

@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    @ViewChild('messageInput')
    messageInput: ElementRef;

    // notifications
    @HostListener('window:focus', ['$event'])
    onFocus(event: FocusEvent): void {
        this.titleService.setTitle('Prate');
        this.isWindowFocused = true;

    }

    @HostListener('window:blur', ['$event'])
    onBlur(event: FocusEvent): void {
        this.isWindowFocused = false;
    }

    user: User;
    partner: User = null;
    chatMessages: ChatMessage[] = [];

    loadingRequest: Observable<User>;
    userSettingsChangedSub: Subscription;
    partnerFoundSub: Subscription;
    messageReceivedSub: Subscription;
    messageSentSub: Subscription;

    outerAppInviteReceivedSub: Subscription;
    outerAppInviteSentSub: Subscription;
    outerAppInviteAcceptedSub: Subscription;
    outerAppInviteCanceledSub: Subscription;

    toggledOuterAppFunctionSub: Subscription;

    userDoneTypingSub: Subscription;
    isPartnerTypingSub: Subscription;
    partnerDisconnectSub: Subscription;
    matchingErrorSub: Subscription;

    matching: boolean = false;
    autoScroll: boolean = true;
    userIsTyping: boolean = false;
    partnerIsTyping: boolean = false;
    matchFoundAnimation: boolean = false;
    matchedWithOverlay: boolean = false;
    chatFinishedOverlay: boolean = false;
    partnerLeftName: string;

    chatTimerInterval: number;
    inactivityTimer: number = 0;
    chatTimer: number = 0;

    hideBubbles: boolean = false;
    leaveMessage: string;
    statusMessage: string;
    expMessage: string;
    rankUpMessage: string;
    hideEmojis: boolean = true;
    hideYtInvControls: boolean = true;
    inviteLink: string;
    outerAppInviteModal: NgbModalRef;

    // yt video
    ytUrl: string;
    ytPlayState: boolean = true;
    ytMuteState: boolean = false;

    // game
    gameUrl: string;
    gameType: string;
    gameAccepted: boolean = false;

    hideGames: boolean = true;

    isWindowFocused: boolean;

    // https://www.iconfinder.com/iconsets/emoticons-50
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
    ]

    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', [Validators.maxLength(500), Validators.minLength(1), Validators.required]),
    });

    constructor(private userService: UserService, private chatService: ChatService, private levelService: LevelService, private router: Router, private titleService: Title,
        private modal: NgbModal) {
    }

    /** Populates user data, sets up listeners from chat service and component */
    ngOnInit(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            // set user
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(res.experience);

            // set listeners
            this.userSettingsChangedSub = this.userService.userSettingsChanged.subscribe(res => this.getUser());

            this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.setPartner(partner));
            this.messageSentSub = this.chatService.messageSent.subscribe(msgObj => this.messageSent(msgObj));
            this.messageReceivedSub = this.chatService.messageReceived.subscribe(msgObj => this.messageReceived(msgObj));

            this.outerAppInviteSentSub = this.chatService.outerAppInviteSent.subscribe(msgObj => this.outerAppInviteSent(msgObj));
            this.outerAppInviteReceivedSub = this.chatService.outerAppInviteReceived.subscribe(msgObj => this.outerAppInviteReceived(msgObj));
            this.outerAppInviteAcceptedSub = this.chatService.outerAppInviteAccepted.subscribe(msgObj => this.outerAppInviteAccepted(msgObj));
            this.outerAppInviteCanceledSub = this.chatService.outerAppInviteCanceled.subscribe(msgObj => this.outerAppInviteCanceled(msgObj));

            this.toggledOuterAppFunctionSub = this.chatService.toggledOuterAppFunction.subscribe(msgObj => this.outerAppFunctionToggledByPartner(msgObj));

            this.isPartnerTypingSub = this.chatService.isPartnerTyping.subscribe(typingObj => this.isPartnerTyping(typingObj));
            this.partnerDisconnectSub = this.chatService.partnerDisconnected.subscribe(isDisconnected => this.partnerDisconnect(isDisconnected));
            this.matchingErrorSub = this.chatService.matchingError.subscribe(err => this.matchError(err));

            // timeout because of dark styling needing a user obj present (see html)
            setTimeout(() => {
                this.listenForUserDoneTyping();
            }, 500);

            // if page is refreshed or browser is closed, disconnect the user
            window.onbeforeunload = () => {
                if (this.matching) {
                    this.cancelMatching();
                } else {
                    this.disconnect();
                }

                return null;
            };

            this.loadingRequest = null;
        });
    }

    /** Unsubscribe from subscriptions on page destroy */
    ngOnDestroy(): void {
        this.userSettingsChangedSub.unsubscribe();
        this.partnerFoundSub.unsubscribe();
        this.messageSentSub.unsubscribe();
        this.messageReceivedSub.unsubscribe();
        this.outerAppInviteSentSub.unsubscribe();
        this.outerAppInviteReceivedSub.unsubscribe();
        this.outerAppInviteAcceptedSub.unsubscribe();
        this.outerAppInviteCanceledSub.unsubscribe();
        this.toggledOuterAppFunctionSub.unsubscribe();
        this.userDoneTypingSub.unsubscribe();
        this.isPartnerTypingSub.unsubscribe();
        this.partnerDisconnectSub.unsubscribe();

        clearTimeout(this.chatTimerInterval);
    }

    /** Any time settings need to be refreshed */
    getUser(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.user = res;
        });
    }

    /** Commences matching, looks for available partners */
    searchForMatch(): void {
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(res.experience);

            this.loadingRequest = null;

            this.matching = true;
            this.statusMessage = null;
            this.chatService.intiateMatching(this.user);
        });
    }

    /** Sets partner object after a match is sucessfully made */
    setPartner(partner: User): void {
        if (!this.isWindowFocused) {
            this.titleService.setTitle('Match found!');

            if (this.user.sounds) {
                let audio = new Audio();
                audio.src = "../../assets/sounds/match-found.mp3";
                audio.load();
                audio.play();
            }
        }

        this.matching = false;
        this.partner = partner;
        this.matchFoundAnimation = true;

        setTimeout(() => {
            this.matchFoundAnimation = false;
            this.matchedWithOverlay = true;
        }, 1100);

        this.accumulateTime();
    }

    approveMatch(): void {
        this.matchedWithOverlay = false;
    }

    approveChatFinished(): void {
        this.chatFinishedOverlay = false;
    }

    /** Accumulates chat time and kicks user if inactive for 10 minutes */
    accumulateTime(): void {
        this.chatTimerInterval = window.setTimeout(() => {
            this.chatTimer = this.chatTimer + 10;
            this.inactivityTimer = this.inactivityTimer + 10;

            if (this.inactivityTimer >= 570) {
                this.statusMessage = 'Inactivity detected, please send a message';
            }

            // disconnect user after 10 minutes of inactivity
            if (this.inactivityTimer >= 600) {

                // terrible fix for inactivity during game - remove once everything's worked out
                if (this.gameAccepted) {
                    return;
                }

                this.disconnect();
                return;
            }

            this.accumulateTime();
        }, 10000);
    }

    /** Attempt to send a message */
    sendMessage(): void {
        if (!this.messageForm.valid || !this.partner) {
            return;
        }

        const message = this.messageForm.value.message;
        this.chatService.sendMessage(this.partner, this.user, message);
        this.inactivityTimer = 0;
        this.statusMessage = null;
        this.messageForm.reset();
    }

    /** Listens for messages sucessfully sent by user */
    messageSent(msgObj: ChatMessage): void {
        msgObj.message = this.linkify(msgObj.message);
        msgObj.message = this.emojify(msgObj.message);

        this.chatMessages.push(msgObj);
    }

    /** Listens for messages received from partner */
    messageReceived(msgObj: ChatMessage): void {
        if (!this.isWindowFocused) {
            this.titleService.setTitle('New Message!');

            if (this.user.sounds) {
                let audio = new Audio();
                audio.src = "../../assets/sounds/notif.mp3";
                audio.load();
                audio.play();
            }
        }

        if (this.isWindowFocused && this.hideBubbles) {
            if (this.user.sounds) {
                let audio = new Audio();
                audio.src = "../../assets/sounds/notif.mp3";
                audio.load();
                audio.play();
            }
        }

        msgObj.message = this.linkify(msgObj.message);
        msgObj.message = this.emojify(msgObj.message);

        this.chatMessages.push(msgObj);
    }

    /** If host starts typing */
    listenForUserTyping(): void {
        if (!this.partner || this.userIsTyping) {
            return;
        }

        this.userIsTyping = true;
        this.chatService.userIsTyping(true, this.partner);
    }

    /** Listens for last key up event, sets user as done typing after .5 seconds */
    listenForUserDoneTyping(): void {
        const input = document.getElementById('messageInput');
        const event = fromEvent(input, 'keyup').pipe(map(i => i.currentTarget['value']));
        const debouncedInput = event.pipe(debounceTime(500));

        this.userDoneTypingSub = debouncedInput.subscribe(val => {
            if (this.partner) {
                this.userIsTyping = false;
                this.chatService.userIsTyping(false, this.partner);
            }
        });
    }

    /** If partner is typing, display a message */
    isPartnerTyping(typingObj: IsTyping): void {
        if (!this.partner) {
            return;
        }

        if (typingObj.isTyping) {
            this.partnerIsTyping = true;
        } else {
            this.partnerIsTyping = false;
        }
    }

    /** On cancel button clicked, halt matching */
    cancelMatching(): void {
        // if a partner has been found, make sure to emit disconnection
        if (this.partner) {
            this.disconnect();
            return;
        }
        this.chatService.cancelMatching();
        this.matching = false;
    }

    /** If user leaves the chat or is disconnected - unmatch both user and partner */
    disconnect(): void {
        this.chatService.disconnect(this.partner);
        this.leaveMessage = 'You left the chat';
        this.chatMessages = [];
        this.partner = null;
        this.inviteLink = null;
        this.ytUrl = null;
        this.hideBubbles = false;
        this.closeGame();

        this.chatFinishedOverlay = true;
        this.stopTimerAndGiveExp();
    }

    /** If partner is disconnected, unmatch user */
    partnerDisconnect(isDisconnected: boolean): void {
        if (isDisconnected) {
            if (!this.isWindowFocused) {
                this.titleService.setTitle('Match left!');

                if (this.user.sounds) {
                    let audio = new Audio();
                    audio.src = "../../assets/sounds/match-left.mp3";
                    audio.load();
                    audio.play();
                }
            }

            this.chatService.killSocketConnection();
            this.partnerIsTyping = false;
            this.partnerLeftName = this.partner.name;
            this.leaveMessage = 'has left the chat';
            this.chatMessages = [];
            this.partner = null;
            this.inviteLink = null;
            this.ytUrl = null;
            this.hideBubbles = false;
            this.closeGame();

            this.matchedWithOverlay = false;
            this.chatFinishedOverlay = true;
            this.stopTimerAndGiveExp();
        }
    }

    /** Resets timers and awards exp */
    stopTimerAndGiveExp(): void {
        clearTimeout(this.chatTimerInterval);
        this.rankUpMessage = null;
        let levelUpInfo = this.levelService.checkIfLevelUp(this.user.experience + this.chatTimer, this.user.levelInfo);

        this.expMessage = 'Gained ' + this.chatTimer + ' experience!';

        if (levelUpInfo) {
            this.expMessage = this.expMessage + ' - Level up!';

            if (this.levelService.checkIfRankUp(this.user.experience + this.chatTimer, this.user.levelInfo)) {
                this.rankUpMessage = '<img src="../../assets/images/badges/' + levelUpInfo.badge + '" height="20" width="20" style="position: relative; top: -2px;"> <br />Ranked up to ' + levelUpInfo.rank + '!'
            }
        }

        this.loadingRequest = this.userService.awardExp(this.user, this.chatTimer);
        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
        });

        this.user.experience = this.user.experience + this.chatTimer;

        this.user.levelInfo = this.levelService.getLevelInfo(this.user.experience);

        this.chatTimer = 0;
        this.inactivityTimer = 0;
    }

    /** If user is already matched/matching or auth failure */
    matchError(err: string): void {
        this.matching = false;
        this.statusMessage = err;
    }

    // Go home when logo is clicked
    goToHome(): void {
        this.router.navigateByUrl('/');
    }

    // toggle chat bubbles
    toggleBubbles(): void {
        this.hideBubbles = !this.hideBubbles;

        if (!this.hideBubbles) {
            setTimeout(() => {
                this.returnToBottom();
            }, 200);
        }
    }

    // Opens chatting users' profile
    openViewUserProfile(msgType: string, userId: string, partnerId: string): void {
        let id;

        id = msgType === 'sent' ? userId : partnerId;

        const modalRef = this.modal.open(ViewUserProfileModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.userId = id;
    }

    /** If chat is scrolled, check if user is at the bottom, if not, allow for free scrolling. */
    chatScrolled(): void {
        let element = document.getElementById('chatMessages');
        let atBottom = (element.scrollTop + element.offsetHeight + 100) >= element.scrollHeight;
        if (atBottom) {
            this.autoScroll = true;
        } else {
            this.autoScroll = false;
        }
    }

    /** If user is at the bottom, auto scroll chat with messages sent/received */
    checkForAutoScroll(): void {
        let element = document.getElementById('chatMessages');

        if (this.autoScroll) {
            element.scrollTop = element.scrollHeight;
        }
    }

    /** Auto scrolls to bottom */
    returnToBottom(): void {
        let element = document.getElementById('chatMessages');

        element.scrollTop = element.scrollHeight;
    }

    /** Checks message for links then turns them into HREFs */
    linkify(plainTextMessage: string): string {
        let urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return plainTextMessage.replace(urlRegex, url => {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });
    }

    /** Checks if emojis are present in message and converts them */
    emojify(plainTextMessage: string): string {
        let newMessage = plainTextMessage;

        for (let i = 0; i < this.emojis.length; i++) {
            let emojiString = this.emojis[i].code;
            let emojiRegex = new RegExp(emojiString, 'g');

            newMessage = newMessage.replace(emojiRegex, '<img src="../../assets/images/emojis/' + this.emojis[i].img + '" height="18" width="18" />');
        }

        return newMessage;
    }

    /** Add emoji to message */
    insertEmoji(code: string): void {
        let message = this.messageForm.value.message;
        if (!message) { message = ''; }

        this.messageForm.value.message = this.messageForm.controls.message.setValue(message + code);
        this.hideEmojis = true;
        this.messageInput.nativeElement.focus();
    }

    // Games
    prepareGameInvite(game: string): void {
        if (!this.partner) {
            return;
        }

        if (game === 'gartic') {
            this.gameUrl = 'https://www.gartic.io';
            this.gameType = 'gartic';
        } else if (game === 'chess') {
            this.gameUrl = 'https://www.chess.org'
            this.gameType = 'chess';
        } else if (game === 'tictactoe') {
            this.gameUrl = 'https://ultimate-t3.herokuapp.com';
            this.gameType = 'tictactoe';
        }
    }

    closeGame(): void {
        this.gameUrl = null;
        this.gameType = null;
        this.gameAccepted = false;
        this.inviteLink = null;
    }

    sendGameInvite(gameInfo: { url: string; gameType: string; }): void {
        this.inviteLink = gameInfo.url;
        this.sendOuterAppInvite(gameInfo.gameType);
    }

    gameSessionClosed(): void {
        this.toggleOuterAppFunction(this.gameType, 'close');
    }

    // Invite Logic
    sendOuterAppInvite(app: string): void {
        if (!this.partner) {
            return;
        }

        if (this.inviteLink.length > 1000 || !this.inviteLink) {
            this.inviteLink = null;
            return;
        }

        if (app === 'yt') {
            const ytRegEx = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/g;

            if (!ytRegEx.test(this.inviteLink)) {
                this.inviteLink = 'Invalid link'
                return;
            }
        }

        this.chatService.sendOuterAppInvite(this.partner, this.user, app, this.inviteLink);
        this.inactivityTimer = 0;
        this.statusMessage = null;
        if (app === 'yt') { this.hideYtInvControls = true; }
    }

    outerAppInviteSent(invInfo: OuterAppInfo): void {
        this.outerAppInviteModal = this.modal.open(OuterAppInviteModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        this.outerAppInviteModal.componentInstance.user = invInfo.sender;
        this.outerAppInviteModal.componentInstance.type = 'sent';
        this.outerAppInviteModal.componentInstance.outerApp = invInfo.outerApp;

        this.outerAppInviteModal.result.then(res => {
            if (res === 'cancel') {
                this.chatService.outerAppInviteCancel(this.partner, this.user, invInfo.outerApp);
            }
        });
    }

    outerAppInviteReceived(invInfo: OuterAppInfo): void {
        this.outerAppInviteModal = this.modal.open(OuterAppInviteModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        this.outerAppInviteModal.componentInstance.user = invInfo.sender;
        this.outerAppInviteModal.componentInstance.type = 'received';
        this.outerAppInviteModal.componentInstance.outerApp = invInfo.outerApp;
        this.outerAppInviteModal.componentInstance.url = invInfo.outerAppLink;

        this.outerAppInviteModal.result.then(res => {
            if (res === 'accept') {
                this.outerAppInviteAccepted(invInfo);
                this.chatService.outerAppInviteAccept(this.partner, this.user, invInfo.outerApp);
            } else if (res === 'cancel') {
                this.chatService.outerAppInviteCancel(this.partner, this.user, invInfo.outerApp);
            }
        });
    }

    outerAppInviteAccepted(invInfo: OuterAppInfo): void {
        if (this.outerAppInviteModal) {
            this.outerAppInviteModal.close();
        }
        // prepare app
        // yt
        if (invInfo.outerApp === 'yt') {
            this.ytUrl = invInfo.outerAppLink ? invInfo.outerAppLink : this.inviteLink;
        }

        // games
        if (invInfo.outerApp === 'gartic' || invInfo.outerApp === 'chess' || invInfo.outerApp === 'tictactoe') {
            if (invInfo.outerAppLink) {
                this.gameUrl = invInfo.outerAppLink;
            }

            if (invInfo.outerApp === 'gartic') {
                this.gameType = 'gartic';
            }
            if (invInfo.outerApp === 'chess') {
                this.gameType = 'chess';
            }
            if (invInfo.outerApp === 'tictactoe') {
                this.gameType = 'tictactoe';
            }

            this.gameAccepted = true;
        }
    }

    outerAppInviteCanceled(invInfo: OuterAppInfo): void {
        this.outerAppInviteModal.close();
        this.closeGame();
    }

    toggleOuterAppFunction(outerApp: string, activity: string): void {
        if (outerApp === 'yt') {
            if (activity === 'playpause') {
                this.ytPlayState = !this.ytPlayState;
            }
            else if (activity === 'muteunmute') {
                this.ytMuteState = !this.ytMuteState;
            }
            else if (activity === 'close') {
                this.ytUrl = null;
                this.inviteLink = null;
                this.ytPlayState = true;
                this.ytMuteState = false;
                this.hideYtInvControls = true;
                this.hideBubbles = false;
            }
        }

        if (outerApp === 'gartic' || outerApp === 'chess' || outerApp === 'tictactoe') {
            if (activity === 'close') {
                this.closeGame();
            }
        }

        this.chatService.toggleOuterAppFunction(this.partner, this.user, outerApp, activity);
    }

    outerAppFunctionToggledByPartner(receivedInfo: OuterAppInfo): void {
        if (receivedInfo.outerApp === 'yt') {
            if (receivedInfo.activity === 'playpause') {
                this.ytPlayState = !this.ytPlayState;
            }
            else if (receivedInfo.activity === 'muteunmute') {
                this.ytMuteState = !this.ytMuteState;
            }
            else if (receivedInfo.activity === 'close') {
                this.ytUrl = null;
                this.inviteLink = null;
                this.ytPlayState = true;
                this.ytMuteState = false;
                this.hideYtInvControls = true;
                this.hideBubbles = false;
            }
        }

        if (receivedInfo.outerApp === 'gartic' || receivedInfo.outerApp === 'chess' || receivedInfo.outerApp === 'tictactoe') {
            if (receivedInfo.activity === 'close') {
                this.closeGame();
            }
        }
    }
}
