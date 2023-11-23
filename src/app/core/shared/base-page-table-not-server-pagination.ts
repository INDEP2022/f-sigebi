import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from '.';
import { IListResponseMessage } from '../interfaces/list-response.interface';
import { ServiceGetAll } from './base-page-dinamic-filters';

@Component({
  template: '',
})
export abstract class BasePageTableNotServerPagination<
  T = any
> extends BasePage {
  dataPaginated: LocalDataSource = new LocalDataSource();
  data: T[];
  dataTemp: T[];
  totalItems: number = 0;
  haveInitialCharge = true;
  params = new BehaviorSubject<ListParams>(new ListParams());
  service: ServiceGetAll<IListResponseMessage<T>>;
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
    // this.params.value.limit = 10000000;
    this.searchNotServerPagination();
    this.searchParams();
  }

  ngOnInit(): void {
    if (this.haveInitialCharge) {
      this.getData();
    }
  }

  getParams() {
    return {
      ...this.params.getValue(),
    };
  }

  searchParams() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: resp => {
        if (this.data) {
          this.getPaginated(resp);
        }
      },
    });
  }

  setTotals(data: T[]) {}

  getData() {
    // let params = new FilterParams();
    if (!this.service) {
      return;
    }
    let params = this.getParams();
    this.service
      .getAll({ ...params, limit: 100000000 })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response && response.data && response.data.length > 0) {
            this.data = response.data.map((row: any) => {
              return { ...row };
            });
            this.setTotals(this.data);
            this.totalItems = this.data.length;
            this.dataTemp = [...this.data];
            this.getPaginated(this.params.value);
            this.loading = false;
          } else {
            this.notGetData();
          }
        },
        error: err => {
          this.notGetData();
        },
      });
  }

  protected notGetData() {
    this.totalItems = 0;
    this.data = [];
    this.dataTemp = [];
    this.dataPaginated.load([]);
    this.dataPaginated.refresh();
    this.loading = false;
  }

  private searchNotServerPagination() {
    this.dataPaginated
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          // this.data = this.dataOld;
          // debugger;
          let filters = change.filter.filters;
          filters.map((filter: any, index: number) => {
            // console.log(filter, index);
            if (index === 0) {
              this.dataTemp = [...this.data];
            }
            this.dataTemp = this.dataTemp.filter((item: any) =>
              filter.search !== ''
                ? (item[filter['field']] + '')
                    .toUpperCase()
                    .includes((filter.search + '').toUpperCase())
                : true
            );
          });
          // this.totalItems = filterData.length;
          // console.log(this.dataTemp);
          this.totalItems = this.dataTemp.length;
          this.params.value.page = 1;
          this.getPaginated(this.params.getValue());
        }
      });
  }

  getPaginated(params: ListParams) {
    const cantidad = params.page * params.pageSize;
    this.dataPaginated.load([
      ...this.dataTemp.slice(
        (params.page - 1) * params.pageSize,
        cantidad > this.dataTemp.length ? this.dataTemp.length : cantidad
      ),
    ]);
    this.dataPaginated.refresh();
  }
}
