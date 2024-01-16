import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { distinctUntilChanged, Subscription, throttleTime } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { takeUntil } from 'rxjs/operators';
import {
  ListParamsFather,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  firstFormatDateToSecondFormatDate,
  secondFormatDate,
} from 'src/app/shared/utils/date';
import { BasePage } from './base-page';

export interface ServiceGetAll<T = any> {
  getAll(params?: any): Observable<T>;
}

@Component({
  template: '',
})
export abstract class BasePageWidhtDinamicFilters<T = any> extends BasePage {
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  columnFilters: any = [];
  // equalFilters: string[] = ['id'];
  ilikeFilters: string[] = ['description'];
  dateFilters: string[] = [];
  haveInitialCharge = true;
  contador = 0;
  params = new BehaviorSubject<ListParamsFather>(new ListParamsFather());
  service: ServiceGetAll<T>;
  subscription: Subscription = new Subscription();
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: true,
      },
    };
  }

  ngOnInit(): void {
    // debugger;
    this.dinamicFilterUpdate();
    this.searchParams();
  }

  protected dinamicFilterUpdate() {
    this.data
      .onChanged()
      .pipe(
        distinctUntilChanged(),
        throttleTime(500),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(change => {
        if (change.action === 'filter') {
          this.setFilters(change);
          this.getData();
        }
      });
  }

  getField(filter: any) {
    return `filter.${filter.field}`;
  }

  getSearchFilter(filter: any): SearchFilter {
    let searchFilter = SearchFilter.ILIKE;
    if (this.ilikeFilters.includes(filter.field)) {
      searchFilter = SearchFilter.ILIKE;
    } else {
      searchFilter = SearchFilter.EQ;
    }
    return searchFilter;
  }

  fillColumnFilters(
    haveFilter: boolean,
    field: string,
    filter: any,
    searchFilter: SearchFilter
  ) {
    if (filter.search !== '') {
      let newSearch = filter.search;
      console.log(newSearch);
      if (this.dateFilters.includes(filter.field)) {
        if (newSearch instanceof Date) {
          newSearch = secondFormatDate(newSearch);
        } else if ((newSearch + '').includes('/')) {
          newSearch = firstFormatDateToSecondFormatDate(newSearch);
        }
      }
      this.columnFilters[field] = `${searchFilter}:${newSearch}`;
      haveFilter = true;
    } else {
      delete this.columnFilters[field];
    }
    if (haveFilter) {
      this.params.value.page = 1;
    }
  }

  setFilters(change: any) {
    let haveFilter = false;

    let filters = change.filter.filters;
    filters.map((filter: any) => {
      let field = ``;
      let searchFilter = this.getSearchFilter(filter);
      // if (this.ilikeFilters.includes(filter.field)) {
      //   searchFilter = SearchFilter.ILIKE;
      // }
      field = this.getField(filter);
      // let search = filter.search;
      // if (isNaN(+search)) {
      //   search = search + ''.toUpperCase();
      // }
      this.fillColumnFilters(haveFilter, field, filter, searchFilter);
      console.log(this.columnFilters);
    });
  }

  searchParams() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: resp => {
        if (this.haveInitialCharge || this.contador > 0) {
          this.getData();
        }
        this.contador++;
      },
    });
  }

  getParams() {
    return {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
  }

  extraOperationsGetData() {}

  getData() {
    this.loading = true;
    let params = this.getParams();
    if (this.service) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = this.service
        .getAll(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.totalItems = response.count || 0;
              console.log(response);

              this.data.load(response.data);
              this.data.refresh();
              this.loading = false;
              this.extraOperationsGetData();
            }
          },
          error: err => {
            this.dataNotFound();
          },
        });
    } else {
      this.dataNotFound();
    }
  }

  protected dataNotFound() {
    this.totalItems = 0;
    this.data.load([]);
    this.data.refresh();
    this.loading = false;
  }
}
