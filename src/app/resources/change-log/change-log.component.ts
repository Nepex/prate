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
                title: 'v0.0.9-alpha',
                date: 'May 7, 2020',
                items: [
                    'Level badges added and levels fully mapped',
                    'Avatars now show while chatting',
                    'New options: Show Avatar and Chat Bubble Positions',
                    'Fonts swapped to open source'
                ]
            },
            {
                title: 'v0.0.8-alpha',
                date: 'May 5, 2020',
                items: [
                    'Home page no longer redirects to chat if logged in',
                    'Chat bubble preview option added to user profile edit',
                    'New fonts added'
                ]
            },
            {
                title: 'v0.0.7-alpha',
                date: 'May 4, 2020',
                items: [
                    'Misc bug fixes'
                ]
            },
            {
                title: 'v0.0.6-alpha',
                date: 'May 1, 2019',
                items: [
                    'Avatar changing'
                ]
            },
            {
                title: 'v0.0.5-alpha',
                date: 'April 30, 2019',
                items: [
                    'Level ups, ranks, and experience gaining implemented'
                ]
            },
            {
                title: 'v0.0.4-alpha',
                date: 'April 25, 2019',
                items: [
                    'Interest based matching implemented'
                ]
            },
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
