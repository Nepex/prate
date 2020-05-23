// Angular
import { Component } from '@angular/core';

// Why Prate? page, shows basic app info
@Component({
    selector: 'prt-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent {
    fadeMatchIcon: boolean = false;
    fadeCustomIcon: boolean = false;
    fadeProgIcon: boolean = false;

    constructor() {}
}
