import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
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

  // Paginador
  paramsFilter: any;
  paramsSiab = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsSiab: number = 0;

  //

  constructor(
    private servicePayment: PaymentService,
    private subdelegationService: SubdelegationService
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
      .subscribe(() => this.fullDataTableSiab(this.paramsFilter));
  }

  //

  fullYear() {}

  fullDataTableSiab(event: ListParams) {
    this.paramsFilter = event;
    this.servicePayment.postIdentifiesPaymentsInconsistency(event).subscribe({
      next: response => {
        this.columnsSiab = response.data;
        this.totalItemsSiab = response.count || 0;
        this.dataSiab.load(this.columnsSiab);
        this.dataSiab.refresh();
      },
      error: response => {
        this.dataSiab.load([]);
        this.dataSiab.refresh();
      },
    });
  }

  //
}
