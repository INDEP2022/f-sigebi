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
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { columns } from './columns';

@Component({
  selector: 'app-all-expedients-modal',
  templateUrl: './all-expedients-modal.component.html',
  styleUrls: [],
})
export class AllExpedientsModal extends BasePage implements OnInit {
  data = new LocalDataSource();

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  searchFilter = new FilterParams();
  expedient: any;
  title: string;

  override settings = {
    ...TABLE_SETTINGS,
    columns: columns,
    actions: false,
    hideSubHeader: false,
  };

  constructor(
    private proceedingService: ProceedingsDeliveryReceptionService,
    private bsModalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAll();
    this.navigateTable();
    this.columnsFilter().subscribe();

    console.log(this.expedient);
  }

  navigateTable() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      this.getAll();
    });
  }

  getAll() {
    this.loading = true;

    const filter = new FilterParams();
    filter.page = this.params.value.page;
    filter.limit = this.params.value.limit;

    if (this.searchFilter.filters.length > 0) {
      filter.filters = this.searchFilter.filters;
    }

    this.expedient
      ? filter.addFilter('numFile', this.expedient, SearchFilter.EQ)
      : '';

    this.proceedingService.getProceeding2All(filter.getParams()).subscribe(
      res => {
        this.loading = false;
        console.log(res);
        this.data.load(res.data);
        this.totalItems = res.count;
      },
      err => {
        this.loading = false;
        this.alert('error', 'Error', 'Error al obtener los registros');
        console.log(err);
      }
    );
  }

  selectRow(event: any) {
    console.log(event);
  }

  close() {
    this.bsModalRef.hide();
  }

  columnsFilter() {
    return this.data.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        console.log(filter);
        const columns = this.settings.columns as any;
        let operator = columns[filter.field]?.operator;
        if (!filter.search) {
          params.removeAllFilters();
          return;
        }

        if (filter.field == 'statusProceedings') {
          operator = SearchFilter.IN;
        }

        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.searchFilter = params;

      this.getAll();
    }
  }
  // ...
}
