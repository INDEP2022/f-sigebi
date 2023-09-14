import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IHistoricGoodsAsegExtdom } from 'src/app/core/models/administrative-processes/history-good.model';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_HISTORICAL_GOODS_EXTDOM } from './historical-goods-extdom.columns';

@Component({
  selector: 'app-historical-goods-extdom',
  templateUrl: './historical-goods-extdom.component.html',
  styles: [],
})
export class HistoricalGoodsExtDomComponent extends BasePage implements OnInit {
  dataDocs: IListResponse<IHistoricGoodsAsegExtdom> =
    {} as IListResponse<IHistoricGoodsAsegExtdom>;

  //Declaraciones para ocupar filtrado
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private modalRef: BsModalRef,
    private msHistoryGoodService: HistoryGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      columns: COLUMNS_HISTORICAL_GOODS_EXTDOM,
      actions: { delete: false, add: false, edit: false, columnTitle: '' },
      rowClassFunction: (row: any) => {
        if (row.data.datefree == null) {
          return 'bg-danger text-white';
        } else {
          return 'bg-info text-white';
        }
      },
    };
    this.dataDocs.count = 0;
  }

  ngOnInit(): void {
    //Convertir los filterParams en ListParams
    const exist = this.filterParams.getValue().getFilterParams();

    if (exist) {
      const filters = exist.split('&');
      filters.map(fil => {
        const partsFilter = fil.split('=');
        this.columnFilters[partsFilter[0]] = partsFilter[1];
      });
    }

    //Filtrado por columnas
    this.data
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
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              userChange: () => (searchFilter = SearchFilter.EQ),
              userfree: () => (searchFilter = SearchFilter.EQ),
              invoiceUnivChange: () => (searchFilter = SearchFilter.EQ),
              invoiceUnivfree: () => (searchFilter = SearchFilter.EQ),
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
          this.getNotfications();
        }
      });

    //observador para el paginado
    this.paramsList
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getNotfications());
  }

  formData(data: IHistoricGoodsAsegExtdom) {
    this.modalRef.content.callback(true, data);
    this.modalRef.hide();
  }

  getNotfications() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    console.log(params);
    //Usar extends HttpService en los servicios para usar ListParams | string por si el service usa FiltersParams
    this.msHistoryGoodService
      .getAllFilterHistoricGoodsAsegExtdom(params)
      .subscribe({
        next: resp => {
          this.totalItems = resp.count;
          this.dataDocs = resp;
          this.data.load(resp.data);
          this.data.refresh();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.totalItems = 0;
          this.data.load([]);
          this.data.refresh();
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
