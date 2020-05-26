// Angular
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// Page for showing those who work on this project
@Component({
    selector: 'prt-developers',
    templateUrl: './developers.component.html',
    styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {
    constructor(private titleService: Title) { }

    ngOnInit() :void {
        this.titleService.setTitle('Prate | The Team');
    }
}
