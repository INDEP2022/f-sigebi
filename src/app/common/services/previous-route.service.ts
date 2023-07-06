import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteService {
  private history: string[] = [];

  constructor(private router: Router, private location: Location) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        this.history.push(event.urlAfterRedirects);
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
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
