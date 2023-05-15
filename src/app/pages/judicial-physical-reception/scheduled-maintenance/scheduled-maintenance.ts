import { Component, Inject, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IProceedingDeliveryReception } from './../../../core/models/ms-proceedings/proceeding-delivery-reception';

@Component({
  template: '',
})
export abstract class ScheduledMaintenance extends BasePage {
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
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      id: {
        title: 'ID',
        type: 'string',
        sort: false,
      },
      keysProceedings: {
        title: 'Programa Recepcion Entrega',
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
        title: 'Ingreso',
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
        title: 'N° Archivo',
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
        title: 'Testigo Contraloria',
        sort: false,
      },
      observations: {
        title: 'Observaciones',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  statusList = [
    { id: 'ABIERTA', description: 'Abierto' },
    { id: 'CERRADA', description: 'Cerrado' },
  ];
  data: IProceedingDeliveryReception[] = [];
  totalItems: number = 0;
  paramsTypes: ListParams = new ListParams();
  paramsStatus: ListParams = new ListParams();
  tiposEvento: { id: string; description: string }[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new FilterParams();
  paramsCoords = new ListParams();
  paramsUsers = new FilterParams();
  delegationService = inject(DelegationService);
  userService = inject(UsersService);
  constructor(
    protected fb: FormBuilder,
    protected service: ProceedingsDeliveryReceptionService,
    protected detailService: ProceedingsDetailDeliveryReceptionService,
    @Inject('formStorage') protected formStorage: string
  ) {
    super();
    // this.maxDate = new Date();
    // console.log(this.settings1);
  }

  get fechaInicio() {
    return this.form.get('fechaInicio');
  }

  get coordRegional() {
    return this.delegationService.getAll(this.paramsCoords);
  }

  get usuarios() {
    return this.userService.getAllSegUsers(this.paramsUsers.getParams());
  }

  ngOnInit(): void {
    this.prepareForm();
    this.service.getTypes().subscribe({
      next: response => {
        this.tiposEvento = response.data;
      },
    });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(x => {
      // console.log(x);
      this.getData();
    });
  }

  setForm() {
    const filtersActa = window.localStorage.getItem(this.formStorage);
    if (filtersActa) {
      const newData = JSON.parse(filtersActa);
      newData.fechaInicio = newData.fechaInicio
        ? new Date(newData.fechaInicio)
        : null;
      newData.fechaFin = newData.fechaFin ? new Date(newData.fechaFin) : null;
      this.form.setValue(newData);
    }
  }

  saveForm() {
    let form = this.form.getRawValue();
    if (!form.fechaInicio) {
      form.fechaInicio = null;
    }
    if (!form.fechaFin) {
      form.fechaFin = null;
    }
    window.localStorage.setItem(this.formStorage, JSON.stringify(form));
  }

  prepareForm() {
    this.form = this.fb.group({
      tipoEvento: [null, [Validators.required]],
      fechaInicio: [null],
      fechaFin: [null],
      statusEvento: [null],
      coordRegional: [null, [Validators.pattern(STRING_PATTERN)]],
      usuario: [null, [Validators.pattern(STRING_PATTERN)]],
      claveActa: [null],
    });
    this.setForm();
    console.log(this.form.value);
  }

  private fillParams() {
    const tipoEvento = this.form.get('tipoEvento').value;
    const fechaInicio: Date | string = this.form.get('fechaInicio').value;
    const fechaFin: Date = this.form.get('fechaFin').value;
    const statusEvento = this.form.get('statusEvento').value;
    const coordRegional = this.form.get('coordRegional').value;
    const usuario = this.form.get('usuario').value;
    const cveActa = this.form.get('claveActa').value;
    // console.log(fechaInicio, coordRegional);
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
    if (fechaInicio) {
      const inicio =
        fechaInicio instanceof Date
          ? fechaInicio.toISOString().split('T')[0]
          : fechaInicio;
      const final = fechaFin
        ? fechaFin.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      this.filterParams.addFilter(
        'captureDate',
        inicio + ',' + final,
        SearchFilter.BTW
      );
    }
    console.log(coordRegional);
    if (coordRegional && coordRegional.length > 0) {
      this.filterParams.addFilter(
        'numDelegation_1.description',
        coordRegional,
        SearchFilter.IN
      );
    }

    if (cveActa) {
      this.filterParams.addFilter('keysProceedings', cveActa);
    }
    if (usuario)
      this.filterParams.addFilter('elaborate', usuario, SearchFilter.LIKE);
    this.filterParams.page = this.params.getValue().page;
    this.filterParams.limit = this.params.getValue().limit;
    return true;
  }

  getData() {
    this.saveForm();
    if (this.fillParams()) {
      this.loading = true;
      this.service.getAll(this.filterParams.getParams()).subscribe({
        next: response => {
          console.log(response);
          this.data = [
            ...response.data.map(x => {
              return {
                ...x,
                captureDate: format(new Date(x.captureDate), 'dd-MM-yyyy'),
              };
            }),
          ];
          this.totalItems = response.count;
          this.loading = false;
          // setTimeout(() => {
          //   this.fillElementsToExport();
          // }, 500);
        },
        error: error => {
          console.log(error);
          this.loading = false;
          this.data = [];
        },
      });
    } else {
      if (!this.first) this.form.markAllAsTouched();
    }
    this.first = false;
  }

  // abstract fillElementsToExport(): void;
}
