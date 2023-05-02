import { Component, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'title',
  template: ``,
})
export class TitleComponent implements OnDestroy {
  $unSubscribe = new Subject<void>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {
        let currentRoute = this.route.root;
        let title = '';
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(routes => {
            if (routes.outlet === 'primary') {
              title = routes.snapshot.data['title'];
              currentRoute = routes;
            }
          });
        } while (currentRoute);
        if (title !== undefined) {
          this.titleService.setTitle(title + ' | SIGEBI');
        }
      });
  }
  ngOnDestroy(): void {
    this.$unSubscribe.next();
    this.$unSubscribe.complete();
  }
}
