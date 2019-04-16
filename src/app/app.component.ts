import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { SessionService } from './services/session/session.service';

@Component({
  selector: 'prt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('showHide', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0,
        display: 'none'
      })),
      transition('show => hide', [
        animate('.25s')
      ]),
    ]),
  ],
})
export class AppComponent implements OnDestroy {
  isLoadingRoute;
  routerSub: Subscription;

  constructor(private router: Router) {
    this.routerSub = this.router.events.subscribe((event: any) => {
      this.isLoadingRoute = true;
      this._navigationInterceptor(event);
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  private _navigationInterceptor(event: Event): void {
    // if (event instanceof NavigationStart) {
    //   this.isLoadingRoute = true;
    // } else 

    if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
      setTimeout(() => {
        this.isLoadingRoute = false;
      }, 250);
    }
  }
}
