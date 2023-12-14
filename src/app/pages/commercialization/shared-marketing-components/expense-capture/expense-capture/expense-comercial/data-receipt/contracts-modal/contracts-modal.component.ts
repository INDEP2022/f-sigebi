import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { IContract } from '../../../../models/payment';
import { ExpensePaymentService } from '../../../../services/expense-payment.service';
import { COLUMNS } from '../contract-columns';

@Component({
  selector: 'app-contracts-modal',
  templateUrl: './contracts-modal.component.html',
  styleUrls: ['./contracts-modal.component.css'],
})
export class ContractsModalComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  selected: IContract;
  constructor(
    private modalRef: BsModalRef,
    private expensePaymentService: ExpensePaymentService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: null,
      columns: { ...COLUMNS },
    };
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  selectRow(row: IContract) {
    this.selected = row;
  }

  confirm() {
    this.modalRef.content.callback({
      selected: this.selected,
    });
    this.modalRef.hide();
  }

  override getData() {
    this.loading = true;
    this.expensePaymentService
      .validateContract()
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
