import { SessionService } from './../session/session.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User } from './user';


@Injectable()
export class UserService {
    private apiUrl = `${environment.apiBaseUrl}/users`;

    constructor(private http: HttpClient, private sessionService: SessionService) {
    }

    create(user: User): Observable<User> {
        const url = `${this.apiUrl}`;

        const req = this.http.post<User>(url, user).pipe(map(res => res));

        return req;
    }

    getUser(): Observable<User> {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `${this.sessionService.getToken()}`);

        const url = `${this.apiUrl}/me`;

        const req = this.http.get<User>(url, {
            headers: headers
        }).pipe(map(res => res));

        return req;
    }

    // getById(id: number): Observable<User> {
    //     const url = `${this.apiUrl}/${id}`;

    //     const req = this.http.get<User>(url);

    //     return req;
    // }

    // update(user: User): Observable<User> {
    //     const url = `${this.apiUrl}/${user.id}`;
    //     const req = this.http.put<User>(url, user).pipe(tap(() => {
    //     }));

    //     return req;
    // }

    // updateCurrentUser(user: User): Observable<User> {
    //     const url = `${this.apiUrl}/me`;
    //     const req = this.http.put<User>(url, user).pipe(tap(() => {
    //     }));

    //     return req;
    // }

    // remove(id: number): Observable<void> {
    //     const url = `${this.apiUrl}/${id}`;
    //     const req = this.http.delete<void>(url).pipe(tap(() => {
    //     }));

    //     return req;
    // }
}

