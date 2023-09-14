import { Component, Input, OnInit } from '@angular/core';
import { INumeraryxGoods } from 'src/app/core/models/ms-numerary/numerary.model';
import { NumeraryXGoodsService } from 'src/app/core/services/ms-numerary/numerary-x-goods.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-numeraire-dispersion',
  templateUrl: './numeraire-dispersion.component.html',
  styleUrls: ['./numeraire-dispersion.component.scss'],
})
export class NumeraireDispersionComponent
  extends BasePageTableNotServerPagination<INumeraryxGoods>
  implements OnInit
{
  @Input() idGasto: string;
  @Input() mandato: string;
  @Input() idEvento: number;
  toggleInformation = true;
  total = 0;
  constructor(private dataService: NumeraryXGoodsService) {
    super();
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      actions: false,
    };
    this.service = this.dataService;
  }

  override getParams() {
    let newColumnFilters: any = [];
    newColumnFilters['filter.apply'] = '$eq:S';
    newColumnFilters['filter.eventId'] = '$eq:' + this.idEvento;
    newColumnFilters['filter.spentId'] = '$eq:' + this.idGasto;
    if (this.mandato) {
      newColumnFilters['filter.cvman'] = '$eq:' + this.mandato;
    }
    return {
      ...this.params.getValue(),
    };
  }

  override setTotals(data: INumeraryxGoods[]): void {
    this.total = 0;
    data.forEach(x => {
      this.total += +x.amount;
    });
    this.total = +this.total.toFixed(2);
  }
}
