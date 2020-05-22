// Angular
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'prt-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    fadeMatchIcon: boolean = false;
    fadeCustomIcon: boolean = false;
    fadeProgIcon: boolean = false;

    constructor() {
    }

    ngOnInit(): void {}
}
