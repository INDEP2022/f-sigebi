import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared';
import { GOODS_COLUMNS } from './kitchenware-colums';

@Component({
  selector: 'app-kitchenware-modal-good',
  templateUrl: './kitchenware-modal-good.component.html',
  styles: [],
})
export class KitchenwareModalGoodComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  expedient: string;
  goods: any;
  constructor(
    private readonly goodServices: GoodService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: GOODS_COLUMNS,
    };
    this.settings.actions = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'goodId':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.searchGoods();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchGoods());
  }
  searchGoods() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    // this.paramsSubject.getValue = paramsSubject;
    this.goodServices.getByExpedient(this.expedient, params).subscribe({
      next: response => {
        //Son todos los bienes listados en el input "Seleccione un bien para ver sus menajes"
        // this.goodSelect.enable();
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
        this.alert('warning', 'Expediente sin Bienes Asociados', ``);
      },
    });
  }
  selectRow(data: any) {
    this.goods = data;
  }
  select() {
    this.modalRef.content.callback(this.goods);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
