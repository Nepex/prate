import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

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
  isLoadingRoute = true;
  destroyElement = false;
  routerSub: Subscription;

  constructor(private router: Router) {
    this.routerSub = this.router.events.subscribe((event: any) => {
      this._navigationInterceptor(event);
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  private _navigationInterceptor(event: Event): void {
    this.isLoadingRoute = true;
    this.destroyElement = false;

    window.onload = () => {
      this.isLoadingRoute = false;

      setTimeout(() => {
        this.destroyElement = true;
      }, 250);
    };
    
    // if (event instanceof NavigationStart) {
    //   this.isLoadingRoute = true;
    // } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
    //   this.isLoadingRoute = false;
    // }
  }
}
