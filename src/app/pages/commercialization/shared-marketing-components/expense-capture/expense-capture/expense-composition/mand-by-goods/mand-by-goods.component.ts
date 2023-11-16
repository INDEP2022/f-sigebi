import { Component, OnInit } from '@angular/core';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { IMandExpense } from '../../../models/mandcont';

@Component({
  selector: 'app-mand-by-goods',
  templateUrl: './mand-by-goods.component.html',
  styleUrls: ['./mand-by-goods.component.scss'],
})
export class MandByGoodsComponent
  extends BasePageTableNotServerPagination<IMandExpense>
  implements OnInit
{
  total = 0;
  constructor() {
    super();
  }

  override setTotals(data: IMandExpense[]): void {
    this.total = 0;
    data.forEach(x => {
      this.total += +x.amount;
    });
    this.total = +this.total.toFixed(2);
  }
}
