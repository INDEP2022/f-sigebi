import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-secure-data',
  templateUrl: './secure-data.component.html',
  styles: [],
})
export class SecureDataComponent extends BasePage implements OnInit {
  list: any[] = [];
  constructor() {
    super();
    this.settings.columns = {
      policy: {
        title: 'Póliza',
        type: 'number',
        sort: false,
      },
      policyDescription: {
        title: 'Descripion de Póliza',
        type: 'string',
        sort: false,
      },
      insuranceCarrier: {
        title: 'Aseguradora',
        type: 'string',
        sort: false,
      },
      entryDate: {
        title: 'Fecha Ingreso',
        type: 'string',
        sort: false,
      },
      lowDate: {
        title: 'Fecha Baja',
        type: 'string',
        sort: false,
      },
      amountInsured: {
        title: 'Suma Asegurada',
        type: 'string',
        sort: false,
      },
      premiumAmount: {
        title: 'Monto Prima',
        type: 'string',
        sort: false,
      },
    };
  }

  ngOnInit(): void {}
}
