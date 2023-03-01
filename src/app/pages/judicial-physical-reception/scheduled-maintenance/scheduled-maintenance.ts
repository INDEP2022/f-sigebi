import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SelectListFilteredModalComponent } from 'src/app/@standalone/modals/select-list-filtered-modal/select-list-filtered-modal.component';
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
import { COORDINATIONS_COLUMNS, USUARIOS_COLUMNS } from './interfaces/columns';
import { TypeEvents } from './interfaces/typeEvents';

@Component({
  template: '',
})
export abstract class ScheduledMaintenance extends BasePage {
  form: FormGroup;
  first = true;
  @ViewChild(Ng2SmartTableComponent) table: Ng2SmartTableComponent;
  elementToExport: any[];
  settings1 = {
    ...TABLE_SETTINGS,
    pager: {
      display: false,
    },
    hideSubHeader: true,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      keysProceedings: {
        title: 'Programa Recepcion Entrega',
        type: 'string',
        sort: false,
      },
      captureDate: {
        title: 'Fecha Captura',
        type: Date,
        sort: false,
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
  paramsUsers: FilterParams = new FilterParams();
  tiposEvento = TypeEvents;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new FilterParams();
  constructor(
    protected fb: FormBuilder,
    protected modalService: BsModalService,
    protected delegationService: DelegationService,
    protected service: ProceedingsDeliveryReceptionService,
    protected detailService: ProceedingsDetailDeliveryReceptionService,
    protected userService: UsersService,
    @Inject('formStorage') protected formStorage: string
  ) {
    super();
    // this.maxDate = new Date();
    console.log(this.settings1);
  }

  get segUsers() {
    return this.userService.getAllSegUsers(this.paramsUsers.getParams());
  }

  get fechaInicio() {
    return this.form.get('fechaInicio');
  }

  get coordRegional() {
    return this.form.get('coordRegional');
  }

  get coordinaciones() {
    return this.coordRegional.value
      ? this.coordRegional.value.split(',') ?? []
      : [];
  }

  get coordinacionesSeparadas() {
    return this.coordRegional.value
      ? this.coordRegional.value.replace(',', '\n') ?? ''
      : '';
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(x => {
      console.log(x);
      this.getProceedingReception();
    });
  }

  setForm() {
    const filtersActa = window.localStorage.getItem(this.formStorage);
    if (filtersActa) {
      this.form.setValue(JSON.parse(filtersActa));
    }
  }

  saveForm() {
    window.localStorage.setItem(
      this.formStorage,
      JSON.stringify(this.form.value)
    );
  }

  cleanFilters() {
    this.form.reset();
    window.localStorage.removeItem(this.formStorage);
  }

  prepareForm() {
    this.form = this.fb.group({
      tipoEvento: [null, [Validators.required]],
      fechaInicio: [null],
      fechaFin: [null],
      statusEvento: [null],
      coordRegional: [null, [Validators.pattern(STRING_PATTERN)]],
      usuario: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.setForm();
  }

  openModalUsuarios() {
    this.openModalSelect(
      {
        title: 'Usuarios',
        columnsType: { ...USUARIOS_COLUMNS },
        service: this.userService,
        settings: { ...TABLE_SETTINGS },
        dataObservableFn: this.userService.getAllSegUsersModal,
        searchFilter: { field: 'id', operator: SearchFilter.LIKE },
      },
      this.selectUsuario
    );
  }

  openModalCoordinaciones() {
    this.openModalSelect(
      {
        title: 'Coordinaciones',
        columnsType: { ...COORDINATIONS_COLUMNS },
        service: this.delegationService,
        settings: {
          ...TABLE_SETTINGS,
          selectMode: 'multi',
        },
        dataObservableListParamsFn: this.delegationService.getAllModal,
        searchFilter: null,
      },
      this.selectCoord
    );
  }

  selectUsuario(
    usuario: { id: string; name: string },
    self: ScheduledMaintenance
  ) {
    self.form.get('usuario').setValue(usuario.id);
  }

  selectCoord(coords: { description: string }[], self: ScheduledMaintenance) {
    let coordRegional = '';
    coords.forEach((coord, index) => {
      const extra = index < coords.length - 1 ? ',' : '';
      coordRegional += coord.description + extra;
    });
    console.log(coordRegional);
    self.form.get('coordRegional').setValue(coordRegional);
  }

  protected openModalSelect(
    context?: Partial<SelectListFilteredModalComponent>,
    callback?: Function
  ) {
    const modalRef = this.modalService.show(SelectListFilteredModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered modal-not-top-padding',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSelect.subscribe(data => {
      if (data) callback(data, this);
    });
  }

  private fillParams() {
    const tipoEvento = this.form.get('tipoEvento').value;
    const fechaInicio: Date = this.form.get('fechaInicio').value;
    const fechaFin: Date = this.form.get('fechaFin').value;
    const statusEvento = this.form.get('statusEvento').value;
    const coordRegional = this.form.get('coordRegional').value;
    const usuario = this.form.get('usuario').value;
    // console.log(fechaInicio, coordRegional);
    if (this.form.invalid) {
      return false;
    }
    this.filterParams = new FilterParams();
    if (tipoEvento) {
      this.filterParams.addFilter('typeProceedings', tipoEvento);
    }

    if (statusEvento) {
      this.filterParams.addFilter('statusProceedings', statusEvento);
    }
    if (fechaInicio) {
      const inicio = fechaInicio.toISOString().split('T')[0];
      const final = fechaFin
        ? fechaFin.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      this.filterParams.addFilter(
        'captureDate',
        inicio + ',' + final,
        SearchFilter.BTW
      );
    }
    if (coordRegional)
      this.filterParams.addFilter(
        'numDelegation_1.description',
        coordRegional,
        SearchFilter.IN
      );
    if (usuario) this.filterParams.addFilter('elaborate', usuario);
    this.filterParams.page = this.params.getValue().page;
    this.filterParams.limit = this.params.getValue().limit;
    return true;
  }

  getProceedingReception() {
    if (this.fillParams()) {
      this.loading = true;
      this.service.getAll(this.filterParams.getParams()).subscribe({
        next: response => {
          console.log(response);
          this.data = [...response.data];
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
