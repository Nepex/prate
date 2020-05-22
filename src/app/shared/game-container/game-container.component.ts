import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'prt-game-container',
    templateUrl: './game-container.component.html',
    styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent {
    @Input() gameType: string;
    @Input() gameUrl: string;
    @Input() gameAccepted: boolean;

    @Output() canceled = new EventEmitter();
    @Output() inviteSent = new EventEmitter();
    @Output() gameClosed = new EventEmitter();

    inviteLink: string;

    constructor() { }

    cancel(): void {
        this.canceled.emit(true);
    }

    sendInvite(url): void {
        let urlRegex;
        
        if (this.gameType === 'gartic') {
            urlRegex = /(^https?:\/\/gartic.io\/?.*)/i;
        } else if (this.gameType === 'chess') {
            urlRegex = /(^https?:\/\/chess.org\/?.*)/i;
        } else if (this.gameType === 'tictactoe') {
            urlRegex = /(^https?:\/\/ultimate-t3.herokuapp.com\/?.*)/i;
        }

        if (!urlRegex.test(url)) {
            this.inviteLink = 'Invalid link'
            return;
        }

        const gameInfo = {
            url: url,
            gameType: this.gameType
        }

        this.inviteSent.emit(gameInfo);
    }

    closeGame() {
        this.gameClosed.emit(true);
    }
}
