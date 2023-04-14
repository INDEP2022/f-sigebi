import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, debounceTime, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
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
  constructor(private survillanceServise: SurvillanceService) {
    super();
    this.settings.columns = SURVEILLANCE_LOG_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = null;
  }

  generateFilterDynamically(
    data: { field: string; search: string; filter: any }[]
  ): void {
    const filters: {
      [key: string]: SearchFilter;
    } = {
      requestDate: SearchFilter.EQ,
      binnacleId: SearchFilter.EQ,
      attentionDate: SearchFilter.EQ,
      processMnto: SearchFilter.ILIKE,
      reasonMnto: SearchFilter.ILIKE,
      usrRequest: SearchFilter.ILIKE,
      usrRun: SearchFilter.ILIKE,
      usrAuthorize: SearchFilter.ILIKE,
      delegationNumber: SearchFilter.EQ,
    };

    const params = new FilterParams();
    data.forEach(item => {
      if (filters.hasOwnProperty(item.field) && item.search) {
        params.addFilter(item.field, item.search, filters[item.field]);
      }
    });
    this.filters = params;
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(res => {
      this.getSurveillanceBinnacles(res);
    });

    this.sources
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe), debounceTime(500))
      .subscribe(res => {
        if (res.action === 'filter') {
          this.generateFilterDynamically(res.filter.filters);
          this.getSurveillanceBinnacles(this.params.getValue());
        }
      });
  }

  getSurveillanceBinnacles(listParams: ListParams): void {
    this.loading = true;
    this.filters.limit = listParams.limit || 10;
    this.filters.page = listParams.page || 1;
    this.survillanceServise.getVigBinnacle(this.filters.getParams()).subscribe({
      next: res => {
        this.loading = false;
        this.totalItems = res.count;
        this.sources.load(res.data);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
