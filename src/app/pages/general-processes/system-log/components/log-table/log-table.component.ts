import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SeraLogService } from 'src/app/core/services/ms-audit/sera-log.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LOG_TABLE_COLUMNS } from '../../utils/log-table-columns';

@Component({
  selector: 'system-log-table',
  templateUrl: './log-table.component.html',
  styles: [],
})
export class LogTableComponent extends BasePage implements OnInit, OnChanges {
  @Input() registerNum: number = null;
  params = new BehaviorSubject(new FilterParams());
  binnacles = new LocalDataSource();
  totalItems = 0;
  constructor(private seraLogService: SeraLogService) {
    super();
    this.settings.columns = LOG_TABLE_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (this.registerNum) {
            this.getBinnacleData(params).subscribe();
          }
        })
      )
      .subscribe();
  }

  columnsFilter() {
    return this.binnacles.onChanged().pipe(
      distinctUntilChanged(),
      debounceTime(500),
      takeUntil(this.$unSubscribe),
      tap(dataSource => this.buildColumnFilter(dataSource))
    );
  }

  buildColumnFilter(dataSource: any) {
    const params = new FilterParams();
    if (dataSource.action == 'filter') {
      const filters = dataSource.filter.filters;
      filters.forEach((filter: any) => {
        const columns = this.settings.columns as any;
        const operator = columns[filter.field]?.operator;
        if (!filter.search) {
          return;
        }
        params.addFilter(
          filter.field,
          filter.search,
          operator || SearchFilter.EQ
        );
      });
      this.params.next(params);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['registerNum']) {
      if (this.registerNum != null) {
        const params = new FilterParams();
        this.params.next(params);
      } else {
        this.binnacles.load([]);
        this.totalItems = 0;
      }
    }
  }

  getBinnacleData(params: FilterParams) {
    this.hideError();
    this.loading = true;
    return this.seraLogService
      .getLogData(this.registerNum, params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          if (error.status >= 500 || error.status >= 400) {
            this.binnacles.load([]);
          }
          return throwError(() => error);
        }),
        tap(response => {
          this.loading = false;
          this.binnacles.load(response.data);
          this.totalItems = response.count ?? 0;
          console.log(this.binnacles);
          console.log(this.totalItems);
        })
      );
  }
}
