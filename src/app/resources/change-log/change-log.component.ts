import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-change-log',
    templateUrl: './change-log.component.html',
    styleUrls: ['./change-log.component.css']
})
export class ChangeLogComponent implements OnInit {
    updates;

    constructor() { }

    ngOnInit(): void {
        this.updates = [
            {
                title: 'v0.0.3-alpha',
                date: 'April 24, 2019',
                items: [
                    'Font color/face changing, Bubble color changing',
                    'User setting editting updating properly'
                ]
            },
            {
                title: 'v0.0.2-alpha',
                date: 'April 13, 2019',
                items: [
                    'Some bug fixes',
                ]
            },
            {
                title: 'v0.0.1-alpha',
                date: 'April 12, 2019',
                items: [
                    'Footer created',
                    'Change log page created',
                    'Terms of Use added',
                    'Privacy Policy added',
                    'Developers page created',
                    'Why Prate? page created',
                    'Download page created'
                ]
            }
        ]
    }
}
