import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { BasePage } from 'src/app/core/shared';
import { COLUMNS } from './columns';

export interface IAclaration {
  requestid: string;
  managementnumber: string;
  statusclarification: string;
}

@Component({
  selector: 'app-aclaration-table',
  templateUrl: './aclaration-table.component.html',
  styleUrls: ['./aclaration-table.component.css'],
})
export class AclarationTableComponent extends BasePage implements OnInit {
  private _solicitud: number;
  @Input() get solicitud() {
    return this._solicitud;
  }
  set solicitud(value) {
    if (value) {
      this._solicitud = value;
      this.getData();
    } else {
      this.notGetData();
    }
  }
  totalItems = 0;
  data: IAclaration[];
  dataTemp: IAclaration[];
  dataPaginated: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private requestService: RequestsService) {
    super();
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      actions: null,
    };
    this.searchNotServerPagination();
  }

  ngOnInit() {}

  private getData() {
    // let params = new FilterParams();
    this.requestService
      .spMantenimeto({
        parameter: '4',
        data: this.solicitud + '',
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response && response.data && response.data.length > 0) {
            this.data = response.data.map((row: any) => {
              return { ...row };
            });
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

  private notGetData() {
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

  private getPaginated(params: ListParams) {
    const cantidad = params.page * params.limit;
    this.dataPaginated.load([
      ...this.dataTemp.slice(
        (params.page - 1) * params.limit,
        cantidad > this.dataTemp.length ? this.dataTemp.length : cantidad
      ),
    ]);
    this.dataPaginated.refresh();
  }
}
