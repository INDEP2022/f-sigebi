import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IPartializedGoodList } from 'src/app/core/models/ms-partialize-goods/partialize-good.model';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { PartializesGoodsService } from '../services/partializes-goods.service';

@Component({
  selector: 'app-partializes-table',
  templateUrl: './partializes-table.component.html',
  styleUrls: ['./partializes-table.component.scss'],
})
export class PartializesTableComponent
  extends BasePageWidhtDinamicFiltersExtra<IPartializedGoodList>
  implements OnInit
{
  @Output() selectPartializedGood = new EventEmitter<number>();
  constructor(
    private serviceData: PartializesGoodsService,
    private partializeService: GoodPartializeService
  ) {
    super();
    this.service = this.partializeService;
    this.ilikeFilters = ['description'];
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        goodNumber: {
          title: 'No. Bien',
          type: 'string',
          sort: false,
        },
        description: {
          title: 'Descripción',
          type: 'string',
          sort: false,
        },
      },
    };
  }

  override getParams() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.serviceData.numberGoodQueryParams) {
      params = {
        ...params,
        'filter.goodNumber': '$eq:' + this.serviceData.numberGoodQueryParams,
      };
    }
    return params;
  }

  select(goodNumber: number) {
    this.selectPartializedGood.emit(goodNumber);
  }

  override async extraOperationsGetData() {
    this.serviceData.items = await this.data.getAll();
    console.log(this.serviceData.items);
  }
}
