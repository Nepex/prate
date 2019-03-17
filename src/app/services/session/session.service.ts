import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { LocalStorageService } from 'ngx-webstorage';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Credentials } from './credentials';
import { environment } from '../../../environments/environment';
import { Session } from './session';

/**
    * Service for controlling user sessions and authentication
*/
@Injectable()
export class SessionService {

    /** Storage for tokens */
    public static STORAGE_KEYS = { TOKEN: 'token' };
    /** EventEmitter for when users login */
    public onLogin: EventEmitter<void> = new EventEmitter<void>();
    /** EventEmitter for when users logout */
    public onLogout: EventEmitter<void> = new EventEmitter<void>();

    /** API Url */
    private sessionUrl: string;
    /** Stores session tokens */
    public currentSession: Session;

    /**
        * Loads session and sets session url
    */
    constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
        this.sessionUrl = `${environment.apiBaseUrl}/sessions`;
        this.loadStoredSession();
    }

    /**
        * Checks to see if user is already logged in, loads existing token
    */
    loadStoredSession() {
        const existingToken = this.localStorageService.retrieve(SessionService.STORAGE_KEYS.TOKEN);

        if (existingToken) {
            this.currentSession = {
                token: existingToken
            };

            this.onLogin.emit();
        }
    }

    /**
        * Creates a onetimetoken for user session
        * @returns string token
    */
    getOneTimeToken(): Observable<string> {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.currentSession.token}`);
        headers.append('Cache-Control', 'no-cache');
        headers.append('Pragma', 'no-cache');
        headers.append('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT');

        const req = this.http.get<{ token: string }>(`${this.sessionUrl}/onetimetoken`, {
            headers: headers,
            observe: 'response'
        }).pipe(map((response) => response.body.token));

        return req;
    }

    /**
        * Gets currently loaded token
    */
    getToken() {
        return this.currentSession ? this.currentSession.token : null;
    }

    /**
        * Checks to make sure user's token is authenticated
    */
    isAuthenticated() {
        return this.currentSession && this.currentSession.token ? true : false;
    }

    /**
        * Swaps organization
        * @param id Takes org ID
    */
    switchOrganization(id: number) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${this.currentSession.token}`);

        const req = this.http.get<{token: string}>(`${this.sessionUrl}/switch/${id}`, {
            headers: headers
        }).pipe(tap(data => {
            this.currentSession = null;
            this.localStorageService.clear(SessionService.STORAGE_KEYS.TOKEN);
            this.localStorageService.store(SessionService.STORAGE_KEYS.TOKEN, data.token);
            this.loadStoredSession();
        }));

        return req;
    }

    /**
        * Clears user's token, logging them out
    */
    logout() {
        this.currentSession = null;
        this.localStorageService.clear(SessionService.STORAGE_KEYS.TOKEN);
        this.onLogout.emit();
    }

    /**
        * Attempts to log user in
        * @param credentials Takes Credentials object to authenticate
        * @returns Session
    */
    login(credentials: Credentials): Observable<Session> {
        if (this.currentSession) {
            throw new Error('already logged in');
        }

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        const req = this.http.post<{ token: string}>(this.sessionUrl, credentials, { headers: headers })
            .pipe(tap(body => {
                this.localStorageService.store(SessionService.STORAGE_KEYS.TOKEN, body.token);

                // http://stackoverflow.com/questions/13292744/why-isnt-localstorage-persisting-in-chrome
                this.loadStoredSession();

                this.onLogin.emit();
            }));

        return req;
    }
}
