import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'prt-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    isCollapsed = true;

    constructor(config: NgbDropdownConfig) { 
        config.placement = 'bottom-left';
    }

    ngOnInit(): void { }
}
