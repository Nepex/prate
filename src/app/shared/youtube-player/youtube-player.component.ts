import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'prt-youtube-player',
    templateUrl: './youtube-player.component.html',
    styleUrls: ['./youtube-player.component.css']
})
export class YoutubePlayerComponent implements OnInit, OnChanges {
    @Input() videoUrl: string;
    @Input() playState: boolean;
    @Input() height: string;
    @Input() width: string;

    public YT: any;
    videoPlayer: any;
    videoId: any;

    constructor() { }

    ngOnInit(): void {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window['onYouTubeIframeAPIReady'] = (e) => {
            this.YT = window['YT'];
            this.videoPlayer = new window['YT'].Player('player', {
                // videoId: this.videoId,
                events: {
                    'onStateChange': this.onPlayerStateChange.bind(this),
                    'onError': this.onPlayerError.bind(this),
                    'onReady': this.onPlayerReady.bind(this)
                }
            })
        };
    }

    ngOnChanges(changes: { [property: string]: SimpleChange }) {
        if (changes.videoUrl && !changes.videoUrl.firstChange) {
            if (!this.videoUrl) {
                this.videoUrl = null;
                this.videoId = null;
            } else {
                this.videoUrl = changes.videoUrl.currentValue;

                var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                var match = this.videoUrl.match(regExp);
                this.videoId = (match && match[1].length == 11) ? match[1] : false;
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
    }

    onPlayerReady(event) {
        console.log('successfully bound player');
        this.videoPlayer.playVideo();
        this.videoPlayer.unMute();
    }

    playVideo() {
        this.videoPlayer.playVideo();
    }

    pauseVideo() {
        this.videoPlayer.pauseVideo();
    }

    onPlayerStateChange(event) {
        switch (event.data) {
            case window['YT'].PlayerState.PLAYING:
                break;
            case window['YT'].PlayerState.PAUSED:
                break;
            case window['YT'].PlayerState.ENDED:
                break;
        };
    };
    //utility
    cleanTime() {
        return Math.round(this.videoPlayer.getCurrentTime())
    };
    onPlayerError(event) {
        switch (event.data) {
            case 2:
                break;
            case 100:
                break;
            case 101 || 150:
                break;
        };
    };
}
