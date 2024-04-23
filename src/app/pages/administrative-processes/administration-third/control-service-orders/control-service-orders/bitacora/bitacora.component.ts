import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StatusHistoryService } from 'src/app/core/services/ms-thirdparty-admon/thirdparty-admon.service';
import { BasePage } from 'src/app/core/shared';
import { BITACORA_COLUMNS } from '../control-service-orders-columns';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styles: [],
})
export class BitacoraComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  tableSource: LocalDataSource = new LocalDataSource();
  formatNumber: number;
  constructor(
    private statusHistoryService: StatusHistoryService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: false,
        position: 'right',
      },
      columns: { ...BITACORA_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.tableSource
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'justification':
                field = `filter.formatKey`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'changeDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'user':
                field = `filter.usrRegister`;
                searchFilter = SearchFilter.ILIKE;
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
          this.loadData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadData());
  }
  loadData() {
    this.loading = true;
    const params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.statusHistoryService
      .getAllByFormatNumber(this.formatNumber, params)
      .subscribe({
        next: value => {
          let result = value.data.map(item => {
            item['user'] = item.usrRegister ? item.usrRegister.id : null;
          });
          Promise.all(result).then(resp => {
            this.tableSource.load(value.data);
            this.tableSource.refresh();
            this.totalItems = value.count;
            this.loading = false;
          });
        },
        error: err => {
          this.tableSource.load([]);
          this.tableSource.refresh();
          this.totalItems = 0;
          this.loading = false;
        },
      });
  }
  close() {
    this.modalRef.hide();
  }
}
