import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBinnacle } from 'src/app/core/models/ms-audit/binnacle.model';
import { ITableField } from 'src/app/core/models/ms-audit/table-field.model';
import { ITableLog } from 'src/app/core/models/ms-audit/table-log.model';
import { SeraLogService } from 'src/app/core/services/ms-audit/sera-log.service';
import { TableFieldsService } from 'src/app/core/services/ms-audit/table-fieds.service';
import { TablesLogService } from 'src/app/core/services/ms-audit/tables-log.service';
import { ScreenTableService } from 'src/app/core/services/ms-screen-status/screen-table.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { HOME_DEFAULT } from 'src/app/utils/constants/main-routes';
import { isEmpty } from 'src/app/utils/validations/is-empty';
import { generateColumnsFromFields } from '../utils/functions/generate-columns.function';
import { TABLE_LOGS_COLUMNS } from '../utils/table-logs-columns';

@Component({
  selector: 'app-system-log',
  templateUrl: './system-log.component.html',
  styles: [],
})
export class SystemLogComponent extends BasePage implements OnInit {
  params = new BehaviorSubject(new FilterParams());
  dynamicParams = new BehaviorSubject(new FilterParams());
  binnacleParams = new BehaviorSubject(new FilterParams());
  rowSelected: ITableLog = null;
  tableLogs: ITableLog[] = [];
  dynamicRegisters: any[] = [];
  totalLogs = 0;
  totalDynamic = 0;
  filterFields: ITableField[] = [];
  binnacleLogs: IBinnacle[] = [];
  totalBinnacle = 0;
  registerNum: number = null;
  filterForm = this.fb.group({
    filter: this.fb.array<
      FormGroup<{
        registerNumber: FormControl<string | number>;
        table: FormControl<string>;
        column: FormControl<string>;
        columnDescription: FormControl<string>;
        dataType: FormControl<string>;
        value: FormControl<string>;
      }>
    >([]),
  });
  registerSettings: any;
  private readonly origin: string;
  dynamicColumns: any = null;
  constructor(
    private tablesLogService: TablesLogService,
    private screenTableService: ScreenTableService,
    private tableFieldsService: TableFieldsService,
    private router: Router,
    private fb: FormBuilder,
    private seraLogService: SeraLogService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: TABLE_LOGS_COLUMNS,
    };
    this.registerSettings = { ...this.settings, columns: {} };
  }

  ngOnInit(): void {
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        switchMap(params =>
          this.origin ? this.getTableLogsFiltered() : this.getTableLogs(params)
        )
      )
      .subscribe();

    this.dynamicParams.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.rowSelected) {
        this.getDynamicRegisters(params).subscribe();
      }
    });

    this.binnacleParams.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.registerNum) {
        this.getBinnacleLogs(params).subscribe();
      }
    });
  }

  getTableLogs(params: FilterParams, tables?: string[]) {
    this.loading = true;
    params.removeAllFilters();
    params.addFilter('valid', 1);
    if (tables) {
      params.addFilter('table', tables.join(','), SearchFilter.IN);
    }
    return this.tablesLogService.getAllFiltered(params.getParams()).pipe(
      catchError(error => {
        this.loading = false;
        return throwError(() => error);
      }),
      tap(response => {
        this.loading = false;
        this.tableLogs = response.data;
        this.totalLogs = response.count;
      })
    );
  }

  getTableLogsFiltered() {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('screen', this.origin);
    const logsParams = this.params.getValue();
    return this.screenTableService.getAllFiltered(params.getParams()).pipe(
      map(response => response.data.map(screenTable => screenTable.board)),
      switchMap(tables => this.getTableLogs(logsParams, tables))
    );
  }

  onSelectTable(row: ITableLog) {
    this.rowSelected = null;
    this.getFilterFields(row.table).subscribe(() => {
      this.rowSelected = row;
    });
  }

  getFilterFields(table: string) {
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('table', table);
    return this.tableFieldsService.getAllFiltered(params.getParams()).pipe(
      catchError(error => {
        this.handleErrorGoHome(
          'Ocurrio un error al obtener los campos de la tabla'
        );
        return throwError(() => error);
      }),
      tap(response => {
        this.filterFields = response.data;
        this.dynamicColumns = generateColumnsFromFields(response.data);
      })
    );
  }

  handleErrorGoHome(message: string) {
    this.alert('error', 'Error', message).then(() => {
      this.router.navigate([HOME_DEFAULT]);
    });
  }

  getTableData() {
    const params = new FilterParams();
    this.dynamicParams.next(params);
  }

  getDynamicRegisters(params: FilterParams) {
    const filter = this.getFilter();
    return this.seraLogService
      .getDynamicTables(params.getParams(), filter)
      .pipe(
        catchError(error => {
          if (error.status >= 500) {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al obtener la informac'
            );
          }
          return throwError(() => error);
        }),
        tap(response => {
          this.dynamicRegisters = response.data;
          this.totalDynamic = response.count;
        })
      );
  }

  getFilter() {
    const table = this.rowSelected.table;
    const filter = this.filterForm.controls.filter.value
      .map(filter => {
        const operator =
          MATCH_OPERATORS[filter.dataType] ?? MATCH_OPERATORS.DEFAULT;
        return { column: filter.column, value: filter.value, operator };
      })
      .filter(filter => !isEmpty(filter.value));
    return { table, filter };
  }

  onRegisterSelect(row: any) {
    const { no_registro } = row;
    this.registerNum = no_registro;
    const params = new FilterParams();
    this.binnacleParams.next(params);
  }

  getBinnacleLogs(params: FilterParams) {
    if (!this.registerNum) {
      return of();
    }
    this.hideError();
    return this.seraLogService
      .getAllByRegisterNum(this.registerNum, params.getParams())
      .pipe(
        catchError(error => {
          if (error.status >= 500) {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al obtener los registros de la bitacora'
            );
          }
          return throwError(() => error);
        }),
        tap(response => {
          this.binnacleLogs = response.data;
          this.totalBinnacle = response.count;
        })
      );
  }
}

const MATCH_OPERATORS: any = {
  NUMBER: 'IN',
  VARCHAR2: 'LIKE',
  DATE: '=',
  DEFAULT: '=',
};
