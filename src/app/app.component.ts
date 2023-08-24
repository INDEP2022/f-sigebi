import { Component, OnInit } from '@angular/core';
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
  constructor(
    private previousRouteService: PreviousRouteService,
    private selectConfig: NgSelectConfig
  ) {
    setTheme('bs5');
    this.selectConfig.notFoundText = 'No se encontraron elementos';
    this.selectConfig.loadingText = 'Cargando...';
  }

  ngOnInit(): void {
    const cadena =
      'INSERT &&NO_BIEN: 9549293&&ESTATUS: ADM&&FEC_CAMBIO: 2023-08-18 00:00:00&&USUARIO_CAMBIO: sigebiadmon&&PROGRAMA_CAMBIO_ESTATUS: FACTGENPARCBIEN&&MOTIVO_CAMBIO: Parcialización&&PROCESO_EXT_DOM: TRANSFERENTE';
    console.log(cadena);

    console.log(this.processString(cadena));
  }

  processString(P_CADENA: string): string {
    return P_CADENA.replaceAll('&&', '\n');
  }
}
