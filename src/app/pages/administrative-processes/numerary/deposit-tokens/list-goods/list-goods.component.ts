import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_COLUMNS } from './columns';

@Component({
  selector: 'app-list-goods',
  templateUrl: './list-goods.component.html',
  styles: [],
})
export class ListGoodsComponent extends BasePage implements OnInit {
  title: string = 'Listado de Bienes';
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  noCuenta: any;
  columnFilters: any = [];
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private readonly goodServices: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: GOODS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              id: () => (searchFilter = SearchFilter.EQ),
              fileNumber: () => (searchFilter = SearchFilter.ILIKE),
              goodClassNumber: () => (searchFilter = SearchFilter.EQ),
              descripcion: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getDataGoods();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getDataGoods();
    });
  }

  getDataGoods() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    params['filter.goodClassNumber'] = `$eq:1602`;
    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: async (response: any) => {
        console.log('response', response);
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
  close() {
    this.modalRef.hide();
  }
  goodSelect: any = null;
  async onCustomAction(event: any) {
    this.goodSelect = event.data;
    console.log('data', event);
  }

  async seleccionarBien() {}
}
