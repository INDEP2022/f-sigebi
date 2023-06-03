import { Component, Inject, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IProceedingDeliveryReception } from './../../../core/models/ms-proceedings/proceeding-delivery-reception';

@Component({
  template: '',
})
export abstract class ScheduledMaintenance extends BasePageWidhtDinamicFiltersExtra<IProceedingDeliveryReception> {
  form: FormGroup;
  first = true;
  @ViewChild(Ng2SmartTableComponent) table: Ng2SmartTableComponent;
  elementToExport: any[];

  like = SearchFilter.LIKE;
  hoy = new Date();
  settings1 = {
    ...TABLE_SETTINGS,
    pager: {
      display: false,
    },
    hideSubHeader: false,
    selectedRowIndex: -1,
    mode: 'external',
    actions: {
      ...TABLE_SETTINGS.actions,
      columnTitle: '',
      position: 'left',
      add: false,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'string',
        sort: false,
      },
      // typeProceedings: {
      //   title: 'Tipo de Evento',
      //   type: 'string',
      //   sort: false,
      // },
      keysProceedings: {
        title: 'Programa Recepción Entrega',
        type: 'string',
        sort: false,
      },
      captureDate: {
        title: 'Fecha Captura',
        type: Date,
        sort: false,
        // width: '150px'
      },
      elaborate: {
        title: 'Ingresó',
        type: 'string',
        sort: false,
      },
      statusProceedings: {
        title: 'Estatus Evento',
        type: 'number',
        sort: false,
      },
      address: {
        title: 'Dirección',
        sort: false,
      },
      numFile: {
        title: 'No. Archivo',
        sort: false,
      },
      witness1: {
        title: 'Testigo 1',
        sort: false,
      },
      witness2: {
        title: 'Testigo 2',
        sort: false,
      },
      comptrollerWitness: {
        title: 'Testigo Contraloría',
        sort: false,
      },
      observations: {
        title: 'Observaciones',
        sort: false,
      },
    },
    rowClassFunction: (row: any) => {
      return row?.data?.statusProceedings;
    },
    noDataMessage: 'No se encontrarón registros',
  };
  statusList = [
    { id: 'ABIERTA', description: 'Abierto' },
    { id: 'CERRADA', description: 'Cerrado' },
  ];
  stringPattern = STRING_PATTERN;
  // data: IProceedingDeliveryReception[] = [];
  paramsTypes: ListParams = new ListParams();
  paramsStatus: ListParams = new ListParams();
  tiposEvento: { id: string; description: string }[] = [];
  // params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new FilterParams();
  paramsCoords = new ListParams();
  paramsUsers = new FilterParams();
  delegationService = inject(DelegationService);
  userService = inject(UsersService);
  constructor(
    protected fb: FormBuilder,
    protected deliveryService: ProceedingsDeliveryReceptionService,
    protected detailService: ProceedingsDetailDeliveryReceptionService,
    @Inject('formStorage') protected formStorage: string
  ) {
    super();
    this.service = this.deliveryService;
    this.ilikeFilters = [
      'keysProceedings',
      'captureDate',
      'elaborate',
      'statusProceedings',
      'address',
      'witness1',
      'witness2',
      'comptrollerWitness',
      'observations',
    ];
    // this.maxDate = new Date();
    // console.log(this.settings1);
  }

  // get fechaInicio() {
  //   return this.form.get('fechaInicio');
  // }

  // get coordRegional() {
  //   return this.delegationService.getAll(this.paramsCoords);
  // }

  get usuarios() {
    return this.userService.getAllSegUsers(this.paramsUsers.getParams());
  }

  get rangeDateValue() {
    return this.form
      ? this.form.get('rangeDate')
        ? this.form.get('rangeDate').value
        : null
      : null;
  }

  deleteRange() {
    this.form.get('rangeDate').setValue(null);
  }

  resetView() {
    console.log('RESET VIEW');
    this.data = new LocalDataSource();
    this.totalItems = 0;
    localStorage.removeItem(this.formStorage);
    this.columnFilters = [];
  }

  extraOperations() {}

  protected updateByPaginator() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        console.log(response);

        this.getData(true);
      },
    });
  }

  override ngOnInit(): void {
    this.dinamicFilterUpdate();
    // this.searchParams();
    this.extraOperations();
    this.prepareForm();
    this.deliveryService.getTypes().subscribe({
      next: response => {
        this.tiposEvento = response.data;
      },
    });
    this.updateByPaginator();
  }

  setForm() {
    const filtersActa = window.localStorage.getItem(this.formStorage);
    if (filtersActa) {
      const newData = JSON.parse(filtersActa);
      console.log(newData);
      if (newData.rangeDate) {
        const inicio = newData.rangeDate[0].split('T')[0];
        const final = newData.rangeDate[1].split('T')[0];
        newData.rangeDate = [new Date(inicio), new Date(final)];
      }
      // const fechaInicio = newData.fechaInicio
      //   ? new Date(newData.fechaInicio)
      //   : null;
      // const fechaFin = newData.fechaFin ? new Date(newData.fechaFin) : null;
      // newData.rangeDate = [fechaInicio, fechaFin];
      this.form.setValue(newData);
    }
  }

  saveForm() {
    if (this.form) {
      let form = this.form.getRawValue();
      console.log(form);

      // if (!form.rangeDate) {
      //   form.rangeDate = null;
      // }
      // if (!form.fechaInicio) {
      //   form.fechaInicio = null;
      // }
      // if (!form.fechaFin) {
      //   form.fechaFin = null;
      // }
      window.localStorage.setItem(this.formStorage, JSON.stringify(form));
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      tipoEvento: [null, [Validators.required]],
      rangeDate: [null],
      // fechaInicio: [null],
      // fechaFin: [null],
      statusEvento: [null],
      coordRegional: [null, [Validators.pattern(STRING_PATTERN)]],
      usuario: [null, [Validators.pattern(STRING_PATTERN)]],
      claveActa: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.setForm();
    console.log(this.form.value);
  }

  private fillParams(byPage = false) {
    debugger;
    const tipoEvento = this.form.get('tipoEvento').value;
    // const fechaInicio: Date | string = this.form.get('fechaInicio').value;
    // const fechaFin: Date = this.form.get('fechaFin').value;
    const statusEvento = this.form.get('statusEvento').value;
    const coordRegional = this.form.get('coordRegional').value;
    const usuario = this.form.get('usuario').value;
    // const cveActa = this.form.get('claveActa').value;
    const rangeDate = this.form.get('rangeDate').value;
    console.log(rangeDate);
    if (this.form.invalid) {
      return false;
    }
    this.filterParams = new FilterParams();
    if (tipoEvento && tipoEvento !== 'TODOS') {
      console.log(tipoEvento);
      this.filterParams.addFilter('typeProceedings', tipoEvento);
    }

    if (statusEvento && statusEvento !== 'TODOS') {
      this.filterParams.addFilter('statusProceedings', statusEvento);
    }

    if (rangeDate) {
      const inicio = rangeDate[0].toISOString().split('T')[0];
      const final = rangeDate[1].toISOString().split('T')[0];
      this.filterParams.addFilter(
        'captureDate',
        inicio + ',' + final,
        SearchFilter.BTW
      );
      // rangeDate instanceof Date
      //   ? fechaInicio.toISOString().split('T')[0]
      //   : fechaInicio;
    }
    // if (fechaInicio) {
    //   const inicio =
    //     fechaInicio instanceof Date
    //       ? fechaInicio.toISOString().split('T')[0]
    //       : fechaInicio;
    //   const final = fechaFin
    //     ? fechaFin.toISOString().split('T')[0]
    //     : new Date().toISOString().split('T')[0];
    //   this.filterParams.addFilter(
    //     'captureDate',
    //     inicio + ',' + final,
    //     SearchFilter.BTW
    //   );
    // }
    console.log(coordRegional);
    if (coordRegional && coordRegional.length > 0) {
      this.filterParams.addFilter(
        'numDelegation_1.description',
        coordRegional,
        SearchFilter.IN
      );
    }

    // if (cveActa) {
    //   this.filterParams.addFilter('keysProceedings', cveActa);
    // }
    if (usuario) {
      this.filterParams.addFilter('elaborate', usuario, SearchFilter.LIKE);
    }
    console.log(this.columnFilters);

    // this.columnFilters.forEach(x => {
    //   this.filterParams.addFilter2(x)
    // })
    for (var filter in this.columnFilters) {
      if (this.columnFilters.hasOwnProperty(filter)) {
        console.log(this.columnFilters[filter]);
        this.filterParams.addFilter3(filter, this.columnFilters[filter]);
      }
    }
    // this.filterParams.addFilter2(this.columnFilters);
    this.filterParams.limit = this.params.getValue().limit;
    if (byPage) {
      this.filterParams.page = this.params.getValue().page;
    } else {
      this.params.value.page = 1;
      localStorage.setItem(
        'paramsActa',
        JSON.stringify({ limit: this.params.getValue().limit, page: 1 })
      );
      // this.params.value.limit = 10;
    }

    return true;
  }

  override getData(byPage = false) {
    if (!this.form) {
      return;
    }
    this.saveForm();
    // this.fillParams()
    if (this.fillParams(byPage)) {
      this.loading = true;
      this.service.getAll(this.filterParams.getParams()).subscribe({
        next: response => {
          console.log(response);
          // if (response.data.length === 0) {
          //   this.onLoadToast('error', 'No se encontraron datos');
          // }
          (this.items = response.data.map(x => {
            return {
              ...x,
              captureDate: format(new Date(x.captureDate), 'dd/MM/yyyy'),
            };
          })),
            this.data.load(this.items);
          this.totalItems = response.count;
          this.loading = false;
          // setTimeout(() => {
          //   this.fillElementsToExport();
          // }, 500);
        },
        error: error => {
          console.log(error);
          // this.onLoadToast('error', 'No se encontraron datos');
          this.data.load([]);
          this.totalItems = 0;
          this.loading = false;
        },
      });
    } else {
      if (!this.first) this.form.markAllAsTouched();
    }
    this.first = false;
  }

  // abstract fillElementsToExport(): void;
}
