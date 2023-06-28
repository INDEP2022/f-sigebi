import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { distinctUntilChanged, throttleTime } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { takeUntil } from 'rxjs/operators';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
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
  haveInitialCharge = true;
  contador = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  service: ServiceGetAll<T>;
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
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            if (this.ilikeFilters.includes(filter.field)) {
              searchFilter = SearchFilter.ILIKE;
            } else {
              searchFilter = SearchFilter.EQ;
            }
            // if (this.ilikeFilters.includes(filter.field)) {
            //   searchFilter = SearchFilter.ILIKE;
            // }
            field = `filter.${filter.field}`;
            // let search = filter.search;
            // if (isNaN(+search)) {
            //   search = search + ''.toUpperCase();
            // }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
            console.log(this.columnFilters);
          });
          this.getData();
        }
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

  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.service) {
      this.service
        .getAll(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.totalItems = response.count || 0;
              this.data.load(response.data);
              this.data.refresh();
              this.loading = false;
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
