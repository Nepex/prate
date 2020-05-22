// Angular
import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'prt-youtube-player',
    templateUrl: './youtube-player.component.html',
    styleUrls: ['./youtube-player.component.css']
})
export class YoutubePlayerComponent implements OnInit, OnChanges {
    @Input() videoUrl: string;
    @Input() playState: boolean;
    @Input() muteState: boolean;

    public YT: any;
    videoPlayer: any;
    videoId: any;
    hidePlayer: boolean = true;

    constructor() { }

    ngOnInit() {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window['onYouTubeIframeAPIReady'] = () => {
            this.YT = window['YT'];
            this.videoPlayer = new window['YT'].Player('player', {
                events: {
                    'onReady': this.onPlayerReady.bind(this)
                }
            })
        };
    }

    ngOnChanges(changes: { [property: string]: SimpleChange }) {
        if (changes.videoUrl && !changes.videoUrl.firstChange) {
            this.videoUrl = changes.videoUrl.currentValue;

            if (!this.videoUrl) {
                this.videoId = null;
                this.hidePlayer = true;
            }  else {
                const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                const match = this.videoUrl.match(regExp);
                this.videoId = (match && match[1].length == 11) ? match[1] : false;
    
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

    onPlayerReady(e) {
        this.videoPlayer.playVideo();
        this.videoPlayer.unMute();
    }

    playVideo() {
        this.videoPlayer.playVideo();
    }

    pauseVideo() {
        this.videoPlayer.pauseVideo();
    }

    muteVideo() {
        this.videoPlayer.mute();
    }

    unmuteVideo() {
        this.videoPlayer.unMute();
    }
}
