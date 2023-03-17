import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
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
    this.dinamicFilterUpdate();
    this.searchParams();
  }

  protected dinamicFilterUpdate() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
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
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getData();
        }
      });
  }

  searchParams() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: resp => {
        this.getData();
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
      this.service.getAll(params).subscribe({
        next: (response: any) => {
          if (response) {
            this.totalItems = response.count || 0;
            this.data.load(response.data);
            this.data.refresh();
            this.loading = false;
          }
        },
        error: err => {
          this.totalItems = 0;
          this.data.load([]);
          this.data.refresh();
          this.loading = false;
        },
      });
    } else {
      this.totalItems = 0;
      this.data.load([]);
      this.data.refresh();
      this.loading = false;
    }
  }
}
