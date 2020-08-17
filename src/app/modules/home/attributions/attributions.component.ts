// Angular
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// Attribution page for giving credit to asset creators
@Component({
    selector: 'prt-attributions',
    templateUrl: './attributions.component.html',
    styleUrls: ['./attributions.component.scss']
})
export class AttributionsComponent implements OnInit {
    constructor(private titleService: Title) { }

    ngOnInit(): void {
        this.titleService.setTitle('Prate | Attributions');
    }
}
