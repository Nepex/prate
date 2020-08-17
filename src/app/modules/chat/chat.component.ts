// Angular
import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, debounceTime } from 'rxjs/operators';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { trigger, style, transition, animate } from '@angular/animations';

// NPM
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// App
import { User, ChatMessage, FriendMessageData, IsTyping, OuterAppInfo, FriendRequest } from '../../shared/models';
import { ViewUserProfileModalComponent } from '../profile/view-user-profile/view-user-profile-modal.component';
import { MessageDisplayModalComponent } from '../../shared/components/message-display-modal/message-display-modal.component';
import { OuterAppInviteModalComponent } from './modals/invite-modal/outer-app-invite-modal.component';
import { FriendRequestsModalComponent } from '../friends/friend-requests-modal/friend-requests-modal.component';
import { UserService, ChatService, LevelService, FriendService } from 'src/app/core/services';


// Central chat component
@Component({
    selector: 'prt-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: '0' }),
                animate('300ms ease-in', style({ opacity: '1.0' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ opacity: '0' }))
            ])
        ])
    ]
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

    friendRequestReceivedSub: Subscription;
    friendRequestHandledSub: Subscription;
    acceptedFriendRequestSentSub: Subscription;
    acceptedFriendRequestReceivedSub: Subscription;
    friendRemovalSentSub: Subscription;
    friendRemovalReceivedSub: Subscription;
    friendDataChangeReceivedSub: Subscription;

    matchInviteReceivedSub: Subscription;
    matchInviteAcceptedSub: Subscription;
    matchInviteCanceledSub: Subscription;

    friendMessageSentSub: Subscription;
    friendMessageReceivedSub: Subscription;
    isFriendTypingSub: Subscription;

    outerAppInviteReceivedSub: Subscription;
    outerAppInviteAcceptedSub: Subscription;
    outerAppInviteCanceledSub: Subscription;
    toggledOuterAppFunctionSub: Subscription;

    userDoneTypingSub: Subscription;
    isPartnerTypingSub: Subscription;
    partnerDisconnectSub: Subscription;
    matchingErrorSub: Subscription;
    webSocketDroppedSub: Subscription;

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
    messageDisplayModalRef: NgbModalRef;

    // Chat UI
    notifications: any = [];
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
        { code: ':joy:', img: 'smile-eyesclosed.png' },
        { code: ':yay:', img: 'smile-open.png' },
        { code: ':silly:', img: 'smile-tongue.png' },
        { code: ':cool:', img: 'cool.png' },
        { code: ':lol:', img: 'laugh.png' },
        { code: ':rofl:', img: 'laugh-crying.png' },
        { code: ':happycry:', img: 'crying-happy.png' },

        { code: ':sad:', img: 'frown.png' },
        { code: ':disappointed:', img: 'frown-angry.png' },
        { code: ':exhausted:', img: 'frown-exhausted.png' },
        { code: ':frown:', img: 'frown-sad.png' },
        { code: ':cry:', img: 'crying-sad.png' },

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
    friendMessageData: FriendMessageData[] = [];
    friendsWithUnreadMessages: string[] = [];
    matchInviteModal: NgbModalRef;

    // Forms
    messageForm: FormGroup = new FormGroup({
        message: new FormControl('', [Validators.maxLength(500), Validators.minLength(1), Validators.required]),
    });

    constructor(private userService: UserService, private chatService: ChatService, private levelService: LevelService, private router: Router, private titleService: Title,
        private modal: NgbModal, private friendService: FriendService) {
    }

    ngOnInit(): void {
        this.titleService.setTitle('Prate');

        // unable to set on css, don't allow page growth when friend message is dragged off
        document.body.style.overflow = 'hidden';

        this.loadingRequest = this.userService.getUser();


        this.loadingRequest.subscribe(res => {
            // set user
            this.user = res;
            this.user.levelInfo = this.levelService.getLevelInfo(res.experience);
            this.user.status = 'online';
            this.friendService.connectAndStoreUser(this.user);

            // set listeners
            // SETTINGS
            this.userSettingsChangedSub = this.userService.userSettingsChanged.subscribe(() => this.getUser());
            this.avatarChangedSub = this.userService.avatarChanged.subscribe(avatar => this.user.avatar = avatar);

            // FRIENDS
            this.friendRequestReceivedSub = this.friendService.friendRequestReceived.subscribe(msgObj => this.friendRequestReceived(msgObj));
            this.friendRequestHandledSub = this.friendService.friendRequestHandled.subscribe(id => this.user.friend_requests.splice(this.user.friend_requests.indexOf(id), 1));

            this.acceptedFriendRequestSentSub = this.friendService.acceptedFriendRequestSent.subscribe(id => this.acceptedFriendRequestSent(id));
            this.acceptedFriendRequestReceivedSub = this.friendService.acceptedFriendRequestReceived.subscribe(msgObj => this.acceptedFriendRequestReceived(msgObj));

            this.friendRemovalSentSub = this.friendService.friendRemovalSent.subscribe(id => this.friendRemovalSent(id));
            this.friendRemovalReceivedSub = this.friendService.friendRemovalReceived.subscribe(msgObj => this.friendRemovalSent(msgObj.id));

            this.friendDataChangeReceivedSub = this.friendService.friendDataChangeReceived.subscribe(msgObj => this.friendStatusChange(msgObj));

            this.isFriendTypingSub = this.friendService.isFriendTyping.subscribe(msgObj => this.isFriendTyping(msgObj));
            this.friendMessageSentSub = this.friendService.friendMessageSent.subscribe(msgObj => this.friendMessageSent(msgObj));
            this.friendMessageReceivedSub = this.friendService.friendMessageReceived.subscribe(msgObj => this.friendMessageReceived(msgObj));

            this.matchInviteReceivedSub = this.friendService.matchInviteReceived.subscribe(msgObj => this.matchInviteReceived(msgObj));
            this.matchInviteAcceptedSub = this.friendService.matchInviteAccepted.subscribe(msgObj => this.matchInviteAccepted(msgObj));
            this.matchInviteCanceledSub = this.friendService.matchInviteCanceled.subscribe(() => this.matchInviteCanceled());

            // APPS
            this.outerAppInviteReceivedSub = this.chatService.outerAppInviteReceived.subscribe(msgObj => this.outerAppInviteReceived(msgObj));
            this.outerAppInviteAcceptedSub = this.chatService.outerAppInviteAccepted.subscribe(msgObj => this.outerAppInviteAccepted(msgObj));
            this.outerAppInviteCanceledSub = this.chatService.outerAppInviteCanceled.subscribe(() => this.outerAppInviteCanceled());
            this.toggledOuterAppFunctionSub = this.chatService.toggledOuterAppFunction.subscribe(msgObj => this.toggledOuterAppFunction(msgObj.outerApp, msgObj.activity, false));

            // PARTNER ACTIVITY
            this.partnerFoundSub = this.chatService.partner.subscribe(partner => this.matchFound(partner));
            this.partnerDisconnectSub = this.chatService.partnerDisconnected.subscribe(() => this.partnerDisconnected());
            this.isPartnerTypingSub = this.chatService.isPartnerTyping.subscribe(typingObj => this.isPartnerTyping(typingObj));
            this.messageReceivedSub = this.chatService.messageReceived.subscribe(msgObj => this.messageReceived(msgObj));
            this.matchingErrorSub = this.chatService.matchingError.subscribe(err => this.matchError(err));

            this.webSocketDroppedSub = this.chatService.webSocketDropped.subscribe(err => this.alertWebSocketDropped());


            // timeout because of dark styling needing a user obj present (see html)
            setTimeout(() => {
                this.listenAndEmitDoneTyping();
            }, 500);

            // if page is refreshed or browser is closed, disconnect the user
            window.onbeforeunload = () => {
                this.matching = false;
                this.disconnectFromMatch();
                this.disconnectFromFriends();
                return null;
            };

            // back button is hit
            window.onpopstate = () => {
                this.matching = false;
                this.disconnectFromMatch();
                this.disconnectFromFriends();
                return null;
            };

            // if user drops internet
            window.onoffline = () => {
                this.matching = false;
                this.disconnectFromMatch();
                this.disconnectFromFriends();
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
        this.friendRequestReceivedSub.unsubscribe();
        this.acceptedFriendRequestReceivedSub.unsubscribe();
        this.acceptedFriendRequestSentSub.unsubscribe();
        this.friendRequestHandledSub.unsubscribe();
        this.friendRemovalReceivedSub.unsubscribe();
        this.friendRemovalSentSub.unsubscribe();
        this.isFriendTypingSub.unsubscribe()
        this.friendMessageSentSub.unsubscribe();
        this.friendMessageReceivedSub.unsubscribe();
        this.matchInviteReceivedSub.unsubscribe();
        this.matchInviteAcceptedSub.unsubscribe();
        this.matchInviteCanceledSub.unsubscribe();
        this.webSocketDroppedSub.unsubscribe();

        clearTimeout(this.chatTimerInterval);
    }

    // -- General Purpose Functions --
    getUser(): void {
        if (this.loadingRequest) {
            return
        }

        let status = this.user.status;
        this.loadingRequest = this.userService.getUser();

        this.loadingRequest.subscribe(res => {
            this.loadingRequest = null;
            this.user = res;
            this.user.status = status;
            this.user.levelInfo = this.levelService.getLevelInfo(res.experience);
        });
    }

    openViewUserProfileModal(msgType: string, userId: string, partnerId: string): void {
        let id = msgType === 'sent' ? userId : partnerId;

        const modalRef = this.modal.open(ViewUserProfileModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.userBeingViewedId = id;
        modalRef.componentInstance.currentUser = this.user;
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

    alertWebSocketDropped() {
        if (this.messageDisplayModalRef) {
            return;
        }

        this.messageDisplayModalRef = this.modal.open(MessageDisplayModalComponent, { centered: true, size: 'sm', backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });

        this.messageDisplayModalRef.componentInstance.message = "You have lost connection, Please refresh the page.";
        this.messageDisplayModalRef.componentInstance.showClose = false;
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
        this.changeUserStatus('matching');
        this.matching = true;
        this.statusMessage = null;
        this.chatService.intiateMatching(this.user, null);
    }

    cancelMatching(): void {
        this.changeUserStatus('online');
        this.chatService.disconnect();
        this.matching = false;
    }

    // if user is already matched/matching or auth failure
    matchError(err: string): void {
        this.changeUserStatus('online');
        this.matching = false;
        this.statusMessage = err;
    }

    matchFound(partner: User): void {
        if (!this.isWindowFocused) {
            this.sendNotification('Match found!', 'match-found.mp3');
        }

        // close friend windows
        this.friendMessageData.forEach(friend => {
            friend.isOpen = false;
            friend.isFocused = false;
        });

        this.changeUserStatus('matched');
        this.matching = false;
        this.partner = partner;
        this.matchFoundAnimation = true;

        setTimeout(() => {
            this.matchFoundAnimation = false;
            this.matchedWithOverlay = true;
        }, 1100);

        this.accumulateTime();
    }

    disconnectFromMatch(): void {
        if (this.partner) {
            this.chatService.disconnect();
            this.changeUserStatus('online');
            this.partnerLeftName = null;
            this.leaveMessage = 'You left the chat';
            this.clearPartnerAndEndChat();
            this.stopTimerAndGiveExp();
        }
    }

    disconnectFromFriends() {
        this.friendService.disconnect();
    }

    partnerDisconnected(): void {
        if (!this.isWindowFocused) {
            this.sendNotification('Match left!', 'match-left.mp3')
        }

        this.chatService.disconnect();
        this.changeUserStatus('online');
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

        this.titleService.setTitle('Prate');

        const previewImg = this.imagify(this.messageForm.value.message);

        const msgObj: ChatMessage = {
            sender: this.user.name,
            receiver: this.partner.clientId,
            font_face: this.user.font_face,
            font_color: this.user.font_color,
            bubble_color: this.user.bubble_color,
            avatar: this.user.avatar,
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
    addChatFormatting(type: string): void {
        let message = this.messageForm.value.message;
        let append;
        if (!message) { message = ''; }

        if (type === 'bold') {
            append = ' <b>Text here</b>';
        } else if (type === 'italic') {
            append = ' <i>Text here</i>';
        } if (type === 'underline') {
            append = ' <u>Text here</u>';
        } if (type === 'heading') {
            append = ' <h3>Text here</h3>';
        }

        this.messageForm.value.message = this.messageForm.controls.message.setValue(message + append);
        this.hideEmojis = true;
        this.messageInput.nativeElement.focus();
    }

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
        if ((this.inviteLink && this.inviteLink.length > 1000) || !this.inviteLink || !this.partner) {
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
        if (!this.isWindowFocused) {
            this.sendNotification('Invite Received!', 'notif.mp3');
        }

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

    // Friend Messaging
    isFriendTyping(typingObj): void {
        this.friendMessageData.forEach(friendData => {
            if (friendData.id === typingObj.sender) {
                if (typingObj.isTyping) {
                    friendData.isTyping = true;
                } else {
                    friendData.isTyping = false;
                }
            }
        });
    }

    friendMessageSent(msgObj: ChatMessage) {
        msgObj.message = this.linkify(msgObj.message);
        msgObj.message = this.emojify(msgObj.message);

        this.friendMessageData.forEach(friendData => {
            if (friendData.id === msgObj.receiver) {
                friendData.messages.push(msgObj);
            }
        });
    }

    friendMessageReceived(msgObj: ChatMessage): void {
        let friendConversationExists;
        msgObj.message = this.linkify(msgObj.message);
        msgObj.message = this.emojify(msgObj.message);

        this.friendMessageData.forEach(friendData => {
            if (friendData.id === msgObj.sender) {
                friendConversationExists = true;

                friendData.messages.push(msgObj);

                if (!friendData.isFocused) {
                    friendData.unreadMessages = true;
                    this.friendsWithUnreadMessages.push(msgObj.sender);

                    // make notification clickable
                    let notif = {
                        message: `You have received a new message from ${msgObj.senderName}`, type: 'friend-message', friend: {
                            id: msgObj.sender,
                            name: msgObj.senderName,
                            avatar: msgObj.avatar,
                            status: msgObj.status
                        }
                    };

                    this.pushNotification(notif);
                }

                if (!friendData.isOpen) {
                    this.sendNotification('Prate', 'notif.mp3')
                }
            }
        });

        // pop a new window if it's the first message
        if (!friendConversationExists) {
            const body: FriendMessageData = {
                id: msgObj.sender,
                name: msgObj.senderName,
                avatar: msgObj.avatar,
                status: msgObj.status,
                isFocused: true,
                isOpen: true,
                unreadMessages: false,
                messages: [],
                isTyping: false
            };

            body.messages.push(msgObj);

            this.friendMessageData.push(body);
            this.sendNotification('Prate', 'notif.mp3')
        }

        if (!this.isWindowFocused) {
            this.titleService.setTitle(`${msgObj.senderName} sent you a message`);
        }
    }

    // Message Boxes
    friendMessageBoxOpened(user: FriendMessageData): void {
        for (let i = 0; i < this.friendMessageData.length; i++) {
            // if window / data is already present, don't create anything new
            if (user.id === this.friendMessageData[i].id) {
                this.friendMessageData[i].isOpen = true;
                this.friendMessageData[i].isFocused = true;
                this.friendMessageData[i].unreadMessages = false;
                this.removeUnreadMessageAlert(user.id);

                return;
            }
        }

        const body: FriendMessageData = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            status: user.status,
            isFocused: true,
            isOpen: true,
            unreadMessages: false,
            messages: [],
            isTyping: false
        };

        this.friendMessageData.push(body);
    }

    friendWindowFocused(user: FriendMessageData): void {
        this.friendMessageData.forEach(friendData => {
            if (friendData.id === user.id) {
                friendData.isFocused = true;
                friendData.unreadMessages = false;
                this.removeUnreadMessageAlert(user.id);
            } else {
                friendData.isFocused = false;
            }
        });
    }

    removeUnreadMessageAlert(id: string) {
        this.friendsWithUnreadMessages.forEach(unreadId => {
            if (unreadId === id) {
                this.friendsWithUnreadMessages.splice(this.friendsWithUnreadMessages.indexOf(id), 1);
            }
        });
    }

    // Friend Requests
    openFriendRequestsModal(): void {
        const modalRef = this.modal.open(FriendRequestsModalComponent, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        modalRef.componentInstance.user = this.user;
    }

    friendRequestReceived(friendRequest: FriendRequest): void {
        let notif = {
            message: `You have received a new friend request from ${friendRequest.senderName}`,
            type: 'friend-request'
        };

        this.pushNotification(notif);
        this.user.friend_requests.push(friendRequest.senderId);
    }

    acceptedFriendRequestSent(id: string) {
        this.user.friends.push(id);
    }

    acceptedFriendRequestReceived(user: User): void {
        let notif = {
            message: `${user.name} has accepted your friend request`,
            type: 'no-action'
        };

        this.pushNotification(notif);
        this.user.friends.push(user.id);
    }

    // Friend Removals
    friendRemovalSent(id) {
        this.friendsWithUnreadMessages.splice(this.friendsWithUnreadMessages.indexOf(id), 1);
        this.user.friends.splice(this.user.friends.indexOf(id, 1))

        this.friendMessageData.forEach(friend => {
            if (friend.id === id) {
                this.friendMessageData.splice(this.friendMessageData.indexOf(friend), 1)
            }
        });
    }

    friendRemovalReceived(id) {
        this.friendsWithUnreadMessages.splice(this.friendsWithUnreadMessages.indexOf(id), 1);
        this.user.friends.splice(this.user.friends.indexOf(id, 1))

        this.friendMessageData.forEach(friend => {
            if (friend.id === id) {
                this.friendMessageData.splice(this.friendMessageData.indexOf(friend), 1)
            }
        });
    }

    // Friend Statuses
    changeUserStatus(status: string) {
        this.user.status = status;
        this.friendService.sendFriendDataChange(this.user);
    }

    friendStatusChange(user: User): void {
        let notif;
        if (user.status === 'online' && user.firstConnect) {
            notif = {
                message: `${user.name} has come online`,
                type: 'no-action'
            };
        } else if (user.status === 'offline') {
            notif = {
                message: `${user.name} has went offline`,
                type: 'no-action'
            };

            this.friendMessageData.forEach(friendData => {
                if (friendData.id === user.id) {
                    this.friendMessageData.splice(this.friendMessageData.indexOf(friendData, 1));
                }
            });
        }

        this.friendMessageData.forEach(friendData => {
            if (friendData.id === user.id) {
                friendData.name = user.name;
                friendData.avatar = user.avatar;
                friendData.status = user.status;
            }
        });

        if (notif) {
            this.pushNotification(notif);
        }
    }

    // Friend Match Invites
    matchInviteReceived(invInfo: OuterAppInfo): void {
        if (!this.isWindowFocused) {
            this.sendNotification('Invite Received!', 'notif.mp3');
        }

        this.matchInviteModal = this.modal.open(OuterAppInviteModalComponent, { size: 'sm', centered: true, backdrop: 'static', keyboard: false, windowClass: 'modal-holder' });
        this.matchInviteModal.componentInstance.user = invInfo.sender;
        this.matchInviteModal.componentInstance.type = 'received';
        this.matchInviteModal.componentInstance.outerApp = invInfo.outerApp;

        this.matchInviteModal.result.then(res => {
            if (res === 'accept') {
                this.matchInviteAccepted(invInfo);
                this.friendService.matchInviteAccept(invInfo.senderId, this.user, invInfo.outerApp);
            } else if (res === 'cancel') {
                this.friendService.matchInviteCancel(invInfo.senderId, this.user, invInfo.outerApp);
            }
        });
    }

    matchInviteAccepted(invInfo: OuterAppInfo): void {
        if (this.matchInviteModal) {
            this.matchInviteModal.close();
        }

        this.chatService.intiateMatching(this.user, invInfo.senderId);
    }

    matchInviteCanceled(): void {
        if (this.matchInviteModal) {
            this.matchInviteModal.close();
        }
    }

    // Friend Notifications
    pushNotification(notif: { message: string }) {
        if (this.notifications.length === 5) {
            return;
        }

        this.notifications.push(notif);

        setTimeout(() => {
            this.notifications.splice(this.notifications.indexOf(notif), 1);
        }, 5000);
    };
}
