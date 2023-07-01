import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COUNT_GOOD_COLUMNS } from '../warehouse-columns';
@Component({
  selector: 'app-modal-list-goods',
  templateUrl: './modal-list-goods.component.html',
  styles: [],
})
export class ModalListGoodsComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  goods: IGood[] = [];
  dataFactGood: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private bsModalRef: BsModalRef,
    private opcion: ModalOptions,
    private readonly goodServices: GoodService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...COUNT_GOOD_COLUMNS },
      noDataMessage: 'No se encontrarón registros',
    };
  }

  ngOnInit(): void {
    this.loading = true;
    const idWarehouse = this.opcion.initialState;
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() =>
    //     this.getGoodByWarehouses({ ids: [Number(idWarehouse)] })
    //   );
    this.dataFactGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'description' ||
            filter.field == 'quantity' ||
            filter.field == 'fileNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoodByWarehouses({ ids: [Number(idWarehouse)] });
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() =>
        this.getGoodByWarehouses({ ids: [Number(idWarehouse)] })
      );
  }

  return() {
    this.bsModalRef.hide();
  }
  getGoodByWarehouses(body: Object): void {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodServices.getByWarehouse(body, params).subscribe({
      next: response => {
        this.goods = response.data;
        this.totalItems = response.count;
        this.dataFactGood.load(response.data);
        this.dataFactGood.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}
