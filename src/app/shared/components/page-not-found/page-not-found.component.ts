// Angular
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// Page for 404 error
@Component({
    selector: 'prt-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
    constructor(private titleService: Title) { }

    ngOnInit(): void {
        this.titleService.setTitle('Prate | 404 Error');
    }
}
