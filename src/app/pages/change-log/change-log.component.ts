// Angular
import { Component, OnInit } from '@angular/core';

// App
import { Title } from '@angular/platform-browser';
import { Update } from '../../services/generic/update';

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

    constructor(private titleService: Title) { }

    ngOnInit(): void {
        this.titleService.setTitle('Prate | Change Log');

        this.updates = [
            {
                title: 'v1.1.6-beta',
                date: 'July 18, 2020',
                items: [
                    'Desktop Executable Release',
                    'Windows (stable)',
                    'Linux (stable - missing app icon)',
                    'Mac (untested)'
                ]
            },
            {
                title: 'v1.1.5-beta',
                date: 'July 16, 2020',
                items: [
                    'Chat formatting buttons'
                ]
            },
            {
                title: 'v1.1.4-beta',
                date: 'July 16, 2020',
                items: [
                    'Guest Mode',
                    'Phone dimming disconnection alert'
                ]
            },
            {
                title: 'v1.1.3-beta',
                date: 'July 15, 2020',
                items: [
                    'QoL Changes',
                    'More fonts'
                ]
            },
            {
                title: 'v1.1.2-beta',
                date: 'July 7, 2020',
                items: [
                    'Invite to match implemented',
                    'Friends bug fixes'
                ]
            },
            {
                title: 'v1.1.1-beta',
                date: 'July 6, 2020',
                items: [
                    'Friendlist implemented'
                ]
            },
            {
                title: 'v1.0.1-beta',
                date: 'July 2, 2020',
                items: [
                    'Slight bug and styling fixes'
                ]
            },
            {
                title: 'v1.0.0-beta',
                date: 'May 21, 2020',
                items: [
                    'Inactivity rework',
                    'Several performance boosts and cleanups'
                ]
            },
            {
                title: 'v0.0.16-alpha',
                date: 'May 21, 2020',
                items: [
                    'Several bug fixes',
                    'Revised Why Prate? page'
                ]
            },
            {
                title: 'v0.0.15-alpha',
                date: 'May 18, 2020',
                items: [
                    'Games added',
                    'Dark theme touchups',
                    'Bug fixes'
                ]
            },
            {
                title: 'v0.0.14-alpha',
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
                title: 'v0.0.13-alpha',
                date: 'May 15, 2020',
                items: [
                    'Sound toggle option',
                    'Dark theme option',
                    'Enforce interests option',
                    'Avatar overhaul'
                ]
            },
            {
                title: 'v0.0.12-alpha',
                date: 'May 14, 2020',
                items: [
                    'YouTube Video Share',
                    'Attributions added',
                    'Misc quality of life and bug fixes'
                ]
            },
            {
                title: 'v0.0.11-alpha',
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
                title: 'v0.0.10-alpha',
                date: 'May 9, 2020',
                items: [
                    'Help section added',
                    'Bug Report added'
                ]
            },
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

