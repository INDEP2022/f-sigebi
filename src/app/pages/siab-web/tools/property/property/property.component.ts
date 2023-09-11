import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { REAL_STATE_COLUMNS, REPORT_COLUMNS } from './property-columns';
//import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styles: [],
})
export class PropertyComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  totalItems1: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());

  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  columnFilters1: any = [];
  array: any = [];
  validator = true;
  show: boolean = false;
  showInm: boolean = true;

  loadingReport: boolean = false;
  excelLoading: boolean = false;

  settings1 = { ...this.settings };

  constructor(
    private goodSssubtypeService: GoodSssubtypeService,
    private goodProcessService: GoodProcessService,
    private goodServices: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        ...REAL_STATE_COLUMNS,
        seleccion: {
          title: 'Selección',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectDelegation(instance),
          sort: false,
          filter: false,
        },
      },
    };

    this.settings1 = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        ...REPORT_COLUMNS,
      },
    };
  }

  onSelectDelegation(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        let index;
        let validate = false;
        const existe = this.array.some(
          (numero: number) => numero === data.row.clasifGoodNumber
        );
        console.log(existe);
        if (existe) {
          index = this.array.findIndex(
            (numero: number) => numero === data.row.clasifGoodNumber
          );
          validate = true;
          console.log(index);
          this.array.splice(index, 1);
        } else {
          this.array.push(data.row.clasifGoodNumber);
        }
        console.log(this.array);
        if (this.array.length > 0) {
          this.validator = false;
          console.log(this.array.length);
        } else {
          this.validator = true;
        }
      },
    });
  }

  ngOnInit(): void {
    this.data
      .onChanged()
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
              case 'numClasifGoods':
                searchFilter = SearchFilter.EQ;
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
          this.getDataAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataAll());

    this.data1
      .onChanged()
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
              case 'numClasifGoods':
                searchFilter = SearchFilter.EQ;
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
          this.getDataAll();
        }
      });
  }

  getDataAll() {
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    param['filter.typeNumber'] = `$eq:6`;
    this.goodProcessService.getVGoodTpye(param).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  getDataGood() {
    this.loading = true;
    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };
    params['filter.goodClassNumber'] = `$in:${this.array}`;
    console.log(params);

    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: (response: any) => {
        //this.dataGood = response.data;
        this.totalItems1 = response.count;
        this.data1.load(response.data);
        this.data1.refresh();
        this.loading = false;
      },
      error: err => {
        console.log('error', err);
        this.totalItems1 = 0;
        this.data1.load([]);
        this.data1.refresh();
        // En caso de error, restaura this.array a su estado anterior
        this.array = [];
        this.loading = false;
      },
    });
  }

  rowsSelected(event: any) {
    //console.log(event.isSelected);
  }

  generateReport() {
    this.show = true;
    this.showInm = false;
    this.getDataGood();
  }

  onExportExcel() {
    if (this.array.length === 0 || this.totalItems1 === 0) {
      this.alert('warning', 'Debe seleccionar un valor', '');
      return;
    }
    this.loadingReport = true;
    this.Report().subscribe();
    this.loadingReport = false;
  }

  Report() {
    console.log(this.array);

    const array = this.array;
    console.log(array);

    this.excelLoading = true;

    return this.goodServices.getByExpedientAndParamsExport(this.array).pipe(
      catchError(error => {
        this.excelLoading = false;
        this.alert('error', 'Error', UNEXPECTED_ERROR);
        return throwError(() => error);
      }),
      tap(response => {
        this.excelLoading = false;
        this._downloadExcelFromBase64(
          response.base64File,
          `lfiarchivo-${this.array}`
        );
        console.log(response);
      })
    );
  }

  goBack() {
    this.show = false;
    this.showInm = true;
    this.array = [];
    this.validator = true;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataAll());
  }
}
