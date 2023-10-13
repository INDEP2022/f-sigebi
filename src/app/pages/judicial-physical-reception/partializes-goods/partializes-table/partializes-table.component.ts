import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { IPartializedGoods } from 'src/app/core/models/ms-partialize-goods/partialize-good.model';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { PartializesGoodsService } from '../services/partializes-goods.service';

@Component({
  selector: 'app-partializes-table',
  templateUrl: './partializes-table.component.html',
  styleUrls: ['./partializes-table.component.scss'],
})
export class PartializesTableComponent
  extends BasePageTableNotServerPagination<IPartializedGoods>
  implements OnInit
{
  @Input() get noBien() {
    return this._noBien;
  }
  set noBien(value) {
    if (!value) {
      this.notGetData();
      return;
    }
    this._noBien = value;
    this.getData();
  }

  private _noBien: number;
  constructor(
    private serviceData: PartializesGoodsService,
    private partializeService: GoodPartializeService
  ) {
    super();
    // this.service = this.partializeService;
    // this.ilikeFilters = ['description'];
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        noBien: {
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

  override getData() {
    if (this.noBien) {
      this.loading = true;
      this.serviceData.loading = true;
      this.partializeService
        .getData(+this.noBien)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            console.log(response);
            if (response && response.data && response.data.length > 0) {
              this.data = response.data.map(x => {
                return { ...x, noBien: x.goodNumber.id };
              });
              this.serviceData.data = this.data;
              this.totalItems = this.data.length;
              this.dataTemp = [...this.data];
              this.getPaginated(this.params.value);
              this.loading = false;
              this.serviceData.loading = false;
            } else {
              this.notGetData();
              this.serviceData.data = [];
              this.serviceData.loading = false;
            }
          },
          error: err => {
            this.notGetData();
            this.serviceData.data = [];
            this.serviceData.loading = false;
          },
        });
    }
  }
}
