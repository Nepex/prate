// Angular
import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, debounceTime } from 'rxjs/operators';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// NPM
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// App
import { ChatMessage } from '../../services/chat/chat-message';
import { ChatService } from '../../services/chat/chat.service';
import { IsTyping } from '../../services/chat/is-typing';
import { LevelService } from '../../services/level/level.service';
import { OuterAppInfo } from '../../services/chat/outer-app-info';
import { OuterAppInviteModalComponent } from '../components/invites/outer-app-invite/outer-app-invite-modal.component';
import { User } from '../../services/user/user';
import { UserService } from '../../services/user/user.service';
import { ViewUserProfileModalComponent } from '../components/profile/view-user-profile/view-user-profile-modal.component';

// Central chat component
@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
    // HTML Element Refs
    @ViewChild('messageInput')
    messageInput: ElementRef;

    // Window Listeners (for notifications)
    isWindowFocused: boolean;
    @HostListener('window:focus', ['$event'])
    onFocus(event: FocusEvent): void {
        this.titleService.setTitle('Prate');
        this.isWindowFocused = true;

    }

    @HostListener('window:blur', ['$event'])
    onBlur(event: FocusEvent): void {
        this.isWindowFocused = false;
    }

    // Subs
    loadingRequest: Observable<User>;
    userSettingsChangedSub: Subscription;
    avatarChangedSub: Subscription;

    partnerFoundSub: Subscription;
    messageReceivedSub: Subscription;

    outerAppInviteReceivedSub: Subscription;
    outerAppInviteAcceptedSub: Subscription;
    outerAppInviteCanceledSub: Subscription;
    toggledOuterAppFunctionSub: Subscription;

    userDoneTypingSub: Subscription;
    isPartnerTypingSub: Subscription;
    partnerDisconnectSub: Subscription;
    matchingErrorSub: Subscription;

    // Data Stores
    matching: boolean = false;
    user: User;
    partner: User = null;
    chatMessages: ChatMessage[] = [];

    // UI
    // Overlay show/hide
    matchFoundAnimation: boolean = false;
    matchedWithOverlay: boolean = false;
    chatFinishedOverlay: boolean = false;

    // Chat UI
    autoScroll: boolean = true;
    userIsTyping: boolean = false;
    partnerIsTyping: boolean = false;
    hideBubbles: boolean = false;

    // Chat timers
    chatTimerInterval: number;
    inactivityTimer: number = 0;
    chatTimer: number = 0;

    // Post-chat messages
    partnerLeftName: string;
    leaveMessage: string;
    statusMessage: string;
    expMessage: string;
    rankUpMessage: string;

    // App Invite
    inviteLink: string;
    outerAppInviteModal: NgbModalRef;
    // YouTube
    ytUrl: string;
    ytPlayState: boolean = true;
    ytMuteState: boolean = false;
    hideYtInvControls: boolean = true;
    // Games
    gameUrl: string;
    gameType: string;
    gameAccepted: boolean = false;
    hideGames: boolean = true;

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

    // Friendlist
    friendsShown: boolean = false;

    // Forms
    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', [Validators.maxLength(500), Validators.minLength(1), Validators.required]),
    });

    constructor(private userService: UserService, private chatService: ChatService, private levelService: LevelService, private router: Router, private titleService: Title,
        private modal: NgbModal) {
    }

    ngOnInit(): void {
        this.titleService.setTitle('Prate');
        
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            // set user
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(res.experience);

            // set listeners
            this.userSettingsChangedSub = this.userService.userSettingsChanged.subscribe(() => this.getUser());
            this.avatarChangedSub = this.userService.avatarChanged.subscribe(avatar => this.user.avatar = avatar);

            this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.matchFound(partner));
            this.messageReceivedSub = this.chatService.messageReceived.subscribe(msgObj => this.messageReceived(msgObj));

            this.outerAppInviteReceivedSub = this.chatService.outerAppInviteReceived.subscribe(msgObj => this.outerAppInviteReceived(msgObj));
            this.outerAppInviteAcceptedSub = this.chatService.outerAppInviteAccepted.subscribe(msgObj => this.outerAppInviteAccepted(msgObj));
            this.outerAppInviteCanceledSub = this.chatService.outerAppInviteCanceled.subscribe(() => this.outerAppInviteCanceled());
            this.toggledOuterAppFunctionSub = this.chatService.toggledOuterAppFunction.subscribe(msgObj => this.toggledOuterAppFunction(msgObj.outerApp, msgObj.activity, false));

            this.isPartnerTypingSub = this.chatService.isPartnerTyping.subscribe(typingObj => this.isPartnerTyping(typingObj));
            this.partnerDisconnectSub = this.chatService.partnerDisconnected.subscribe(() => this.partnerDisconnected());
            this.matchingErrorSub = this.chatService.matchingError.subscribe(err => this.matchError(err));

            // timeout because of dark styling needing a user obj present (see html)
            setTimeout(() => {
                this.listenAndEmitDoneTyping();
            }, 500);

            // if page is refreshed or browser is closed, disconnect the user
            window.onbeforeunload = () => {
                this.disconnect();
                return null;
            };

            // back button is hit
            window.onpopstate = () => {
                this.disconnect();
                return null;
            };

            // if user drops internet
            window.onoffline = () => {
                this.disconnect();
                return null;
            };

            this.loadingRequest = null;
        });
    }

    ngOnDestroy(): void {
        this.userSettingsChangedSub.unsubscribe();
        this.avatarChangedSub.unsubscribe();
        this.partnerFoundSub.unsubscribe();
        this.messageReceivedSub.unsubscribe();
        this.outerAppInviteReceivedSub.unsubscribe();
        this.outerAppInviteAcceptedSub.unsubscribe();
        this.outerAppInviteCanceledSub.unsubscribe();
        this.toggledOuterAppFunctionSub.unsubscribe();
        this.userDoneTypingSub.unsubscribe();
        this.isPartnerTypingSub.unsubscribe();
        this.partnerDisconnectSub.unsubscribe();

        clearTimeout(this.chatTimerInterval);
    }

    // -- General Purpose Functions --
    getUser(): void {
        if (this.loadingRequest) {
            return
        }

        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(res.experience);
        });
    }

    openViewUserProfileModal(msgType: string, userId: string, partnerId: string): void {
        let id = msgType === 'sent' ? userId : partnerId;

        const modalRef = this.modal.open(ViewUserProfileModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.userId = id;
    }

    sendNotification(windowTitle: string, soundFile: string) {
        this.titleService.setTitle(windowTitle);

        if (this.user.sounds) {
            let audio = new Audio();
            audio.src = "../../assets/sounds/" + soundFile;
            audio.load();
            audio.play();
        }
    }

    toggleBubbles(): void {
        this.hideBubbles = !this.hideBubbles;

        // wait for html to render and return to bottom if bubbles shown
        if (!this.hideBubbles) {
            setTimeout(() => {
                this.scrollToChatBottom();
            }, 200);
        }
    }

    clearInactivity() {
        this.inactivityTimer = 0;
        this.statusMessage = null;
    }

    clearPartnerAndEndChat() {
        this.partner = null;
        this.statusMessage = null;
        this.partnerIsTyping = false;
        this.chatMessages = [];
        this.matchedWithOverlay = false;
        this.chatFinishedOverlay = true;
        this.closeApps();
    }

    closeApps() {
        this.gameUrl = null;
        this.ytUrl = null;
        this.inviteLink = null;
        this.ytPlayState = true;
        this.ytMuteState = false;
        this.hideYtInvControls = true;
        this.hideBubbles = false;
        this.gameAccepted = false;
        this.gameType = null;
    }

    // -- Matching --
    searchForMatch(): void {
        this.matching = true;
        this.statusMessage = null;
        this.chatService.intiateMatching(this.user);
    }

    cancelMatching(): void {
        this.chatService.disconnect();
        this.matching = false;
    }

    // if user is already matched/matching or auth failure
    matchError(err: string): void {
        this.matching = false;
        this.statusMessage = err;
    }

    matchFound(partner: User): void {
        if (!this.isWindowFocused) {
            this.sendNotification('Match found!', 'match-found.mp3');
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

    disconnect(): void {
        if (this.partner) {
            this.chatService.disconnect();
            this.partnerLeftName = null;
            this.leaveMessage = 'You left the chat';
            this.clearPartnerAndEndChat();
            this.stopTimerAndGiveExp();
        }
    }

    partnerDisconnected(): void {
        if (!this.isWindowFocused) {
            this.sendNotification('Match left!', 'match-left.mp3')
        }

        this.chatService.disconnect();
        this.partnerLeftName = this.partner.name;
        this.leaveMessage = 'has left the chat';
        this.clearPartnerAndEndChat();
        this.stopTimerAndGiveExp();
    }

    // --- Chatting ---
    sendMessage(): void {
        if (!this.messageForm.valid || !this.partner) {
            return;
        }
        
        const previewImg = this.imagify(this.messageForm.value.message);

        const msgObj: ChatMessage = {
            sender: this.user.name,
            receiver: this.partner.clientId,
            message: this.messageForm.value.message,
            datetime: moment().format('hh:mm a'),
            type: 'sent',
            previewImg: previewImg
        };

        this.chatService.sendMessage(msgObj);

        msgObj.message = this.linkify(msgObj.message);
        msgObj.message = this.emojify(msgObj.message);

        this.chatMessages.push(msgObj);

        this.clearInactivity();
        this.messageForm.reset();
    }

    messageReceived(msgObj: ChatMessage): void {
        if (!this.isWindowFocused || (this.isWindowFocused && this.hideBubbles)) {
            this.sendNotification('New Message', 'notif.mp3');
        }

        console.log(msgObj.previewImg)
        
        msgObj.message = this.linkify(msgObj.message);
        msgObj.message = this.emojify(msgObj.message);

        this.chatMessages.push(msgObj);
    }

    emitIsTyping(): void {
        if (!this.partner || this.userIsTyping) {
            return;
        }

        this.userIsTyping = true;
        this.chatService.userIsTyping(true, this.partner);
    }

    listenAndEmitDoneTyping(): void {
        const input = document.getElementById('messageInput');
        const event = fromEvent(input, 'input').pipe(map(i => i.currentTarget['value']));
        const debouncedInput = event.pipe(debounceTime(500));

        this.userDoneTypingSub = debouncedInput.subscribe(val => {
            if (this.partner) {
                this.userIsTyping = false;
                this.chatService.userIsTyping(false, this.partner);
            }
        });
    }

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

    // --- Time and Exp ---
    accumulateTime(): void {
        this.chatTimerInterval = window.setTimeout(() => {
            this.inactivityTimer = this.inactivityTimer + 10;

            if (this.inactivityTimer >= 600) {
                this.statusMessage = 'Inactivity detected';
            } else {
                this.chatTimer = this.chatTimer + 10;
            }

            this.accumulateTime();
        }, 10000);
    }

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

    // -- Message Formatting --
    insertEmojiCodeInMsg(code: string): void {
        let message = this.messageForm.value.message;
        if (!message) { message = ''; }

        this.messageForm.value.message = this.messageForm.controls.message.setValue(message + code);
        this.hideEmojis = true;
        this.messageInput.nativeElement.focus();
    }

    emojify(plainTextMessage: string): string {
        let newMessage = plainTextMessage;

        for (let i = 0; i < this.emojis.length; i++) {
            let emojiString = this.emojis[i].code;
            let emojiRegex = new RegExp(emojiString, 'g');

            newMessage = newMessage.replace(emojiRegex, '<img src="../../assets/images/emojis/' + this.emojis[i].img + '" height="18" width="18" />');
        }

        return newMessage;
    }

    linkify(plainTextMessage: string): string {
        let urlRegex = /((http(s)?(\:\/\/))+(www\.)?([\w\-\.\/])*(\.[a-zA-Z]{2,3}\/?))[^\s\b\n|]*[^.,;:\?\!\@\^\$ -]/gi;
        return plainTextMessage.replace(urlRegex, url => {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });
    }

    imagify(plainTextMessage: string): string {
        let imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/gi;

        const imgUrlArray = plainTextMessage.match(imageRegex);

        if (!imgUrlArray) {
            return null;
        }

        return imgUrlArray[0];
    }

    // --- Chat Scroll Functionality ---
    scrollToChatBottom(): void {
        let element = document.getElementById('chatMessages');

        element.scrollTop = element.scrollHeight;
    }

    // if chat is scrolled, check if user is at the bottom, if not, allow for free scrolling
    chatScrolled(): void {
        let element = document.getElementById('chatMessages');
        let atBottom = (element.scrollTop + element.offsetHeight + 100) >= element.scrollHeight;
        if (atBottom) {
            this.autoScroll = true;
        } else {
            this.autoScroll = false;
        }
    }

    // If user is at the bottom, auto scroll chat with messages sent/received
    checkForAutoScroll(): void {
        let element = document.getElementById('chatMessages');

        if (this.autoScroll) {
            element.scrollTop = element.scrollHeight;
        }
    }

    // -- App Invites --
    sendOuterAppInvite(app: string): void {
        if (this.inviteLink.length > 1000 || !this.inviteLink || !this.partner) {
            return;
        }

        if (app === 'yt') {
            const ytUrlRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/g;
            if (!ytUrlRegex.test(this.inviteLink)) {
                this.inviteLink = 'Invalid link';
                return;
            }

            this.hideYtInvControls = true;
        }

        this.clearInactivity();
        this.chatService.sendOuterAppInvite(this.partner, this.user, app, this.inviteLink);

        this.outerAppInviteModal = this.modal.open(OuterAppInviteModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        this.outerAppInviteModal.componentInstance.type = 'sent';

        this.outerAppInviteModal.result.then(res => {
            if (res === 'cancel') {
                this.chatService.outerAppInviteCancel(this.partner, this.user, app);
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

    // shared functions - called by socket emitted by partner and by this component
    outerAppInviteAccepted(invInfo: OuterAppInfo): void {
        if (this.outerAppInviteModal) {
            this.outerAppInviteModal.close();
        }

        if (invInfo.outerApp === 'yt') {
            this.ytUrl = invInfo.outerAppLink ? invInfo.outerAppLink : this.inviteLink;
        }

        if (invInfo.outerApp === 'gartic' || invInfo.outerApp === 'chess' || invInfo.outerApp === 'tictactoe') {
            if (invInfo.outerAppLink) {
                this.gameUrl = invInfo.outerAppLink;
            }

            this.gameType = invInfo.outerApp;
            this.gameAccepted = true;
        }
    }

    outerAppInviteCanceled(): void {
        this.outerAppInviteModal.close();
        this.closeApps();
    }

    toggledOuterAppFunction(outerApp: string, activity: string, beingSent: boolean): void {
        if (activity === 'close') {
            this.closeApps();
        }

        if (outerApp === 'yt') {
            if (activity === 'playpause') {
                this.ytPlayState = !this.ytPlayState;
            }
            else if (activity === 'muteunmute') {
                this.ytMuteState = !this.ytMuteState;
            }
        }

        if (beingSent) {
            this.chatService.toggleOuterAppFunction(this.partner, this.user, outerApp, activity);
        }
    }
    //

    // opens iframe in html, for user to start setting up an invite url
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

    // function called from child component (iframe) - sends app invite to selected game
    sendGameInvite(gameInfo: { url: string; gameType: string; }): void {
        this.inviteLink = gameInfo.url;
        this.sendOuterAppInvite(gameInfo.gameType);
    }

    // function called from child component (iframe) - goes into app activity toggle function which closes the game for user and partner
    gameSessionClose(): void {
        this.toggledOuterAppFunction(this.gameType, 'close', true);
    }

    // -- Friends --
    toggleFriendlist(event): void {
        this.friendsShown = event;
    }
}
