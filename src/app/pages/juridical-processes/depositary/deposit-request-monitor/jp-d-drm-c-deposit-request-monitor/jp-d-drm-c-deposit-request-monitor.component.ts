import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

export interface Example {
  numberGood: number;
  description: string;
  dateRequest: string;
  typeRequest: string;
  areaAttendRequest: string;
  daysDelay: string;
}
@Component({
  selector: 'app-jp-d-drm-c-deposit-request-monitor',
  templateUrl: './jp-d-drm-c-deposit-request-monitor.component.html',
  styles: [],
})
export class JpDDrmCDepositRequestMonitorComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table

  data: Example[] = [
    {
      numberGood: 1,
      description: 'Descripción 1',
      dateRequest: '11/03/2022',
      typeRequest: 'Tipo de solicitud 1',
      areaAttendRequest: 'Area de prueba',
      daysDelay: '20 dias',
    },
    {
      numberGood: 1,
      description: 'Descripción 1',
      dateRequest: '11/03/2022',
      typeRequest: 'Tipo de solicitud 1',
      areaAttendRequest: 'Area de prueba',
      daysDelay: '20 dias',
    },
    {
      numberGood: 1,
      description: 'Descripción 1',
      dateRequest: '11/03/2022',
      typeRequest: 'Tipo de solicitud 1',
      areaAttendRequest: 'Area de prueba',
      daysDelay: '20 dias',
    },
  ];

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        numberGood: {
          title: 'No Bien',
          width: '10%',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          width: '20%',
          sort: false,
        },
        dateRequest: {
          title: 'Fecha Solicitud',
          width: '10%',
          sort: false,
        },
        typeRequest: {
          title: 'Tipo de Solicitud',
          width: '10%',
          sort: false,
        },
        areaAttendRequest: {
          title: 'Área que atendera la petición',
          width: '10%',
          sort: false,
        },
        daysDelay: {
          title: 'Días de Retraso',
          width: '10%',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {}

  select(event: any) {}
}
