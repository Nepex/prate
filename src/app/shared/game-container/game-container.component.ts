import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'prt-game-container',
    templateUrl: './game-container.component.html',
    styleUrls: ['./game-container.component.css']
})
export class GameContainerComponent {
    // Component Inputs
    @Input() gameType: string;
    @Input() gameUrl: string;
    @Input() gameAccepted: boolean;

    // Component Outputs
    @Output() canceled: EventEmitter<boolean> = new EventEmitter();
    @Output() inviteSent: EventEmitter<{ url: string; gameType: string; }> = new EventEmitter();
    @Output() gameClosed: EventEmitter<boolean> = new EventEmitter();

    // UI
    inviteLink: string;

    constructor() { }

    cancel(): void {
        this.canceled.emit(true);
    }

    sendInvite(url: string): void {
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

    closeGame(): void {
        this.gameClosed.emit(true);
    }
}
