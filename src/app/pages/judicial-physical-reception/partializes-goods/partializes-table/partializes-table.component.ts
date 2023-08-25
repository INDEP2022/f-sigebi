import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { PartializesGoodsService } from '../services/partializes-goods.service';

@Component({
  selector: 'app-partializes-table',
  templateUrl: './partializes-table.component.html',
  styleUrls: ['./partializes-table.component.scss'],
})
export class PartializesTableComponent
  extends BasePageTableNotServerPagination<any>
  implements OnInit
{
  @Output() selectPartializedGood = new EventEmitter<number>();
  loadingExcel = false;
  flagDownload = false;
  elementToExport: any[];
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

  exportExcel() {
    this.loadingExcel = true;
    this.elementToExport = [];
    const arrayDetails: any[] = [];
    this.data.forEach(item => {
      arrayDetails.push({
        PARCIALIZACION: item.partializedId,
        BIEN: item.goodNumber.id,
        DESCRIPCION: item.description,
      });
    });
    this.elementToExport = [...arrayDetails];
    this.flagDownload = !this.flagDownload;
    this.loadingExcel = false;
  }

  override getData() {
    if (this.serviceData.numberGoodQueryParams) {
      this.loading = true;
      this.partializeService
        .getData(+this.serviceData.numberGoodQueryParams)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            console.log(response);
            if (response && response.data && response.data.length > 0) {
              this.data = response.data.map(x => {
                return { ...x, noBien: x.goodNumber.id };
              });
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

  // override getParams() {
  //   let params = {
  //     ...this.params.getValue(),
  //     ...this.columnFilters,
  //   };
  //   if (this.serviceData.numberGoodQueryParams) {
  //     params = {
  //       ...params,
  //       'filter.goodNumber': '$eq:' + this.serviceData.numberGoodQueryParams,
  //     };
  //   }
  //   return params;
  // }

  select(item: any) {
    console.log(item);

    this.selectPartializedGood.emit(item.noBien);
  }

  // override async extraOperationsGetData() {
  //   this.serviceData.items = await this.data.getAll();
  //   console.log(this.serviceData.items);
  // }
}
