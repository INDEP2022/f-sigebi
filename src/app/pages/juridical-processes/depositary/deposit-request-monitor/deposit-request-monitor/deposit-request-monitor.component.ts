import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { BasePage } from 'src/app/core/shared/base-page';

// export interface Example {
//   numberGood: number;
//   description: string;
//   dateRequest: string;
//   typeRequest: string;
//   areaAttendRequest: string;
//   daysDelay: string;
// }
@Component({
  selector: 'app-deposit-request-monitor',
  templateUrl: './deposit-request-monitor.component.html',
  styles: [],
})
export class DepositRequestMonitorComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  request: any[] = [];
  today: any = new Date();
  MILLISECONDS_PER_DAY: number = 1000 * 60 * 60 * 24;
  //Data Table

  // data: Example[] = [
  //   {
  //     numberGood: 1,
  //     description: 'Descripción 1',
  //     dateRequest: '11/03/2022',
  //     typeRequest: 'Tipo de solicitud 1',
  //     areaAttendRequest: 'Area de prueba',
  //     daysDelay: '20 dias',
  //   },
  //   {
  //     numberGood: 1,
  //     description: 'Descripción 1',
  //     dateRequest: '11/03/2022',
  //     typeRequest: 'Tipo de solicitud 1',
  //     areaAttendRequest: 'Area de prueba',
  //     daysDelay: '20 dias',
  //   },
  //   {
  //     numberGood: 1,
  //     description: 'Descripción 1',
  //     dateRequest: '11/03/2022',
  //     typeRequest: 'Tipo de solicitud 1',
  //     areaAttendRequest: 'Area de prueba',
  //     daysDelay: '20 dias',
  //   },
  // ];

  constructor(
    private depositaryService: MsDepositaryService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        propertyNumber: {
          title: 'No Bien',
          width: '10%',
          sort: true,
        },
        requestDate: {
          title: 'Fecha Solicitud',
          width: '10%',
          sort: false,
        },
        requestType: {
          title: 'Tipo de Solicitud',
          width: '10%',
          sort: false,
        },
        attentionUser: {
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

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getRequestDepositaryInformation());
  }

  getRequestDepositaryInformation() {
    var info: any[] = [];
    this.loading = true;
    this.depositaryService
      .getRequestDepositary(this.params.getValue())
      .subscribe({
        next: data => {
          data.data.forEach((element: any) => {
            var daysDelay: any = new Date(element.requestDate);
            element['daysDelay'] = Math.ceil(
              (this.today - daysDelay) / this.MILLISECONDS_PER_DAY
            );
            element['requestDate'] = this.datePipe.transform(
              element.requestDate,
              'dd-MM-yyyy'
            );
            info.push(element);
          });
          this.request = data.data;
          this.totalItems = data.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  select(event: any) {}
}
