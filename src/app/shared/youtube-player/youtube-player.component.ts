// Angular
import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';

// Component for the chat page, displays youtube videos behind chat
@Component({
    selector: 'prt-youtube-player',
    templateUrl: './youtube-player.component.html',
    styleUrls: ['./youtube-player.component.css']
})
export class YoutubePlayerComponent implements OnInit, OnChanges {
    // Component Inputs
    @Input() videoUrl: string;
    @Input() playState: boolean;
    @Input() muteState: boolean;

    // Data Stores
    public YT: Window;

    // UI
    videoPlayer: any;
    videoId: string;
    hidePlayer: boolean = true;

    constructor() { }

    ngOnInit(): void {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window['onYouTubeIframeAPIReady'] = () => {
            this.YT = window['YT'];
            this.videoPlayer = new window['YT'].Player('player', {
                events: {
                    'onReady': this.onPlayerReady.bind(this),
                    'onStateChange': this.onPlayerStateChange.bind(this)
                }
            })
        };
    }

    ngOnChanges(changes: { [property: string]: SimpleChange }): void {
        if (changes.videoUrl && !changes.videoUrl.firstChange) {
            this.videoUrl = changes.videoUrl.currentValue;

            if (!this.videoUrl) {
                // if no video URL is passed, clear out playing video and hide player
                this.videoId = null;
                this.hidePlayer = true;
            } else {
                // if a video URL is passed, get ID from it and unhide player
                const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                const match = this.videoUrl.match(regExp);
                this.videoId = (match && match[1].length == 11) ? match[1] : null;

                // timeout to skip the 'error' message in hidden youtube player
                if (this.videoId) {
                    setTimeout(() => {
                        this.hidePlayer = false;
                    }, 500);
                }
            }
        }

        if (changes.playState && !changes.playState.firstChange) {
            this.playState = changes.playState.currentValue;

            if (this.playState) {
                this.playVideo();
            } else {
                this.pauseVideo();
            }
        }

        if (changes.muteState && !changes.muteState.firstChange) {
            this.muteState = changes.muteState.currentValue;

            if (this.muteState) {
                this.muteVideo();
            } else {
                this.unmuteVideo();
            }
        }
    }

    onPlayerReady(event): void {
        this.videoPlayer.playVideo();
        this.videoPlayer.unMute();
    }

    onPlayerStateChange(event): void {
        switch (event.data) {
            case window['YT'].PlayerState.PLAYING:
                break;
            case window['YT'].PlayerState.PAUSED:
                break;
            case window['YT'].PlayerState.ENDED:
                this.videoUrl = null;
                break;
        };
    }

    playVideo(): void {
        this.videoPlayer.playVideo();
    }

    pauseVideo(): void {
        this.videoPlayer.pauseVideo();
    }

    muteVideo(): void {
        this.videoPlayer.mute();
    }

    unmuteVideo(): void {
        this.videoPlayer.unMute();
    }
}
