import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private history: string[] = [];

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
        let finalUrl =
          this.router.getCurrentNavigation().previousNavigation.finalUrl ??
          null;
        if (finalUrl)
          localStorage.setItem('previousRoute', finalUrl.toString());
        // if (event.url !== event.urlAfterRedirects) {
        //   this.history.push(event.urlAfterRedirects);
        // }
      }
    });
  }

  getHistory() {
    return this.history;
  }

  back(): void {
    let previousRoute = localStorage.getItem('previousRoute');
    if (previousRoute) {
      this.router.navigate([previousRoute]);
    } else {
      this.router.navigateByUrl('/');
    }
    // this.history.pop();
    // if (this.history.length > 0) {
    //   this.location.back();
    // } else {
    //   this.router.navigateByUrl('/');
    // }
  }
}
