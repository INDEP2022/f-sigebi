import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SURVEILLANCE_LOG_COLUMNS } from './surveillance-log-columns';

@Component({
  selector: 'app-surveillance-log',
  templateUrl: './surveillance-log.component.html',
  styles: [],
})
export class SurveillanceLogComponent extends BasePage implements OnInit {
  // surveillance: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  sources = new LocalDataSource();
  filters = new FilterParams();
  columnsD: IDelegation[] = [];
  columnFilters: any = [];
  parameterData: any[] = [];

  constructor(
    private survillanceServise: SurvillanceService,
    private delegationService: DelegationService
  ) {
    super();
    this.settings.columns = SURVEILLANCE_LOG_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = null;
  }

  /*generateFilterDynamically(
    data: { field: string; search: string; filter: any }[]
  ): void {
    const filters: {
      [key: string]: SearchFilter;
    } = {
      requestDate: SearchFilter.ILIKE,
      binnacleId: SearchFilter.EQ,
      attentionDate: SearchFilter.ILIKE,
      processMnto: SearchFilter.ILIKE,
      reasonMnto: SearchFilter.ILIKE,
      usrRequest: SearchFilter.ILIKE,
      usrRun: SearchFilter.ILIKE,
      usrAuthorize: SearchFilter.ILIKE,
      delegation: SearchFilter.ILIKE,
    };

    const params = new FilterParams();
    data.forEach(item => {
      if (filters.hasOwnProperty(item.field) && item.search) {
        params.addFilter(item.field, item.search, filters[item.field]);
      }
    });
    this.filters = params;
  }*/

  ngOnInit(): void {
    this.sources
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'binnacleId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'requestDate':
                console.log('dddd', filter.search);
                if (filter.search != null) {
                  filter.search = this.returnParseDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                console.log('ddddccc', filter.search);

                break;
              case 'attentionDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'reasonMnto':
                searchFilter = SearchFilter.EQ;
                break;
              case 'delegation':
                // searchFilter = SearchFilter.EQ;
                filter.field == 'delegation';
                field = `filter.${filter.field}.description`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log('this.param:', this.params);
              this.params.value.page = 1;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getSurveillanceBinnacles();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getSurveillanceBinnacles();
    });
  }

  getSurveillanceBinnacles(): void {
    this.loading = true;

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.survillanceServise.getVigBinnacle(params).subscribe({
      next: res => {
        this.parameterData = res.data;
        this.sources.load(res.data);
        this.sources.refresh();
        this.totalItems = res.count || 0;
        this.sources.load(res.data);
        this.loading = false;
        //console.log('res', res);
      },
      error: err => {
        //this.onLoadToast('error', err.error.message, '');
        this.alert('error', 'No se encontraron registros', '');
        this.loading = false;
        this.sources.load([]);
        this.sources.refresh();
        this.totalItems = 0;
      },
    });
  }

  getDelegation() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
    };

    this.delegationService.getAll2(params).subscribe({
      next: response => {
        this.columnsD = response.data;
        this.totalItems = response.count || 0;

        this.sources.load(response.data);
        this.sources.refresh();
        this.loading = false;
        console.log(response);
      },
      error: error => (this.loading = false),
    });
  }

  /*async getSurveillanceBinnaclesV(listParams: ListParams): void {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    }
  }*/
}
