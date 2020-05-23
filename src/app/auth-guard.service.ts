// Angular
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

// App
import { SessionService } from './services/session/session.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private sessionService: SessionService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.sessionService.isAuthenticated()) {
            this.router.navigate(['/'], {
                queryParams: {
                    redirect: state.url
                }
            });
            return;
        }

        return true;
    }
}
