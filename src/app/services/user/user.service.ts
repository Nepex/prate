// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// App
import { BugReport } from '../generic/bug-report';
import { environment } from '../../../environments/environment';
import { User } from './user';

@Injectable()
export class UserService {
    @Output() public avatarChanged: EventEmitter<any> = new EventEmitter();
    @Output() public userSettingsChanged: EventEmitter<any> = new EventEmitter();

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

        delete user.email;
        delete user.avatar;
        delete user.levelInfo;

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
