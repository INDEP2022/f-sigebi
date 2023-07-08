import { Component, Inject, inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { catchError, map, of, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IAreaTramite } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { ProceedingsDetailDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-detail-delivery-reception.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
  secondFormatDate,
} from 'src/app/shared/utils/date';
import { IProceedingDeliveryReception } from './../../../core/models/ms-proceedings/proceeding-delivery-reception';

@Component({
  template: '',
})
export abstract class ScheduledMaintenance extends BasePageWidhtDinamicFiltersExtra<IProceedingDeliveryReception> {
  form: FormGroup;
  first = true;
  @ViewChild(Ng2SmartTableComponent) table: Ng2SmartTableComponent;
  elementToExport: any[];
  pageSizeOptions = [5, 10, 15, 20];
  typeEvents: IAreaTramite[] = [];
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
  // oldLimit = 10;
  // data: IProceedingDeliveryReception[] = [];
  paramsTypes: ListParams = new ListParams();
  paramsStatus: ListParams = new ListParams();
  // params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new FilterParams();
  paramsCoords = new ListParams();
  paramsUsers = new FilterParams();
  delegationService = inject(DelegationService);
  userService = inject(UsersService);
  procedureManagementService = inject(ProcedureManagementService);
  limit: FormControl = new FormControl(10);
  constructor(
    protected fb: FormBuilder,
    protected deliveryService: ProceedingsDeliveryReceptionService,
    protected detailService: ProceedingsDetailDeliveryReceptionService,
    @Inject('formStorage') protected formStorage: string,
    @Inject('paramsActa') protected paramsActa: string
  ) {
    super();
    this.service = this.deliveryService;
    this.ilikeFilters = [
      'keysProceedings',
      'elaborate',
      'statusProceedings',
      'address',
      'witness1',
      'witness2',
      'comptrollerWitness',
      'observations',
    ];
    const paramsActa2 = localStorage.getItem(this.paramsActa);
    if (paramsActa2) {
      const params = JSON.parse(paramsActa2);
      this.params.value.limit = params.limit;
      this.params.value.page = params.page;
      this.limit = new FormControl(params.limit);
    }
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

    // const filter = this.data.getFilter();
    this.data.setFilter([], true, false);
    this.data.load([]);
    // console.log(filter);
    this.data.refresh();
    this.totalItems = 0;
    localStorage.removeItem(this.formStorage);
    localStorage.removeItem(this.paramsActa);
    this.limit = new FormControl(10);
    this.columnFilters = [];
    // this.dinamicFilterUpdate();
  }

  extraOperations() {}

  override searchParams() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        localStorage.setItem(
          this.paramsActa,
          JSON.stringify({ limit: response.limit, page: response.page })
        );
        this.getData(true);
      },
    });
  }

  override ngOnInit(): void {
    this.dinamicFilterUpdate();
    this.prepareForm();
    // this.searchParams();
    this.procedureManagementService
      .getAreaTramite()
      .pipe(
        catchError(x => of({ data: [] as IAreaTramite[], count: 0 })),
        map(response => {
          return response.data
            ? response.data.map(item => {
                return {
                  ...item,
                  descripcion:
                    item.area_tramite === 'RF' || item.area_tramite === 'OP'
                      ? item.descripcion
                      : 'ENTREGA-' + item.descripcion,
                };
              })
            : [];
        })
      )
      .subscribe({
        next: data => {
          if (data) {
            this.typeEvents = data;
            // this.typeEvents.unshift({
            //   area_tramite: 'OP',
            //   descripcion: 'OFICIALIA DE PARTES',
            // });
          }
        },
        error: err => {},
      });
    this.extraOperations();
    // this.deliveryService.getTypes().subscribe({
    //   next: response => {
    //     this.tiposEvento = response.data;
    //   },
    // });
    this.searchParams();
  }

  override dinamicFilterUpdate() {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        // debugger;
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            if (this.ilikeFilters.includes(filter.field)) {
              searchFilter = SearchFilter.ILIKE;
            } else {
              searchFilter = SearchFilter.EQ;
            }
            // if (this.ilikeFilters.includes(filter.field)) {
            //   searchFilter = SearchFilter.ILIKE;
            // }
            field = `filter.${filter.field}`;
            if (filter.search !== '') {
              let search = filter.search;
              if (filter.field === 'captureDate') {
                const initDate = firstFormatDateToSecondFormatDate(search);
                this.columnFilters[field] = `$btw:${initDate},${initDate}`;
              } else {
                this.columnFilters[field] = `${searchFilter}:${search}`;
              }
              // this.columnFilters[field] = `${searchFilter}:${search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getData();
        }
      });
  }

  setForm() {
    const filtersActa = window.localStorage.getItem(this.formStorage);
    if (filtersActa) {
      const newData = JSON.parse(filtersActa);
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
  }

  private fillParams(byPage = false) {
    // debugger;
    const tipoEvento = this.form.get('tipoEvento').value;
    // const fechaInicio: Date | string = this.form.get('fechaInicio').value;
    // const fechaFin: Date = this.form.get('fechaFin').value;
    const statusEvento = this.form.get('statusEvento').value;
    const coordRegional = this.form.get('coordRegional').value;
    const usuario = this.form.get('usuario').value;
    // const cveActa = this.form.get('claveActa').value;
    const rangeDate = this.form.get('rangeDate').value;
    if (this.form.invalid) {
      return false;
    }
    this.filterParams = new FilterParams();
    if (tipoEvento && tipoEvento !== 'TODOS') {
      this.filterParams.addFilter('typeProceedings', tipoEvento);
    }

    if (statusEvento && statusEvento !== 'TODOS') {
      this.filterParams.addFilter(
        'statusProceedings',
        statusEvento,
        SearchFilter.ILIKE
      );
    }

    if (rangeDate) {
      const inicio = secondFormatDate(rangeDate[0]);
      const final = secondFormatDate(rangeDate[1]);
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

    // this.columnFilters.forEach(x => {
    //   this.filterParams.addFilter2(x)
    // })
    for (var filter in this.columnFilters) {
      if (this.columnFilters.hasOwnProperty(filter)) {
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
        this.paramsActa,
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
          // if (response.data.length === 0) {
          //   this.onLoadToast('error', 'No se encontraron datos');
          // }
          (this.items = response.data.map(x => {
            return {
              ...x,
              captureDate: formatForIsoDate(x.captureDate, 'string') + '',
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
