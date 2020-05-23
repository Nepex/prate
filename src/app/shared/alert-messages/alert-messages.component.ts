import { Component, Input } from '@angular/core';

@Component({
    selector: 'prt-alert-messages',
    template:
    `<div class="text-center" style="padding-top: 10px; padding-bottom: 10px;" *ngFor="let m of messages">
        <div class="{{ m.type }}" *ngIf="m">
            
            <div style="position: relative; margin-left: auto; margin-right: auto;">
            <p style="position: absolute;">
                <i class="fa fa-times" style="cursor: pointer; position: absolute; top: -9px; left: 179px; font-size: 11px;" (click)="close(m)"></i>
            </p>
                {{ m.message }}
            </div>

        </div>        
    </div>`,
    styleUrls: ['./alert-messages.component.css']
})
export class AlertMessagesComponent {
    // UI
    @Input() messages: AlertMessage[];

    close(m: AlertMessage): void {
        for (let i = 0; i < this.messages.length; i++) {
            if (m.message === this.messages[i].message) {
                this.messages.splice(i, 1);
            }
        }
    }
}

export class AlertMessage {
    message: string;
    type: string;
}
