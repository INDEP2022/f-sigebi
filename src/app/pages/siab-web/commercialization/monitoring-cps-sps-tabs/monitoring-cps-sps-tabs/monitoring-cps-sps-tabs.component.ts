import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  EXPENSES_COLUMNS_MONITORING,
  INCONSINTENCIES_COLUMNS_MONITORING,
  INCONSINTENCIES_SIRSAE_COLUMNS_MONITORING,
} from '../monitoring-cps-sps-columns.ts/columns';

@Component({
  selector: 'app-monitoring-cps-sps-tabs',
  templateUrl: './monitoring-cps-sps-tabs.component.html',
  styles: [],
})
export class MonitoringCpsSpsTabsComponent extends BasePage implements OnInit {
  //

  //Array Data Table
  data: any;
  dataOne: any;
  dataTwo: any;
  // Array Ngx-Select
  fullEvents = new DefaultSelect([]);

  //Columns
  settingsOne: any;
  settingsTwo: any;

  // Data Table
  dataSiab: LocalDataSource = new LocalDataSource();
  columnsSiab: any[] = [];

  // Paginador
  paramsSiab: BehaviorSubject<FilterParams>;
  totalItemsSiab: number = 0;

  //

  constructor(private servicePayment: PaymentService) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...INCONSINTENCIES_COLUMNS_MONITORING },
    };

    this.settingsOne = {
      ...this.settings,
      actions: false,
      columns: { ...INCONSINTENCIES_SIRSAE_COLUMNS_MONITORING },
    };

    this.settingsTwo = {
      ...this.settings,
      actions: false,
      columns: { ...EXPENSES_COLUMNS_MONITORING },
    };
  }

  ngOnInit(): void {
    this.fullYear();
  }

  //

  fullYear() {}

  fullDataTableSiab(event: any) {
    // console.log("Esto es lo que se recibe desde abajo: ", event)
    // this.servicePayment.postIdentifiesPaymentsInconsistency(event).subscribe({
    //   next: response => {
    //     console.log("Esta es la data del sevricio: ", response.data)
    //     this.columnsSiab = response.data;
    //     this.totalItemsSiab = response.count || 0;
    //     // this.dataSiab.load(this.columnsSiab);
    //     this.dataSiab.refresh();
    //   }, error: response => {
    //     this.dataSiab.load([]);
    //     this.dataSiab.refresh();
    //   }
    // })

    this.dataSiab.load([
      { column1: 'value1', column2: 'value2' },
      { column1: 'value3', column2: 'value4' },
    ]);
  }

  //
}
