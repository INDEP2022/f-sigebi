import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExpenseService } from 'src/app/core/services/ms-expense_/good-expense.service';
import { BasePage } from 'src/app/core/shared';
import {
  FIGURES_PERIOD_COLUMNS,
  PERIOD_STATUS_COLUMNS,
} from './closure-monthly-columns';

@Component({
  selector: 'app-closure-monthly',
  templateUrl: './closure-monthly.component.html',
  styles: [],
})
export class ClosureMonthlyComponent extends BasePage implements OnInit {
  exchangeTypes: any[] = [];
  figuresPeriod: any[] = [];
  LocalDataExchange: LocalDataSource = new LocalDataSource();
  localDataFigures: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedRow: any;
  rowSelected: boolean = false;
  FigurestotalItems: number = 0;
  Figuresparams = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  btnOpen: boolean = false;
  btnClose: boolean = false;

  settings2 = {
    ...this.settings,
    hideSubHeader: false,
    actions: false,
    columns: FIGURES_PERIOD_COLUMNS,
  };

  constructor(private fb: FormBuilder, private expenseService: ExpenseService) {
    super();
    this.settings.columns = PERIOD_STATUS_COLUMNS;
    this.settings.actions = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.filterColumnsTableState();
    this.filterColumnsTableFigures();
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
    this.pupActivaBtn();
    this.loadPeriodTable();
  }

  loadStateTable() {
    this.exchangeTypes = [];
    this.LocalDataExchange.load(this.exchangeTypes);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.expenseService.getDataState(params).subscribe({
      next: response => {
        console.log('response DataState --> ', response);
        for (let i = 0; i < response.data.length; i++) {
          let params = {
            period: response.data[i].period,
            state: response.data[i].state,
          };
          this.exchangeTypes.push(params);
          this.LocalDataExchange.load(this.exchangeTypes);
          this.totalItems = response.count;
        }
      },
    });
  }

  loadPeriodTable() {
    let params = {
      ...this.Figuresparams.getValue(),
      ...this.columnFilters,
    };
    this.expenseService
      .getDataPeriod(params, this.selectedRow.period)
      .subscribe({
        next: response => {
          console.log('response DataState --> ', response);
          for (let i = 0; i < response.data.length; i++) {
            let params = {
              conceptnumber: response.data[i].conceptnumber,
              direct: response.data[i].direct,
              indirect: response.data[i].indirect,
            };
            this.figuresPeriod.push(params);
            this.localDataFigures.load(this.figuresPeriod);
            this.FigurestotalItems = response.count;
          }
        },
      });
  }

  open() {}

  close() {}

  pupActivaBtn() {
    if ((this.selectedRow.status = 'CERRADO')) {
      this.btnOpen = true;
      this.btnClose = false;
    } else if ((this.selectedRow.status = 'CERRADO')) {
      this.btnOpen = false;
      this.btnClose = true;
    }
  }

  filterColumnsTableState() {
    this.LocalDataExchange.onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'period':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'state':
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
          this.loadStateTable();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadStateTable());
  }

  filterColumnsTableFigures() {
    this.localDataFigures
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'conceptnumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'direct':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'indirect':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.EQ;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.Figuresparams = this.pageFilter(this.Figuresparams);
          this.loadPeriodTable();
        }
      });
    this.Figuresparams.pipe(takeUntil(this.$unSubscribe)).subscribe(() =>
      this.loadPeriodTable()
    );
  }
}
