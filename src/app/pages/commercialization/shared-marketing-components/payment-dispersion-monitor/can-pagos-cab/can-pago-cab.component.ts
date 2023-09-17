import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_DETALLE, COLUMNS_PAGOS } from './columns';

@Component({
  selector: 'app-can-pagos-cab',
  templateUrl: './can-pagos-cab.component.html',
  styleUrls: [],
})
export class CanPagosCabComponent extends BasePage implements OnInit {
  data = new LocalDataSource();
  dataDetail = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  paramsDetail = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsDetail: number = 0;

  loading2: boolean = false;

  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: COLUMNS_PAGOS,
    hideSubHeader: false,
  };

  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: COLUMNS_DETALLE,
    hideSubHeader: false,
  };

  idEvent: any = null;

  constructor(
    private comerInvoiceService: ComerInvoiceService,
    private comerDetailsService: ComerDetailsService,
    private bsModal: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.getComers();

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
            switch (filter.field) {
              case 'idIdentifier':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'consecutive':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'area':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'document':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'aResponsible':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'clientRfc':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'concept':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'atthached':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'date':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'typePe':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'byPayment':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'orderDate':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'bank':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'userAuthorizes':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'parentTotalAmount':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'movementNumber':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'reference':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'paymentId':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'recordedOrderId':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              case 'oiDate':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'eventKey':
                searchFilter = SearchFilter.EQ;
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
          this.getComers();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      this.getComers();
    });
  }

  getComers() {
    this.loading = true;

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.idEvent != null
      ? (params['filter.idEvent'] = `$eq:${this.idEvent}`)
      : '';

    this.comerInvoiceService.getValidPayments2(params).subscribe(
      res => {
        console.log(res);
        this.data.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        this.alert('error', 'Se Presentó un Error Inesperado', '');
        this.data.load([]);
        this.totalItems = 0;
        this.loading = false;
      }
    );
  }

  selectComer(e: any) {
    console.log(e.data);

    this.paramsDetail.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      this.getDetailPayment(e.data.idIdentifier, e.data.idEvent);
    });
  }

  getDetailPayment(idIdentifier: string, idEvent: string) {
    this.loading2 = true;

    let params = {
      ...this.paramsDetail.getValue(),
    };

    params['filter.id'] = `$eq:${idIdentifier}`;
    params['filter.eventId'] = `$eq:${idEvent}`;

    this.comerDetailsService.getComerDetails2(params).subscribe(
      res => {
        console.log(res);
        this.dataDetail.load(res.data);
        this.totalItemsDetail = res.count;
        this.loading2 = false;
      },
      err => {
        console.log(err);
        this.dataDetail.load([]);
        this.totalItemsDetail = 0;
        this.loading2 = false;
      }
    );
  }

  close() {
    this.bsModal.hide();
  }
}
