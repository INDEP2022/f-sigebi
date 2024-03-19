import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
} from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS_LCS_WARRANTY } from './columns-warranty';

@Component({
  selector: 'app-can-lcs-warranty',
  templateUrl: './can-lcs-warranty.component.html',
  styleUrls: [],
})
export class CanLcsWarrantyComponent extends BasePage implements OnInit {
  data = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  idEvent: any = null;

  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: COLUMNS_LCS_WARRANTY,
    hideSubHeader: false,
  };

  constructor(
    private bsModal: BsModalRef,
    private comerLotService: LotService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();

    this.params.value.page = 1;
    this.params.value.limit = 10;

    this.columnsFilter().subscribe();

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      this.getData();
    });
  }

  close() {
    this.bsModal.hide();
  }

  columnsFilter() {
    return this.data.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => {
        console.log(dataSource);
        this.buildColumnFilter(dataSource);
      })
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    params.removeAllFilters();

    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        console.log(filter);
        const columns = this.settings.columns as any;
        let operator = columns[filter.field]?.operator;

        if (!filter.search) {
          return;
        }

        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.getData(params);
      // this.params.next(params);
    }
  }

  getData(paramsP?: FilterParams) {
    this.loading = true;
    const paramsF = new FilterParams();

    if (paramsP) {
      console.log(paramsP);
      paramsF.filters = paramsP.filters;
      paramsF.page = 1;
      paramsF.limit = this.params.value.limit;
    } else {
      paramsF.page = this.params.value.page;
      paramsF.limit = this.params.value.limit;
    }
    this.idEvent != null ? paramsF.addFilter('Event_ID', this.idEvent) : '';

    this.comerLotService.getLotComerRefGuarentee(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        this.data.load(res.data);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        this.loading = false;
        console.log(err);
        this.data.load([]);
        this.totalItems = 0;
      }
    );
  }
}
