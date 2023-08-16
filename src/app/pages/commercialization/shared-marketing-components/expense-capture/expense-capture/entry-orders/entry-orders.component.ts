import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-entry-orders',
  templateUrl: './entry-orders.component.html',
  styleUrls: ['./entry-orders.component.scss'],
})
export class EntryOrdersComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  toggleInformation = true;
  constructor(
    private dataService: PaymentService,
    private expenseCaptureDataService: ExpenseCaptureDataService
  ) {
    super();
    this.params.value.limit = 100000;
    this.haveInitialCharge = false;
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
    };
    this.expenseCaptureDataService.updateOI
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
          }
        },
      });
  }

  get eventNumber() {
    return this.expenseCaptureDataService.eventNumber;
  }

  get lotNumber() {
    return this.expenseCaptureDataService.lotNumber;
  }

  get clkpv() {
    return this.expenseCaptureDataService.data.clkpv;
  }

  get showFilters() {
    return (
      this.expenseCaptureDataService.expenseNumber &&
      this.expenseCaptureDataService.expenseNumber.value
    );
  }

  replyFolio() {}

  reload() {
    this.getData();
  }

  override getData() {
    if (!this.dataService || !this.eventNumber || !this.lotNumber) {
      return;
    }
    this.loading = true;
    this.dataService
      .getOI({
        idEvento: this.eventNumber.value,
        idLote: this.lotNumber.value,
        pTipo: this.expenseCaptureDataService.PDEVCLIENTE ? 'D' : 'NADA',
        clkpv: this.clkpv,
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);

          if (response && response.data) {
            this.data = response.data;
            this.totalItems = this.data.length;
            this.dataTemp = [...this.data];
            this.getPaginated(this.params.value);
            this.loading = false;
          } else {
            this.notGetData();
          }
        },
        error: err => {
          this.notGetData();
        },
      });
  }
}
