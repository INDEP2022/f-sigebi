import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { SAT_CATALOGS_COLUMNS } from './sat-catalogs-columns';

@Component({
  selector: 'app-sat-catalogs',
  templateUrl: './sat-catalogs.component.html',
  styles: [],
})
export class SatCatalogsComponent extends BasePage implements OnInit {
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...SAT_CATALOGS_COLUMNS },
    };
  }

  ngOnInit(): void {}

  data = [
    {
      allotment: '1',
      client: 'IMPULSORA AZUCARERA',
      use: 'Error uso comprobante',
      unit: 'Error unidad de medida',
      service: 'Error clave producto o servicio',
      payMeth: 'Error forma de pago',
      typeRelationship: 'Error tipo de servicio',
    },
    {
      allotment: '2',
      client: 'BETA SAN MIGUEL S.A de C.V',
      use: 'Error uso comprobante',
      unit: 'Error unidad de medida',
      service: 'Error clave producto o servicio',
      payMeth: 'Error forma de pago',
      typeRelationship: 'Error tipo de servicio',
    },
  ];
}
