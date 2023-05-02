import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-registry-services',
  templateUrl: './registry-services.component.html',
  styles: [],
})
export class RegistryServicesComponent extends BasePage implements OnInit {
  list: any[] = [];
  constructor() {
    super();
    this.settings.columns = {
      serviceCode: {
        title: 'Clave Servicio',
        type: 'number',
        sort: false,
      },
      serviceDescription: {
        title: 'Descripion del Servicio',
        type: 'string',
        sort: false,
      },
      periodicity: {
        title: 'Periodicidad',
        type: 'string',
        sort: false,
      },
      courtDate: {
        title: 'Fecha de Corte',
        type: 'string',
        sort: false,
      },
    };
  }
  ngOnInit(): void {}
}
