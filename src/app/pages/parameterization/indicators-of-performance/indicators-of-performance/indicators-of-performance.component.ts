import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDetailIndParameter } from 'src/app/core/models/catalogs/detail-ind-parameter.model';
import { IIndicatorsParamenter } from 'src/app/core/models/catalogs/indicators-parameter.model';

import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { DetailIndParameterService } from 'src/app/core/services/catalogs/detail-ind-parameter.service';
import { IndicatorsParameterService } from 'src/app/core/services/catalogs/indicators-parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IndicatorsOfPerformanceFormComponent } from '../indicators-of-performance-form/indicators-of-performance-form.component';
import {
  INDICATORSOFPERFORMANCE_COLUMNS,
  INDICATORSPERFORMANCE_COLUMNS,
} from './indicators-of-performance-columns';

@Component({
  selector: 'app-indicators-of-performance',
  templateUrl: './indicators-of-performance.component.html',
  styles: [],
})
export class IndicatorsOfPerformanceComponent
  extends BasePage
  implements OnInit
{
  indicatorsOfPerformanceForm: FormGroup;
  settings2 = { ...this.settings };

  indicatorsParamenter: IIndicatorsParamenter[] = [];
  data1: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  detailIndParameter: IDetailIndParameter[] = [];
  data2: LocalDataSource = new LocalDataSource();
  columnFilters2: any = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  typeItem: any[];
  typeItem1: any[];
  rowSelecct: boolean = false;
  page: string | number;
  constructor(
    private fb: FormBuilder,
    private indicatorsParameterService: IndicatorsParameterService,
    private detailIndParameterService: DetailIndParameterService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: INDICATORSOFPERFORMANCE_COLUMNS,
    };
    // this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
    this.settings2.columns = INDICATORSPERFORMANCE_COLUMNS;
    this.settings2 = {
      ...this.settings2,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
    };
  }
  ngOnInit(): void {
    this.data1
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
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'procedureAreaDetails':
                // searchFilter = SearchFilter.EQ;
                filter.field == 'procedureAreaDetails';
                field = `filter.${filter.field}.description`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters1[
                  field
                ] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getValuesAll();
        }
      });
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'indicatorNumber':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.getDetailIndParameterAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());

    /*this.prepareForm();
    this.typeItem = [
      { label: 'Fec. Recepción/Escaneo', value: 'FRECEPCION' },
      { label: 'Fecha de Inicio', value: 'FINICIA' },
    ];
    this.typeItem1 = [
      { label: 'Fec. Término/Desahogo', value: 'FFINALIZA' },
      { label: 'Fecha de Escaneo', value: 'FESCANEO' },
    ];*/
  }
  /*private prepareForm() {
    this.indicatorsOfPerformanceForm = this.fb.group({
      initialDate: [null, Validators.required],
      endDate: [null, Validators.required],
      daysLimNumber: [null, Validators.required],
      hoursLimNumber: [null, Validators.required],
      contractZoneKey: [null, Validators.required],
      initialDDate: [null, Validators.required],
      endDDate: [null, Validators.required],
      indicatorNumber: [null],
    });
  }*/
  getValuesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters1,
    };
    this.indicatorsParameterService.getAll(params).subscribe({
      next: response => {
        console.log('response:', response);
        this.indicatorsParamenter = response.data;
        console.log(this.indicatorsParamenter);

        this.data1.load(this.indicatorsParamenter);
        this.data1.refresh();

        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems = 0;
      },
    });
  }
  getDetailIndParameterAll(id?: string | number) {
    this.loading = true;
    if (id) {
      this.params2.getValue()['filter.indicatorNumber'] = id;
    }
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    this.detailIndParameterService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.detailIndParameter = response.data;
        this.data2.load(this.detailIndParameter);
        this.data2.refresh();
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems2 = 0;
      },
    });
  }
  rowsSelected(event: any) {
    console.log(event);
    this.page = event.data.id;
    /*this.indicatorsOfPerformanceForm.controls['indicatorNumber'].setValue(
      event.data.id
    );*/
    this.rowSelecct = true;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDetailIndParameterAll(event.data.id));
  }
  confirm() {
    console.log(
      this.indicatorsOfPerformanceForm.controls['indicatorNumber'].value
    );
    console.log(this.indicatorsOfPerformanceForm.value);
    if (
      this.indicatorsOfPerformanceForm.controls['indicatorNumber'].value != null
    ) {
      this.loading = true;
      console.log(this.indicatorsOfPerformanceForm.value);
      this.detailIndParameterService
        .create(this.indicatorsOfPerformanceForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    } else {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Se debe seleccionar un Indicador'
      );
    }
  }
  handleSuccess() {
    const message: string = 'Guardado';
    this.onLoadToast(
      'success',
      'Indicadores de Desempeño',
      `${message} Correctamente`
    );
    this.loading = false;
    this.indicatorsOfPerformanceForm.reset();
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDetailIndParameterAll());
  }

  openForm(event?: any) {
    const indicatorNumber = this.page;
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      event,
      indicatorNumber,
      callback: (next: boolean) => {
        if (next)
          this.params2
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getDetailIndParameterAll(indicatorNumber));
      },
    };
    this.modalService.show(IndicatorsOfPerformanceFormComponent, modalConfig);
  }
}
