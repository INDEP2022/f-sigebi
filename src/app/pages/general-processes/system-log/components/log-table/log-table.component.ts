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
    (this.settings.columns = LOG_TABLE_COLUMNS),
      (this.settings.actions = false),
      (this.settings.hideSubHeader = false);
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
      .getAllByRegisterNum(this.registerNum, params.getParams())
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
          this.totalItems = response.count;
          console.log(this.binnacles);
          console.log(this.totalItems);
        })
      );
  }
}

/*
//SEGUNDA TABLA
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import { IBinnacle } from 'src/app/core/models/ms-audit/binnacle.model';
import { SeraLogService } from 'src/app/core/services/ms-audit/sera-log.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { LOG_TABLE_COLUMNS } from '../../utils/log-table-columns';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'system-log-table',
  templateUrl: './log-table.component.html',
  styles: [],
})
export class LogTableComponent extends BasePage implements OnInit, OnChanges {
  @Input() registerNum: number = null;
  params = new BehaviorSubject(new FilterParams());
  // binnacles: IBinnacle[] = [];
  binnacles: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  columnFilters: any = [];

  constructor(
    private seraLogService: SeraLogService,
  ) {
    super();
    this.settings.columns = LOG_TABLE_COLUMNS,
      this.settings.actions = false,
      this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.binnacles
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'modifictiondate':
                searchFilter = SearchFilter.EQ;
                break;
              case 'modificationuser':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cadmodif1':
                searchFilter = SearchFilter.EQ;
                break;
              case 'modif3':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              console.log(filter.search)
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params.value.page = 1;
          // this.params = this.pageFilter(this.params);

          // this.getBinnacleData(this.params);
        }
      });



    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.registerNum) {
        this.getBinnacleData(params).subscribe();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (changes['registerNum']) {
      if (this.registerNum != null) {
        const params = new FilterParams();
        this.params.next(params);
      } else {
        // this.binnacles = [];
        this.totalItems = 0;
      }
    }
  }

  getBinnacleData(params: FilterParams) {
    this.hideError();
    this.loading = true;
    return this.seraLogService
      .getAllByRegisterNum(this.registerNum, params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          if (error.status >= 500 || error.status >= 400) {
            this.onLoadToast('error', 'Warn', error.error.message);
            // this.binnacles = [];
          }
          return throwError(() => error);
        }),
        tap(response => {
          this.loading = false;
          const data = response.data
          this.binnacles.load(data);
          console.log(this.binnacles)
          this.totalItems = response.count;
        })
      );

      
  }
}



*/
