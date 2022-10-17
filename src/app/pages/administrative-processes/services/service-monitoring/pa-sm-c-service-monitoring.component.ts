import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-pa-sm-c-service-monitoring',
  templateUrl: './pa-sm-c-service-monitoring.component.html',
  styles: []
})
export class PaSmCServiceMonitoringComponent extends BasePage implements OnInit {

  //Provisional DATA
  data: any[] = [
    {
      numberGood: 17817,
      descriptionG: 'Vagoneta Pontiac',
      numberService: 3402,
      descriptionS: 'Fletes y Maniobras',
      nextPayment: '02-06-2001',
      delay: '1305',
      status: 'expiredDate',
    },
    {
      numberGood:12112,
      descriptionG: 'Ficha Depósito',
      numberService: 3823,
      descriptionS: 'Gastos de seguridad Pública y Nacional',
      nextPayment: '02-06-2001',
      delay: '1305',
      status: 'dueDate',
    }

  ];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  requestId: string;
  serviceId: string = 'service3921dajk';
  globalAmount: number = 20005000.0;
  paymentDate: Date = new Date();

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      rowClassFunction: (row:any) =>{
        if(row.data.status === 'dueDate'){
          return 'text-success';
        }else {
          return 'text-danger'
        }
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

}
