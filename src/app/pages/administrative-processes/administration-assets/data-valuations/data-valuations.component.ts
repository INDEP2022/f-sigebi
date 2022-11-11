import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-data-valuations',
  templateUrl: './data-valuations.component.html',
  styles: [],
})
export class DataValuationsComponent extends BasePage implements OnInit {
  list: any[] = [];
  constructor() {
    super();
    this.settings.columns = {
      noRequest: {
        title: 'No. Solicitud',
        type: 'number',
        sort: false,
      },
      valuationDate: {
        title: 'Fecha Avaluo',
        type: 'string',
        sort: false,
      },
      validityDate: {
        title: 'Fecha Vigencia',
        type: 'string',
        sort: false,
      },
      cost: {
        title: 'Costo',
        type: 'string',
        sort: false,
      },
      valuationValue: {
        title: 'Valor Avaluo',
        type: 'string',
        sort: false,
      },
      phisicValue: {
        title: 'Valor Fisico',
        type: 'string',
        sort: false,
      },
      comercializationValue: {
        title: 'Valor Comercializacion',
        type: 'string',
        sort: false,
      },
      landValue: {
        title: 'Valor Terreno',
        type: 'string',
        sort: false,
      },
      buildingValue: {
        title: 'Valor Const.',
        type: 'string',
        sort: false,
      },
      instValue: {
        title: 'Valor Inst.',
        type: 'string',
        sort: false,
      },
      oportunityValue: {
        title: 'Valor Oportunidad',
        type: 'string',
        sort: false,
      },
      unitValue: {
        title: 'Valor Unitario',
        type: 'string',
        sort: false,
      },
      maqEquiValue: {
        title: 'Valor Maq. Equipo',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}
}
