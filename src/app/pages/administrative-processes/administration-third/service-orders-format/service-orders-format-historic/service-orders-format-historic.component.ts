import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERVICEORDERSFORMATHISTORIC_COLUMNS } from './service-orders-format-historic-columns';

@Component({
  selector: 'app-service-orders-format-historic',
  templateUrl: './service-orders-format-historic.component.html',
  styles: [],
})
export class ServiceOrdersFormatHistoricComponent
  extends BasePage
  implements OnInit
{
  localData: LocalDataSource = new LocalDataSource();
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  Noformat: any;
  columnFilters: any = [];

  constructor(
    private modalRef: BsModalRef,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: SERVICEORDERSFORMATHISTORIC_COLUMNS,
    };
  }

  ngOnInit(): void {
    console.log('Noformat ', this.Noformat);
    this.filter();
  }
  close() {
    this.modalRef.hide();
  }
  getAllByNoFormat(id: any) {
    this.data1 = [];
    this.localData.load(this.data1);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodPosessionThirdpartyService
      .getAllStrategyLogById(id, params)
      .subscribe({
        next: response => {
          for (let i = 0; i < response.data.length; i++) {
            let paramsLog = {
              changeDate: response.data[i].changeDate,
              justification: response.data[i].justification,
              status: response.data[i].status,
              user: response.data[i].usrRegister.name,
            };
            this.data1.push(paramsLog);
            this.localData.load(this.data1);
            this.localData.refresh();
            this.totalItems = response.count;
          }
        },
      });
  }

  filter() {
    this.localData
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
              case 'changeDate':
                var raw = filter.search;
                var formatted = new DatePipe('en-EN').transform(
                  raw,
                  'yyyy-MM-dd',
                  'UTC'
                );
                filter.search = formatted;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'justification':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'user':
                field = 'filter.usrRegister.name';
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
          this.getAllByNoFormat(this.Noformat);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllByNoFormat(this.Noformat));
  }
}
