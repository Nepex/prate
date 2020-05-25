// Angular
import { Component, OnInit } from '@angular/core';

// App
import { Update } from 'src/app/services/generic/update';

// Version management page that displays updates
@Component({
    selector: 'prt-change-log',
    templateUrl: './change-log.component.html',
    styleUrls: ['./change-log.component.css']
})
export class ChangeLogComponent implements OnInit {
    // UI
    updates: Update[];
    page: number = 1;
    pageSize: number = 10;

    constructor() { }

    ngOnInit(): void {
        this.updates = [
            {
                title: 'v1.0.17-beta',
                date: 'May 21, 2020',
                items: [
                    'Inactivity rework',
                    'Several performance boosts and cleanups'
                ]
            },
            {
                title: 'v1.0.16-alpha',
                date: 'May 21, 2020',
                items: [
                    'Several bug fixes',
                    'Revised Why Prate? page'
                ]
            },
            {
                title: 'v1.0.15-alpha',
                date: 'May 18, 2020',
                items: [
                    'Games added',
                    'Dark theme touchups',
                    'Bug fixes'
                ]
            },
            {
                title: 'v1.0.14-alpha',
                date: 'May 17, 2020',
                items: [
                    'Toggle chat bubbles while sharing youtube videos',
                    'Custom interests',
                    'Custom bio and match profile view',
                    'Match leave and found notifications',
                    'Misc styling and bug fixes'
                ]
            },
            {
                title: 'v1.0.13-alpha',
                date: 'May 15, 2020',
                items: [
                    'Sound toggle option',
                    'Dark theme option',
                    'Enforce interests option',
                    'Avatar overhaul'
                ]
            },
            {
                title: 'v1.0.12-alpha',
                date: 'May 14, 2020',
                items: [
                    'YouTube Video Share',
                    'Attributions added',
                    'Misc quality of life and bug fixes'
                ]
            },
            {
                title: 'v1.0.11-alpha',
                date: 'May 10, 2020',
                items: [
                    'Opensource Avatars added',
                    'Emojis implemented',
                    'Back to Bottom button added',
                    'Notifications added',
                    'Misc bug fixes'
                ]
            },
            {
                title: 'v1.0.10-alpha',
                date: 'May 9, 2020',
                items: [
                    'Help section added',
                    'Bug Report added'
                ]
            },
            {
                title: 'v1.0.9-alpha',
                date: 'May 7, 2020',
                items: [
                    'Level badges added and levels fully mapped',
                    'Avatars now show while chatting',
                    'New options: Show Avatar and Chat Bubble Positions',
                    'Fonts swapped to open source'
                ]
            },
            {
                title: 'v1.0.8-alpha',
                date: 'May 5, 2020',
                items: [
                    'Home page no longer redirects to chat if logged in',
                    'Chat bubble preview option added to user profile edit',
                    'New fonts added'
                ]
            },
            {
                title: 'v1.0.7-alpha',
                date: 'May 4, 2020',
                items: [
                    'Misc bug fixes'
                ]
            },
            {
                title: 'v1.0.6-alpha',
                date: 'May 1, 2019',
                items: [
                    'Avatar changing'
                ]
            },
            {
                title: 'v1.0.5-alpha',
                date: 'April 30, 2019',
                items: [
                    'Level ups, ranks, and experience gaining implemented'
                ]
            },
            {
                title: 'v1.0.4-alpha',
                date: 'April 25, 2019',
                items: [
                    'Interest based matching implemented'
                ]
            },
            {
                title: 'v1.0.3-alpha',
                date: 'April 24, 2019',
                items: [
                    'Font color/face changing, Bubble color changing',
                    'User setting editting updating properly'
                ]
            },
            {
                title: 'v1.0.2-alpha',
                date: 'April 13, 2019',
                items: [
                    'Some bug fixes',
                ]
            },
            {
                title: 'v1.0.1-alpha',
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
