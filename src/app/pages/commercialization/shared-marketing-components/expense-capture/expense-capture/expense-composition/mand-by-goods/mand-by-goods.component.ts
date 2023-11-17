import { Component, OnInit } from '@angular/core';
import { AccountingService } from 'src/app/core/services/ms-accounting/accounting.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { IMandExpenseCont } from 'src/app/core/models/ms-accounting/mand-expensecont';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-mand-by-goods',
  templateUrl: './mand-by-goods.component.html',
  styleUrls: ['./mand-by-goods.component.scss'],
})
export class MandByGoodsComponent
  extends BasePageTableNotServerPagination<IMandExpenseCont>
  implements OnInit
{
  total: any = 0;
  spentId: number;
  constructor(
    private dataService: AccountingService,
    private modalRef: BsModalRef
  ) {
    super();
    this.service = this.dataService;
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  override getParams() {
    let newColumnFilters: any = [];
    if (this.spentId && this.spentId) {
      newColumnFilters['filter.spentId'] = this.spentId;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  override setTotals(data: IMandExpenseCont[]): void {
    this.total = 0;
    data.forEach(x => {
      this.total += +x.amount;
    });
    this.total = this.total.toFixed(2);
  }

  close() {
    this.modalRef.hide();
  }
}
