import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
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
  obs: MutationObserver;
  constructor(
    private previousRouteService: PreviousRouteService,
    private selectConfig: NgSelectConfig,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    setTheme('bs5');
    this.selectConfig.notFoundText = 'No se encontraron elementos';
    this.selectConfig.loadingText = 'Cargando...';
  }

  ngOnInit(): void {}
}
