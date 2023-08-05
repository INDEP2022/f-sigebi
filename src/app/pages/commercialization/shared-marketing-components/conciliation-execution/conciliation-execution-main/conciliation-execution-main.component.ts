import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { TheadFitlersRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-filters-row.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CONCILIATION_EXECUTION_COLUMNS } from './conciliation-execution-columns';
import { NewAndUpdateComponent } from './new-and-update/new-and-update.component';

@Component({
  selector: 'app-conciliation-execution-main',
  templateUrl: './conciliation-execution-main.component.html',
  styles: [
    `
      .bg-gray {
        background-color: white !important;
      }
    `,
  ],
})
export class ConciliationExecutionMainComponent
  extends BasePage
  implements OnInit
{
  layout: string = 'movable'; // 'movable', 'immovable'
  navigateCount: number = 0;
  conciliationForm: FormGroup = new FormGroup({});
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  selectedEvent: any = null;
  selectedBatch: any = null;
  clientRows: any[] = [];
  maxDate: Date = new Date();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  conciliationColumns: any[] = [];
  columnFilters: any = [];
  conciliationSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  eventsTestData = [
    {
      id: 101,
      description: 'DESCRIPCION DE EJEMPLO DE EVENTO 101',
    },
    {
      id: 201,
      description: 'DESCRIPCION DE EJEMPLO DE EVENTO 201',
    },
    {
      id: 301,
      description: 'DESCRIPCION DE EJEMPLO DE EVENTO 301',
    },
    {
      id: 401,
      description: 'DESCRIPCION DE EJEMPLO DE EVENTO 401',
    },
    {
      id: 501,
      description: 'DESCRIPCION DE EJEMPLO DE EVENTO 501',
    },
  ];

  batchesTestData = [
    {
      id: 1,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 1',
    },
    {
      id: 2,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 2',
    },
    {
      id: 3,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 3',
    },
    {
      id: 4,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 4',
    },
    {
      id: 5,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 5',
    },
  ];

  clientsTestData = [
    {
      id: 1646,
      name: 'ALEJANDRO MEJIA',
      processed: 'NO',
      executionDate: '',
    },
    {
      id: 1647,
      name: 'MARIA ESTEVEZ',
      processed: 'NO',
      executionDate: '',
    },
    {
      id: 1648,
      name: 'ANA PADILLA',
      processed: 'NO',
      executionDate: '',
    },
    {
      id: 1649,
      name: 'VICTOR MORALES',
      processed: 'NO',
      executionDate: '',
    },
    {
      id: 1650,
      name: 'PEDRO MENDOZA',
      processed: 'NO',
      executionDate: '',
    },
  ];

  comerEventSelect = new DefaultSelect();
  lotes = new DefaultSelect();
  data: LocalDataSource = new LocalDataSource();
  loadingBtn: boolean = false;
  acordionOpen: boolean = false;
  disabledBtnCerrar: boolean = false;

  @ViewChild('myTable', { static: false }) table: TheadFitlersRowComponent;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private comerEventService: ComerEventService,
    private comerClientsService: ComerClientsService,
    private modalService: BsModalService,
    private comerEventosService: ComerEventosService,
    private lotService: LotService,
    private comerDetailsService: ComerDetailsService,
    private token: AuthService,
    private msDepositaryService: MsDepositaryService,
    private msInvoiceService: MsInvoiceService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
        rowClassFunction: (row: any) => {
          console.log('SI', row);
          return;
        },
      },
      columns: { ...CONCILIATION_EXECUTION_COLUMNS },
    };
    this.conciliationSettings.columns = CONCILIATION_EXECUTION_COLUMNS;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        if (this.navigateCount > 0) {
          window.location.reload();
        }
        this.layout = params.get('goodType');
        this.navigateCount += 1;
      }
    });
    this.prepareForm();

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              customerId: () => (searchFilter = SearchFilter.EQ),
              name: () => (searchFilter = SearchFilter.ILIKE),
              indicted: () => (searchFilter = SearchFilter.EQ),
              process: () => (searchFilter = SearchFilter.EQ),
              executionDate: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getComerClientsXEvent('no');
        }
      });

    this.params
      .pipe(
        skip(1),
        tap(() => {
          this.getComerClientsXEvent('no');
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }

  private prepareForm(): void {
    this.conciliationForm = this.fb.group({
      event: [null, [Validators.required]],
      description: [null],
      date: [null],
      phase: [null],
      batch: [null],
      price: [null],
    });
  }

  getData() {
    if (!this.selectedEvent) {
      this.alert('warning', 'Es Necesario Especificar el Evento', '');
      this.conciliationForm.get('event').markAsTouched();
      return;
    }
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.getComerClientsXEvent('no');
  }

  mostrarLotes: boolean = false;
  async selectEvent(event: any) {
    console.log(event);
    this.selectedEvent = event;
    if (event) {
      const V_PROCESO_FASE = await this.getType(event.id_evento);
      if (!V_PROCESO_FASE) {
        return this.alert(
          'warning',
          `El Evento ${event.id_evento} no está Asociado al tipo de Proceso, verifique`,
          ''
        );
        this.conciliationForm.get('description').setValue(event.cve_proceso);
      } else {
        if (V_PROCESO_FASE == 1) {
          this.mostrarLotes = false;
          this.conciliationForm.get('description').setValue(event.cve_proceso);
        } else if (V_PROCESO_FASE == 2) {
          this.mostrarLotes = true;
          this.conciliationForm.get('description').setValue(event.cve_proceso);
          this.getLotes(new ListParams(), 'si');
        }
      }
    }
  }

  selectBatch(batch: any) {
    console.log('aaa', batch);
    this.selectedBatch = batch;
  }

  selectClients(rows: any[]) {
    this.clientRows = rows;
  }
  GLOBALV_CL: string = '';
  async execute() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Ejecutar',
        ''
      );

    const eventProcess: any = await this.getA(this.selectedEvent.id_evento);

    if (!eventProcess)
      return this.alert(
        'warning',
        `El Evento ${this.selectedEvent.id_evento} no está Asociado al tipo de Proceso, Verifique`,
        ''
      );

    if (eventProcess.phase == 1) {
      if (eventProcess.id.tpeventoId == 11) {
        // CARGA_PAGOSREFGENS;
        await this.CARGA_PAGOSREFGENS();
        await this.CARGA_COMER_DETALLES();
        await this.VALIDA_PAGOSREF_PREP_OI_BASES_CA(
          this.selectedEvent.id_evento,
          this.selectedEvent.cve_proceso
        );
      } else {
        let L_PARAME: any = await this.VALIDA_PAGOSREF_OBT_PARAMETROS(
          this.selectedEvent.id_evento,
          this.layout
        );

        if (L_PARAME != 'OK') {
          this.alert('warning', L_PARAME, '');
          return;
        }

        let L_VALEST: any = await this.VALIDA_ESTATUS();
        if (L_VALEST > 0) {
          this.alert(
            'warning',
            `El Bien ${L_VALEST} no tiene Estatus Válido, Verifique`,
            ''
          );
          return;
        }

        let L_VALMAN: any = await this.VALIDA_MANDATO();
        if (L_VALMAN > 0) {
          this.alert(
            'warning',
            `El Lote ${L_VALMAN} no Tiene Mandato Válido, Verifique`,
            'Ejecute el Botón Act. Mand. en Preparación de Eventos'
          );
          return;
        }

        let L_LISTAN: any = await this.VALIDA_LISTANEGRA();
        if (L_LISTAN > 0) {
          this.alert(
            'warning',
            `El Cliente ${L_LISTAN} se Encuentra en la Lista Negra no se Puede Procesar`,
            'No lo Seleccione en los Clientes'
          );
          return;
        }

        if (
          eventProcess.id.tpeventoId == 1 ||
          eventProcess.id.tpeventoId == 3
        ) {
          await this.VALIDA_PAGOSREF_VALIDA_COMER(
            this.selectedEvent.id_evento,
            this.conciliationForm.value.date
          );
          await this.VALIDA_PAGOSREF_PREP_OI(
            this.selectedEvent.id_evento,
            this.selectedEvent.cve_proceso
          );
        } else if (eventProcess.id.tpeventoId == 4) {
          await this.VALIDA_PAGOSREF_VENTA_SBM(
            this.selectedEvent.id_evento,
            this.conciliationForm.value.date
          );
          await this.VALIDA_PAGOSREF_PREP_OI(
            this.selectedEvent.id_evento,
            this.selectedEvent.cve_proceso
          );
        }

        this.alert('success', 'Proceso Terminado Correctamente', '');
      }
    } else if (eventProcess.phase == 2) {
      if (!this.selectedBatch) {
        this.GLOBALV_CL = 'B';
      } else {
        this.GLOBALV_CL = 'A';
      }
      let obj: any = {
        fase: eventProcess.phase,
        fases: this.globalFASES,
        v_cl: this.GLOBALV_CL,
        evento: this.selectedEvent.id_evento,
        lote: this.selectedBatch ? this.selectedBatch.lotId : null,
        lotePublico: this.selectedBatch ? this.selectedBatch.lotPublic : null,
        fecha: this.conciliationForm.value.date,
        descripcion: this.selectedEvent.cve_proceso,
      };
      const endpointEjecutar: any = await this.PUP_ENTRA(obj); //PUP_ENTRA
    }
  }

  async CARGA_PAGOSREFGENS() {
    return new Promise((resolve, reject) => {
      this.lotService
        .CARGA_PAGOSREFGENS(this.selectedEvent.id_evento)
        .subscribe({
          next: data => {
            resolve(data);
          },
          error: err => {
            resolve(err.message[0]);
          },
        });
    });
  }

  async CARGA_COMER_DETALLES() {
    return new Promise((resolve, reject) => {
      this.lotService
        .CARGA_COMER_DETALLES(this.selectedEvent.id_evento)
        .subscribe({
          next: data => {
            resolve(data);
          },
          error: err => {
            resolve(err.message[0]);
          },
        });
    });
  }

  async VALIDA_PAGOSREF_PREP_OI_BASES_CA(id_evento: any, cve_proceso: any) {
    let obj = {
      event: id_evento,
      descrption: cve_proceso,
      user: this.token.decodeToken().preferred_username,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_PAGOSREF_PREP_OI_BASES_CA(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async VALIDA_PAGOSREF_OBT_PARAMETROS(id_evento: any, layout: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService
        .VALIDA_PAGOSREF_OBT_PARAMETROS(id_evento)
        .subscribe({
          next: data => {
            resolve(data);
          },
          error: err => {
            resolve(err.message[0]);
          },
        });
    });
  }

  async VALIDA_ESTATUS() {
    let obj = {
      appointmentNo: 1,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_ESTATUS(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async VALIDA_MANDATO() {
    return new Promise((resolve, reject) => {
      this.lotService.VALIDA_MANDATO(this.selectedEvent.id_evento).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err);
        },
      });
    });
  }

  async VALIDA_LISTANEGRA() {
    // no_nombramiento
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_LISTANEGRA(1).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async VALIDA_PAGOSREF_VALIDA_COMER(id_evento: any, date: any) {
    let obj = {
      event: id_evento,
      date: date,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_PAGOSREF_VALIDA_COMER(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async VALIDA_PAGOSREF_VENTA_SBM(id_evento: any, date: any) {
    let obj = {
      event: id_evento,
      date: date,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_PAGOSREF_VENTA_SBM(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async VALIDA_PAGOSREF_PREP_OI(id_evento: any, cve_proceso: any) {
    let obj = {
      name: 2,
      description: cve_proceso,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_PAGOSREF_PREP_OI(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  // PUP_ENTRA
  PUP_ENTRA(body: any) {
    return new Promise((resolve, reject) => {
      this.lotService.PUP_ENTRA(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  getA(id: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.getByIdComerTEvents(id).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  modify() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Modificar',
        ''
      );
  }

  async cancel() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Deshacer',
        ''
      );
    let obj = {};
    await this.eliminar(obj);
  }

  async eliminar(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.getFcomer612Get1(body).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(false);
          console.log('ERR', err);
        },
      });
    });
  }

  // ----------------------- WILMER ----------------------- //
  getComerEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('id_evento', lparams.text, SearchFilter.EQ);

    // params.addFilter('address', `M`, SearchFilter.EQ);
    // params.addFilter('eventTpId', `6,7`, SearchFilter.NOTIN);
    // params.addFilter('statusVtaId', `CONT`, SearchFilter.NOT);

    this.comerEventosService
      .getSelectComerEvent(params.getParams(), this.layout)
      .subscribe({
        next: data => {
          // let result = data.data.map(item => {
          //   item['bindlabel_'] = item.id + ' - ' + item.description;
          // });
          // Promise.all(result).then(resp => {
          console.log('EVENT', data);
          this.comerEventSelect = new DefaultSelect(data.data, data.count);
          // });
        },
        error: err => {
          this.comerEventSelect = new DefaultSelect();
        },
      });
  }

  async getComerClientsXEvent(filter: any) {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.eventId'] = `$eq:${this.selectedEvent.id_evento}`;
    // const params = new FilterParams();
    // params.addFilter('eventId', this.eventSelected.id, SearchFilter.EQ);
    if (params['filter.name']) {
      params['filter.customers.reasonName'] = params['filter.name'];
      delete params['filter.name'];
    }

    if (params['filter.executionDate']) {
      var fecha = new Date(params['filter.executionDate']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['filter.executionDate'] = `$eq:${fechaFormateada}`;
    }

    params['sortBy'] = 'customerId:DESC';
    this.comerClientsService.getComerClientsXEventgetAllV2(params).subscribe({
      next: response => {
        console.log(response);
        let result = response.data.map(async (item: any) => {
          // const client: any = await this.getClients(item.customerId);
          item['rfc'] = item.customers ? item.customers.rfc : null;
          item['name'] = item.customers ? item.customers.reasonName : null;
        });
        Promise.all(result).then(resp => {
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
          this.clickSearch = false;
        });
      },
      error: err => {
        if (filter == 'si') {
          this.alert(
            'warning',
            'No se Encontraron Clientes para este Evento',
            ''
          );
        }

        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
        this.clickSearch = false;
      },
    });
  }
  clickSearch: boolean = false;
  search() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Consultar',
        ''
      );

    this.disabledBtnCerrar = true;
    this.acordionOpen = true;
    this.totalItems = 0;
    this.clickSearch = true;
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerClientsXEvent('si'));
  }
  clear() {
    this.conciliationForm.reset();
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.disabledBtnCerrar = false;
    this.acordionOpen = false;
    this.selectedEvent = null;
    this.globalFASES = null;
    this.mostrarLotes = false;
    this.getComerEvents(new ListParams());
    this.clearSubheaderFields();
  }

  async clearSubheaderFields() {
    const subheaderFields: any = this.table.grid.source;
    const filterConf = subheaderFields.filterConf;
    filterConf.filters = [];
    this.columnFilters = [];
  }
  allNo() {
    if (!this.selectedEvent) {
      this.alert('warning', 'Es Necesario Especificar un Evento', '');
      return;
    }

    if (this.data.count() == 0) {
      this.alert('warning', 'No hay Clientes Cargados en la Tabla', '');
      return;
    }

    const data: any = this.data.getAll().then(async resp => {
      if (resp.length > 0) this.loading = true;
      // let result = resp.map(async (item: any) => {
      //   item.process = 'N';
      //   delete item.rfc;
      //   delete item.name;
      //   await this.update(item);
      // });

      // Promise.all(result).then(async resp => {
      // this.loading = false;
      await this.update(this.selectedEvent.id_evento, 'N');
      await this.getComerClientsXEvent('no');
      // this.data.refresh()
      // });
    });
  }
  allYes() {
    if (!this.selectedEvent) {
      this.alert('warning', 'Es Necesario Especificar un Evento', '');
      return;
    }

    if (this.data.count() == 0) {
      this.alert('warning', 'No hay Clientes Cargados en la Tabla', '');
      return;
    }

    const data: any = this.data.getAll().then(async resp => {
      if (resp.length > 0) this.loading = true;
      // let result = resp.map(async (item: any) => {
      //   item.process = 'S';
      //   delete item.rfc;
      //   delete item.name;
      //   await this.update(item);
      // });

      // Promise.all(result).then(async resp => {
      // this.loading = false;
      await this.update(this.selectedEvent.id_evento, 'S');
      await this.getComerClientsXEvent('no');
      // this.data.refresh()
      // });
    });
  }

  // UPDATE CLIENTES X EVENTOS //
  async update(event: any, type: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.pFmcomr612ClientxEvent1(event, type).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(false);
          console.log('ERR', err);
        },
      });
    });
  }

  edit(event: any) {
    console.log('aaa', event);
    this.openForm(event, true);
  }
  add() {
    this.openForm(null, false);
  }

  openForm(data: any, editVal: boolean) {
    if (!this.selectedEvent) {
      this.alert('warning', 'Es Necesario Especificar un Evento', '');
      return;
    }
    const modalConfig = MODAL_CONFIG;
    let event = this.selectedEvent;

    modalConfig.initialState = {
      event,
      data,
      editVal,
      callback: (next: boolean) => {
        if (next) this.getComerClientsXEvent('no');
      },
    };
    this.modalService.show(NewAndUpdateComponent, modalConfig);
  }

  globalFASES: any = null;
  async selectedFase(event: any) {
    let BLK_CTRLFASE = event;
    let V_IDTPVENTO: any = null;
    let V_FASE: any = null;
    const respEvent: any = await this.getSelectFase(
      this.selectedEvent.id_evento
    );

    if (respEvent) {
      V_IDTPVENTO = respEvent.idTipeEvent;
      V_FASE = respEvent.phase;
    }

    if (V_FASE == 1) {
      if (V_IDTPVENTO == 4) {
        if (BLK_CTRLFASE == 5) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no Corresponse con el tipo de Evento',
            ''
          );
          return;
        }
      } else if (V_IDTPVENTO == 1) {
        if (BLK_CTRLFASE == 1 || BLK_CTRLFASE == 5) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no Corresponse con el tipo de Evento',
            ''
          );
          return;
        }
      } else if (V_IDTPVENTO == 3) {
        if (BLK_CTRLFASE == 3) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no Corresponse con el tipo de Evento',
            ''
          );
          return;
        }
      } else if (V_IDTPVENTO == 12) {
        if (BLK_CTRLFASE == 1 || BLK_CTRLFASE == 5) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no Corresponse con el tipo de Evento',
            ''
          );
          return;
        }
      }

      this.globalFASES = 0;
    } else {
      if (V_IDTPVENTO == 1) {
        if (BLK_CTRLFASE != 1 || BLK_CTRLFASE != 3 || BLK_CTRLFASE != 4) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no Corresponse con el tipo de Evento',
            ''
          );
          return;
        }
      } else if (V_IDTPVENTO == 4) {
        if (
          BLK_CTRLFASE != 1 ||
          BLK_CTRLFASE != 2 ||
          BLK_CTRLFASE != 7 ||
          BLK_CTRLFASE != 3 ||
          BLK_CTRLFASE != 4
        ) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no Corresponse con el tipo de Evento',
            ''
          );
          return;
        }
      }
    }
  }

  async getSelectFase(id_evento: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.getFcomer612Get1(id_evento).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(false);
          console.log('ERR', err);
        },
      });
    });
  }

  getLotes(lparams: ListParams, filter: any) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('lotPublic', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params.addFilter('description', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }

    params.addFilter('idEvent', this.selectedEvent.id_evento, SearchFilter.EQ);
    params.addFilter('idStatusVta', 'VEN', SearchFilter.EQ);

    this.lotService.getLotbyEvent_(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        let result = data.data.map(async (item: any) => {
          item['idAndDesc'] = item.lotPublic + ' - ' + item.description;
        });

        Promise.all(result).then(resp => {
          this.lotes = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        if (filter == 'si') {
          this.alert('warning', 'No hay Lotes Asociados a este Evento', '');
        }
        this.lotes = new DefaultSelect([], 0);
      },
    });
  }

  async getType(id: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.getByIdComerTEvents(id).subscribe({
        next: (response: any) => {
          // this.alert('success', 'Proceso Ejecutado Correctamente', '');
          // this.getPayments();
          resolve(response.phase);
        },
        error: error => {
          resolve(null);
          // this.alert('error', 'Ocurrió un Error al Intentar Ejecutar el Proceso', error.error.message);
        },
      });
    });
  }
}
