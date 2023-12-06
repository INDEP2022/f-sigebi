import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { ExpensePaymentService } from '../../../services/expense-payment.service';

@Component({
  selector: 'app-retentions-modal',
  templateUrl: './retentions-modal.component.html',
  styleUrls: ['./retentions-modal.component.css'],
})
export class RetentionsModalComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  constructor(
    private modalRef: BsModalRef,
    private expensePaymentService: ExpensePaymentService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: null,
      columns: {
        indRetention: {
          title: 'Id Retención',
          type: 'string',
          sort: false,
        },
        redcs: {
          title: 'Descripción',
          type: 'string',
          sort: false,
        },
        typeRetention: {
          title: 'Tipo',
          type: 'string',
          sort: false,
        },
      },
    };
  }

  override getData() {
    this.loading = true;
    this.expensePaymentService
      .catalogRetentions()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
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

  close() {
    this.modalRef.hide();
  }
}
