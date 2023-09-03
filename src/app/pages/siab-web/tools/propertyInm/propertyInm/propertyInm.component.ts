import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { UNEXPECTED_ERROR } from 'src/app/utils/constants/common-errors';
import { REAL_STATE_COLUMNS, REPORT_COLUMNS } from './propertyInm-columns';

//import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-propertyInd',
  templateUrl: './propertyInm.component.html',
  styles: [],
})
export class PropertyInmComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  totalItems1: number = 0;
  loadingReport: boolean = false;
  excelLoading = false;
  dataGood: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  settings1: any = [];
  data: LocalDataSource = new LocalDataSource();
  good: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  loading1 = false;
  columnFilters: any = [];
  array: any = [];
  constructor(
    private goodSssubtypeService: GoodSssubtypeService,
    private goodServices: GoodService,
    private goodprocessService: GoodprocessService
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
      ...this.settings1,
      actions: false,
      hideSubHeader: false,
      columns: {
        ...REPORT_COLUMNS,
      },
    };
  }

  private tempArray: any[] = [];

  onSelectDelegation(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        // Haz una copia del array antes de la acción de selección o deselección
        this.tempArray = [...this.array];
        console.log(data.toggle, data.row.clasifGoodNumber);
        if (data.toggle) {
          // Si el checkbox se selecciona, agregar el elemento al array
          if (!this.array.includes(data.row.clasifGoodNumber)) {
            this.array.push(data.row.clasifGoodNumber);
          }
        } else {
          // Si el checkbox se deselecciona, eliminar el elemento del array
          const index = this.array.indexOf(data.row.clasifGoodNumber);
          if (index !== -1) {
            this.array.splice(index, 1);
          }
        }
        console.log(this.array);

        // Ahora puedes realizar la consulta, teniendo en cuenta los cambios en this.array
        this.performQuery();
      },
    });
  }

  // Esta función realiza la consulta
  performQuery() {
    this.loading1 = true;
    this.dataGood = [];

    let params = {
      ...this.params1.getValue(),
      ...this.columnFilters1,
    };

    params['filter.goodClassNumber'] = `$in:${this.array}`;
    console.log(params);

    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: (response: any) => {
        this.dataGood = response.data;
        this.totalItems1 = response.count;
        this.good.load(response.data);
        this.good.refresh();
        this.loading1 = false;
      },
      error: err => {
        console.log('error', err);
        this.totalItems1 = 0;
        this.good.load([]);
        this.good.refresh();

        // En caso de error, restaura this.array a su estado anterior
        this.array = [...this.tempArray];

        this.loading1 = false;
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
              case 'clasifGoodNumber':
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

    this.params1
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.performQuery());
  }

  getDataAll() {
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    param['filter.typeNumber'] = `$eq:5`;
    console.log(param);
    this.goodprocessService.getGoodTypeMuebles(param).subscribe({
      next: (resp: any) => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  rowsSelected(event: any) {
    //console.log(event.isSelected);
  }

  onExportExcel() {
    if (this.array.length === 0 || this.totalItems1 === 0) {
      this.alert('warning', 'Debe seleccionar un valor', '');
      return;
    }
    this.loadingReport = true;
    this.generateReport().subscribe();
    this.loadingReport = false;
  }

  generateReport() {
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
}
