// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// App
import { environment } from '../../../environments/environment';
import { User, BugReport } from '../../shared/models';

// Service for creating, searching, and updating users
@Injectable()
export class UserService {
    public avatarChanged: EventEmitter<string> = new EventEmitter();
    public userSettingsChanged: EventEmitter<User> = new EventEmitter();

    private apiUrl = `${environment.apiBaseUrl}/users`;

    constructor(private http: HttpClient) { }

    public getUser(): Observable<User> {
        const url = `${this.apiUrl}/me`;

        const req = this.http.get<User>(url).pipe(map(res => res));

        return req;
    }

    public getById(id: string): Observable<User> {
        const url = `${this.apiUrl}/${id}`;

        const req = this.http.get<User>(url);

        return req;
    }

    public create(user: User): Observable<User> {
        const url = `${this.apiUrl}`;

        const req = this.http.post<User>(url, user).pipe(map(res => res));

        return req;
    }

    public updateUser(user: User): Observable<User> {
        const url = `${this.apiUrl}/${user.id}`;

        const req = this.http.put<User>(url, user).pipe(map(res => res));

        return req;
    }

    public updateUserAvatar(user: User): Observable<User> {
        const url = `${this.apiUrl}/avatar/${user.id}`;

        const body = {
            avatar: user.avatar
        };

        const req = this.http.put<User>(url, body).pipe(map(res => res));

        return req;
    }

    public awardExp(userInfo: User, secsSpentChatting: number): Observable<User> {
        const user = Object.assign({}, userInfo);

        user.experience = user.experience + secsSpentChatting;

        delete user.status;
        delete user.email;
        delete user.avatar;
        delete user.levelInfo;
        delete user.friends;
        delete user.friend_requests;

        const url = `${this.apiUrl}/${user.id}`;

        const req = this.http.put<User>(url, user).pipe(map(res => res));

        return req;
    }

    public sendBugReport(report: BugReport): Observable<BugReport> {
        const url = `${this.apiUrl}/bugreport/`;

        const body = {
            message: report
        };

        const req = this.http.post<BugReport>(url, body).pipe(map(res => res));

        return req;
    }
}
