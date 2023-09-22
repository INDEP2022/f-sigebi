import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBitacora } from 'src/app/core/models/ms-strategy-service/strategy-service.model';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IMPLEMENTATIONREPORTHISTORIC_COLUMNS } from './implementation-report-historic-columns';
@Component({
  selector: 'app-implementation-report-historic',
  templateUrl: './implementation-report-historic.component.html',
  styles: [],
})
export class ImplementationReportHistoricComponent
  extends BasePage
  implements OnInit
{
  data1: any[] = [];
  columnFilters: any = [];
  bitacoraList: IBitacora[];
  bitacoraLoad: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems3: number = 0;
  loading3: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,

      columns: IMPLEMENTATIONREPORTHISTORIC_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.bitacoraLoad
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            // this.cve = filter.field == 'cveActa';
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'formatNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'changeDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'justification':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'usrRegister':
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
          this.getBitacora();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBitacora());
  }
  getBitacora() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodPosessionThirdpartyService.getStrategyBitacora(params).subscribe({
      next: (data: any) => {
        const bitacora = data.data;
        this.bitacoraLoad.load(data.data);
        this.bitacoraLoad.refresh();
        this.totalItems3 = data.count;
      },
      error: () => (this.loading3 = false),
    });
  }

  close() {
    this.modalRef.hide();
  }
}
