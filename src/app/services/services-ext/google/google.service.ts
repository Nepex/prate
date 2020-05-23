// Angular
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Service for handling google api calls
@Injectable()
export class GoogleService {
    private http: HttpClient;
    private googleApiKey: string = 'AIzaSyCcHzGUWPieUbZ7IZHhmBpcQ22mkeuEmuU';

    constructor(handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }

    public getYtVideoInfo(videoId: string): Observable<any> {
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${this.googleApiKey}`;

        const req = this.http.get<any>(url).pipe(map(res => res));

        return req;
    }
}

