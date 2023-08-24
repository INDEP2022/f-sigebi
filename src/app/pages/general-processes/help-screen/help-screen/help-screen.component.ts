import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ScreenHelpService } from 'src/app/core/services/ms-business-rule/screen-help.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { HELP_SCREEN_COLUMNS } from './help-screen-columns';

@Component({
  selector: 'app-help-screen',
  templateUrl: './help-screen.component.html',
  styles: [],
})
export class HelpScreenComponent extends BasePage implements OnInit {
  //Filtro en las tablas
  business: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject(new FilterParams());
  screen: string = null;

  constructor(
    private screenHelpService: ScreenHelpService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...HELP_SCREEN_COLUMNS },
    };
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.screen = params['screen'];
      });
  }

  ngOnInit(): void {
    this.columnsFilter().subscribe();
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => this.getBusiness(params).subscribe())
      )
      .subscribe();
  }

  columnsFilter() {
    return this.business.onChanged().pipe(
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

  getBusiness(params: FilterParams) {
    this.loading = true;
    params.sortBy = 'businessRoleNumber:ASC';
    params.addFilter('screenKey', this.screen);
    return this.screenHelpService.getAll(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        this.business.load([]);
        this.business.refresh();
        return throwError(() => error);
      }),
      tap(resp => {
        this.loading = false;
        this.totalItems = resp.count || 0;
        this.business.load(resp.data);
        this.business.refresh();
      })
    );
  }
}
