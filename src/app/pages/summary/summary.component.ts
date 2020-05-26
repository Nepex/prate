// Angular
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// Why Prate? page, shows basic app info
@Component({
    selector: 'prt-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
    fadeMatchIcon: boolean = false;
    fadeCustomIcon: boolean = false;
    fadeProgIcon: boolean = false;

    constructor(private titleService: Title) {}

    ngOnInit(): void {
        this.titleService.setTitle('Prate | Summary');
    }
}
