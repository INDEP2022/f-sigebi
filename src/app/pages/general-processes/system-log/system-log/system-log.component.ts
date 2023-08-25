import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BehaviorSubject,
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBinnacle } from 'src/app/core/models/ms-audit/binnacle.model';
import { Registers } from 'src/app/core/models/ms-audit/registers.model';
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
  paramsTemporal: FilterParams = new FilterParams();
  globalVars: any;
  registers: Registers;
  params = new BehaviorSubject(new ListParams());
  dynamicParams = new BehaviorSubject(new FilterParams());
  rowSelected: ITableLog = null;
  tableLogs: LocalDataSource = new LocalDataSource();
  dataFacRegister: LocalDataSource = new LocalDataSource();
  dynamicRegisters: any[] = [];
  totalLogs: number = 0;
  totalDynamic: number = 0;
  iBinnacles: IBinnacle[];
  filterFields: ITableField[] = [];
  registerNum: number = null;
  columnFilters: any = [];
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
  private origin: string;
  dynamicColumns: any = null;
  dynamicLoading = false;
  constructor(
    private tablesLogService: TablesLogService,
    private screenTableService: ScreenTableService,
    private tableFieldsService: TableFieldsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private seraLogService: SeraLogService
  ) {
    super();
    this.settings.columns = TABLE_LOGS_COLUMNS;
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
    this.registerSettings = { ...this.settings, columns: {} };
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.origin = params['origin'];
      });

    this.registers = new Registers();
    this.paramsTemporal = new FilterParams();
  }

  ngOnInit() {
    this.tableLogs
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            filter.field == 'destable'
              ? (searchFilter = SearchFilter.ILIKE)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getTableLogs();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.origin ? this.getTableLogsFiltered() : this.getTableLogs();
    });
    this.dynamicParams.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.rowSelected) {
        this.getDynamicRegisters(params).subscribe();
      }
    });
  }

  //Es la función que trae los nombres de las tablas para visualizarse en el Módulo
  getTableLogs(tables?: string[]): any {
    this.loading = true;
    // params.removeAllFilters();
    // params.addFilter('valid', 1);
    this.params.getValue()['filter.valid'] = 1;
    if (tables) {
      this.params.getValue()['filter.table'] = `$in:${tables.join(',')}`;
    }

    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    return this.tablesLogService.getAllFiltered(param).subscribe({
      next: response => {
        this.loading = false;
        this.tableLogs.load(response.data);
        this.tableLogs.refresh(); //Son todos los nombres de las tablas

        this.totalLogs = response.count;
        this.registers.table = response.data[0].table;
        // this.onSelectTable(this.tableLogs[0]); //Es la primer tabla que se setea
      },
      error: err => {
        this.loading = false;
      },
    });

    // .pipe(
    //   catchError(error => {

    //   }),
    //   tap(response => {

    //     // console.log(this.tableLogs[0]);
    //     // this.getDynamicRegistersInit().subscribe();
    //   })
    // );
  }

  getTableLogsFiltered() {
    const params = new ListParams();
    params.limit = 100;
    // params.addFilter('screen', this.origin);
    params['filter.screen'] = this.origin;
    // const logsParams = this.params.getValue();
    return this.screenTableService.getAllFiltered(params).pipe(
      map(response => response.data.map(screenTable => screenTable.board)),
      switchMap(tables => this.getTableLogs(tables))
    );
  }

  //Es la tabla que se escoge
  onSelectTable(row: ITableLog) {
    this.dynamicRegisters = [];
    this.totalDynamic = 0;
    this.rowSelected = null;
    this.getFilterFields(row.table).subscribe(() => {
      this.rowSelected = row;
    });
    this.getTableData();
  }

  //Son las columnas que salen en la tabla
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
        // TODO: Quitar el filtro cuando se arregle el endpoint
        this.filterFields = response.data.filter(field => field.table == table);
        console.warn(this.filterFields);

        this.dynamicColumns = generateColumnsFromFields(
          response.data.filter(field => field.table == table)
        );
      })
    );
  }

  handleErrorGoHome(message: string) {
    this.alertInfo('error', 'Error', message).then(() => {
      this.router.navigate([HOME_DEFAULT]);
    });
  }

  //Se ejecuta con el botón de Generar Filtrado
  getTableData() {
    const params = new FilterParams();
    this.dynamicParams.next(params);
  }

  getDynamicRegisters(params: FilterParams) {
    const filter = this.getFilter();
    this.dynamicLoading = true;
    return this.seraLogService
      .getDynamicTables(params.getParams(), filter)
      .pipe(
        catchError(error => {
          this.dynamicLoading = false;
          if (error.status >= 500) {
            this.alert(
              'error',
              'Ocurrió un error al obtener la información',
              ''
            );
          }
          return throwError(() => error);
        }),
        tap(response => {
          this.dynamicLoading = false;
          this.dynamicRegisters = response.data;
          this.totalDynamic = response.count;
        })
      );
  }

  //Es la información que se muestra en la tabla al escoger alguna en el Módulo de tablas
  getDynamicRegistersInit() {
    // this.registers.table = this.tableLogs[0].table;
    return this.seraLogService
      .getDynamicTables(this.paramsTemporal.getParams(), this.registers)
      .pipe(
        catchError(error => {
          this.dynamicLoading = false;
          if (error.status >= 500) {
            this.alert(
              'error',
              'Ocurrio un error al obtener la información',
              ``
            );
          }
          return throwError(() => error);
        }),
        tap(response => {
          this.dynamicLoading = false;
          this.dynamicRegisters = response.data;
          this.totalDynamic = response.count;
        })
      );
  }

  getFilter() {
    const table = this.rowSelected.table;
    const filters = this.filterForm.controls.filter.value
      .map(filter => {
        const operator =
          MATCH_OPERATORS[filter.dataType] ?? MATCH_OPERATORS.DEFAULT;
        return { column: filter.column, value: filter.value, operator };
      })
      .filter(filter => !isEmpty(filter.value));
    return { table, filters };
  }

  // cleandInfo() {
  //   this.loading = false;
  //   this.totalDynamic = 0;
  //   this.rowSelected = null;
  //   this.filterFields = null;
  //   this.dynamicColumns = null;
  //   this.dynamicParams = null;
  //   this.dynamicRegisters = null;
  //   this.router = null;
  //   this.dynamicLoading = false;
  //   this.totalLogs = 0;
  //   this.filterForm.reset();
  // }
}

const MATCH_OPERATORS: any = {
  NUMBER: 'IN',
  VARCHAR2: 'LIKE',
  DATE: '=',
  DEFAULT: '=',
};
