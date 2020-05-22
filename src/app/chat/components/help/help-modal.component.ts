// Angular
import { Component } from '@angular/core';

// NPM
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-help-modal',
    templateUrl: './help-modal.component.html',
    styleUrls: ['./help-modal.component.css']
})
export class HelpModalComponent {
    selectedTab: string = 'basics';

    ranks: any = [
        { rank: 'Pebble', img: '../../../assets/images/badges/pebble.png', level: '1', rewards: 'N/A' },
        { rank: 'Coal', img: '../../../assets/images/badges/coal.png', level: '5', rewards: 'N/A' },
        { rank: 'Bronze', img: '../../../assets/images/badges/bronze.png', level: '10', rewards: 'N/A' },
        { rank: 'Silver', img: '../../../assets/images/badges/silver.png', level: '20', rewards: 'N/A' },
        { rank: 'Gold', img: '../../../assets/images/badges/gold.png', level: '30', rewards: 'N/A' },
        { rank: 'Platinum', img: '../../../assets/images/badges/platinum.png', level: '40', rewards: 'N/A' },
        { rank: 'Sapphire', img: '../../../assets/images/badges/sapphire.png', level: '50', rewards: 'N/A' },
        { rank: 'Emerald', img: '../../../assets/images/badges/emerald.png', level: '60', rewards: 'N/A' },
        { rank: 'Amethyst', img: '../../../assets/images/badges/amethyst.png', level: '70', rewards: 'N/A' },
        { rank: 'Ruby', img: '../../../assets/images/badges/ruby.png', level: '80', rewards: 'N/A' },
        { rank: 'Diamond', img: '../../../assets/images/badges/diamond.png', level: '90', rewards: 'N/A' }, 
        { rank: 'Prismatic', img: '../../../assets/images/badges/prismatic.png', level: '100', rewards: 'N/A' }
    ];

    constructor(public activeModal: NgbActiveModal) { }
}
