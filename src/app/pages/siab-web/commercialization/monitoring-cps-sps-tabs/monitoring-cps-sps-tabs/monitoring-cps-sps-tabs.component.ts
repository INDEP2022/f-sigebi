import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
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
  // data: any = [];
  dataOne: any = [];
  dataTwo: any = [];
  // Array Ngx-Select
  fullEvents = new DefaultSelect([]);

  //Columns
  settingsOne = {
    ...this.settings,
    actions: false,
    columns: { ...INCONSINTENCIES_SIRSAE_COLUMNS_MONITORING },
  };
  settingsTwo = {
    ...this.settings,
    actions: false,
    columns: { ...EXPENSES_COLUMNS_MONITORING },
  };

  // Data Table
  dataSiab: LocalDataSource = new LocalDataSource();
  columnsSiab: any[] = [];
  //
  dataSirsae: LocalDataSource = new LocalDataSource();
  columnsSirsae: any[] = [];
  //
  dataExpenses: LocalDataSource = new LocalDataSource();
  columnsExpenses: any[] = [];

  // Paginador
  paramsFilter: any;
  paramsSiab = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsSiab: number = 0;
  //
  paramsSirsae = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsSirsae: number = 0;
  //
  paramsExpenses = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsExpenses: number = 0;

  //

  constructor(
    private servicePayment: PaymentService,
    private subdelegationService: SubdelegationService,
    private serviceSpent: ComerDetexpensesService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...INCONSINTENCIES_COLUMNS_MONITORING },
    };
  }

  ngOnInit(): void {
    this.fullYear();
    this.paramsSiab
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.fullDataTableSiabOrSirsae(this.paramsFilter));
    this.paramsSirsae
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.fullDataTableSiabOrSirsae(this.paramsFilter));
    // this.paramsExpenses
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.fullExpenses());
  }

  //

  fullYear() {}

  fullDataTableSiabOrSirsae(event: any) {
    console.log(
      'El tipo de evento de los parametros -  el sistema: ',
      event?.updates[3].value
    );
    if (event?.updates[3].value == 'SIAB') {
      this.dataSirsae.load([]);
      this.dataSirsae.refresh();
      this.totalItemsSirsae = 0;
      this.dataExpenses.load([]);
      this.dataExpenses.refresh();
      this.totalItemsExpenses = 0;

      this.paramsFilter = event;
      this.servicePayment.postIdentifiesPaymentsInconsistency(event).subscribe({
        next: response => {
          this.columnsSiab = [];
          this.columnsSiab = response.data;
          this.totalItemsSiab = response.count || 0;
          this.dataSiab.load(this.columnsSiab);
          this.dataSiab.refresh();
        },
        error: error => {
          this.dataSiab.load([]);
          this.dataSiab.refresh();
        },
      });
    } else if (event?.updates[3].value == 'SIRSAE') {
      this.dataSiab.load([]);
      this.dataSiab.refresh();
      this.totalItemsSiab = 0;
      this.dataExpenses.load([]);
      this.dataExpenses.refresh();
      this.totalItemsExpenses = 0;

      this.paramsFilter = event;
      this.servicePayment.postIdentifiesPaymentsInconsistency(event).subscribe({
        next: response => {
          this.columnsSiab = [];
          this.columnsSiab = response.data;
          this.totalItemsSirsae = response.count || 0;
          this.dataSirsae.load(this.columnsSiab);
          this.dataSirsae.refresh();
        },
        error: error => {
          this.dataSirsae.load([]);
          this.dataSirsae.refresh();
        },
      });
    }
  }

  fullExpenses(event?: any) {
    this.dataSiab.load([]);
    this.dataSiab.refresh();
    this.totalItemsSiab = 0;
    this.dataSirsae.load([]);
    this.dataSirsae.refresh();
    this.totalItemsSirsae = 0;

    let params: ListParams = new ListParams();
    this.serviceSpent.getExpenses(params).subscribe({
      next: response => {
        this.columnsSiab = [];
        this.columnsSiab = response.data;
        this.totalItemsExpenses = response.count || 0;
        this.dataExpenses.load(this.columnsSiab);
        this.dataExpenses.refresh();
      },
      error: error => {
        this.dataExpenses.load([]);
        this.dataExpenses.refresh();
      },
    });
  }

  //
}
