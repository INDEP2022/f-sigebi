import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { PreviousRouteService } from './common/services/previous-route.service';
@Component({
  selector: 'app-root',
  template: `
    <app-loading></app-loading>
    <app-loading-percent></app-loading-percent>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  constructor(private previousRouteService: PreviousRouteService) {
    setTheme('bs5');
  }

  ngOnInit(): void {}
}
