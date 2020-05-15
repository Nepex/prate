import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GoogleService {
    googleApiKey: string = 'AIzaSyCcHzGUWPieUbZ7IZHhmBpcQ22mkeuEmuU';

    private http: HttpClient;

    constructor(handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    getYtVideoInfo(videoId: string): Observable<any> {
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${this.googleApiKey}`;

        const req = this.http.get<any>(url).pipe(map(res => res));

        return req;
    }
}

