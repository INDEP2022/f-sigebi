import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { NewAndUpdateComponent } from './new-and-update/new-and-update.component';
import { SIRSAE_MOVEMENT_SENDING_COLUMNS } from './sirsae-movement-sending-columns';

@Component({
  selector: 'app-sirsae-movement-sending-main',
  templateUrl: './sirsae-movement-sending-main.component.html',
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class SirsaeMovementSendingMainComponent
  extends BasePage
  implements OnInit
{
  layout: string = 'movable'; // 'movable' 'immovable'
  navigateCount: number = 0;
  form: FormGroup = new FormGroup({});
  formInmueble: FormGroup = new FormGroup({});
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  selectedEvent: any = null;
  selectedBatch: any = null;
  clientRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  movementSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  eventsTestData = [
    {
      id: 101,
      description: 'DESCRIPCION DE EJEMPLO DE Evento 101',
    },
    {
      id: 201,
      description: 'DESCRIPCION DE EJEMPLO DE Evento 201',
    },
    {
      id: 301,
      description: 'DESCRIPCION DE EJEMPLO DE Evento 301',
    },
    {
      id: 401,
      description: 'DESCRIPCION DE EJEMPLO DE Evento 401',
    },
    {
      id: 501,
      description: 'DESCRIPCION DE EJEMPLO DE Evento 501',
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
      rfc: 'GS46INN91',
      sent: 'NO',
    },
    {
      id: 1647,
      name: 'MARIA ESTEVEZ',
      rfc: 'HINS12651IN',
      sent: 'NO',
    },
    {
      id: 1648,
      name: 'ANA PADILLA',
      rfc: 'RGN682PKM',
      sent: 'NO',
    },
    {
      id: 1649,
      name: 'VICTOR MORALES',
      rfc: 'UGO1297LN9',
      sent: 'NO',
    },
    {
      id: 1650,
      name: 'PEDRO MENDOZA',
      rfc: 'LPAT2151UB',
      sent: 'NO',
    },
  ];

  comerEventSelect = new DefaultSelect();
  comerEventSelectInmueble = new DefaultSelect();
  columnFilters: any = [];
  acordionOpen: boolean = false;
  disabledBtnCerrar: boolean = false;
  loadingBtn: boolean = false;
  loadingBtnOIICliente: boolean = false;
  @ViewChild('myTable', { static: false }) table: TheadFitlersRowComponent;
  lotes = new DefaultSelect();
  loadingBtnSendIn: boolean = false;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  className = 'col-4';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private comerEventService: ComerEventService,
    private comerClientsService: ComerClientsService,
    private modalService: BsModalService,
    private comerInvoiceService: ComerInvoiceService,
    private paymentService: PaymentService,
    private comerDetailsService: ComerDetailsService,
    private lotService: LotService,
    private interfacesirsaeService: InterfacesirsaeService,
    private comerEventosService: ComerEventosService
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
      columns: { ...SIRSAE_MOVEMENT_SENDING_COLUMNS },
    };
  }

  ngOnInit(): void {
    // this.mapValToClass(this.layout)
    console.log('AQUI');
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        console.log(params.get('goodType'));
        if (this.navigateCount > 0) {
          this.form.reset();
          this.clientRows = [];
          window.location.reload();
        }
        this.layout = params.get('goodType');

        this.navigateCount += 1;
      }
    });
    if (this.layout == 'I') {
      this.acordionOpen = true;
      this.disabledBtnCerrar = true;
    }
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
              rfc: () => (searchFilter = SearchFilter.ILIKE),
              sendedSirsae: () => (searchFilter = SearchFilter.EQ),
              sendSirsae: () => (searchFilter = SearchFilter.EQ),
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
    // this.params
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(() => this.getComerClientsXEvent());

    this.getData();
  }

  mapValToClass(layout?: any) {
    if (this.layout == 'M') {
      return 'col-6';
    } else if (this.layout == 'I') {
      return 'col-6';
    }
    return 'col-4';
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      batch: [null],
      description: [null],
      cliente: [null],
    });

    this.formInmueble = this.fb.group({
      eventInmueble: [null, [Validators.required]],
      descriptionInmueble: [null],
    });
  }

  getData() {}

  getEvents(params: ListParams) {
    if (params.text == '') {
      this.eventItems = new DefaultSelect(this.eventsTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.eventsTestData.filter((i: any) => i.id == id)];
      this.eventItems = new DefaultSelect(item[0], 1);
    }
  }

  getBatches(params: ListParams) {
    if (params.text == '') {
      this.batchItems = new DefaultSelect(this.batchesTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.batchesTestData.filter((i: any) => i.id == id)];
      this.batchItems = new DefaultSelect(item[0], 1);
    }
  }

  eventSelected: any = null;
  selectEvent(event: any) {
    this.eventSelected = event;
    if (event) this.selectedEvent = event.processKey;
    if (this.layout == 'I') {
      this.getLotes(new ListParams(), 'si');
    }
  }

  selectBatch(batch: any) {
    this.selectedBatch = batch;
    if (batch)
      if (batch.client)
        this.form.get('cliente').setValue(batch.client.nomRazon);
  }

  selectClients(rows: any[]) {
    this.clientRows = rows;
  }

  // ---------------------- WILMER ---------------------- //

  getComerEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (this.layout == 'M') {
      if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);
      params.addFilter('address', this.layout, SearchFilter.EQ);
      params.addFilter('eventTpId', `6,7`, SearchFilter.NOTIN);
      params.addFilter('statusVtaId', `CONT`, SearchFilter.NOT);

      this.comerEventService.getAllFilter(params.getParams()).subscribe({
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
    } else if (this.layout == 'I') {
      if (lparams.text)
        params.addFilter('id_evento', lparams.text, SearchFilter.EQ);
      params.addFilter3('pDirection', this.layout);
      // params.addFilter('eventTpId', `1,2,3,4,5`, SearchFilter.IN);
      // params.addFilter('statusVtaId', `CNE`, SearchFilter.NOT);
      params.sortBy = `id_evento:DESC`;
      this.comerEventosService.getLovEventos1(params.getParams()).subscribe({
        next: data => {
          let result = data.data.map((item: any) => {
            item['id'] = item.id_evento;
            item['processKey'] = item.cve_proceso;
            // item['bindlabel_'] = item.id + ' - ' + item.description;
          });
          Promise.all(result).then(resp => {
            console.log('EVENT22', data);
            this.comerEventSelect = new DefaultSelect(data.data, data.count);
          });
        },
        error: err => {
          this.comerEventSelect = new DefaultSelect();
        },
      });
    }
  }

  // COMER_CLIENTESXEvento
  async getComerClientsXEvent(filter: any) {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    if (this.layout == 'M')
      params['filter.eventId'] = `$eq:${this.eventSelected.id}`;

    if (this.layout == 'I')
      params['filter.eventId'] = `$eq:${this.eventSelectedInmueble.id}`;
    // const params = new FilterParams();
    // params.addFilter('eventId', this.eventSelected.id, SearchFilter.EQ);
    if (params['filter.name']) {
      params['filter.customers.reasonName'] = params['filter.name'];
      delete params['filter.name'];
    }

    if (params['filter.rfc']) {
      params['filter.customers.rfc'] = params['filter.rfc'];
      delete params['filter.rfc'];
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
            'No se encontraron clientes para este Evento',
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

  getClients(id: any) {
    return new Promise((resolve, reject) => {
      this.comerClientsService.getById_(id).subscribe({
        next: data => {
          console.log('dasadas', data);
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  clickSearch: boolean = false;
  search() {
    if (!this.eventSelected)
      return this.alert(
        'warning',
        'Es necesario especificar un evento para consultar',
        ''
      );

    this.disabledBtnCerrar = true;
    this.acordionOpen = true;
    this.totalItems = 0;
    this.clickSearch = true;
    // this.amountList = [];
    // this.typeEvents = event.data;
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerClientsXEvent('si'));

    setTimeout(() => {
      this.performScroll();
    }, 500);
  }

  clear() {
    this.form.reset();
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.disabledBtnCerrar = false;
    this.acordionOpen = false;
    this.eventSelected = null;
    this.getComerEvents(new ListParams());
    this.clearSubheaderFields();
  }

  clear2() {
    this.form.reset();
    this.getComerEvents(new ListParams());
    this.eventSelected = null;
  }
  async clearSubheaderFields() {
    const subheaderFields: any = this.table.grid.source;
    const filterConf = subheaderFields.filterConf;
    filterConf.filters = [];
    this.columnFilters = [];
  }
  edit(event: any) {
    console.log('aaa', event);
    this.openForm(event, true);
  }
  add() {
    this.openForm(null, false);
  }
  openForm(data: any, editVal: boolean) {
    if (this.layout == 'M') {
      if (!this.eventSelected) {
        this.alert('warning', 'Es necesario especificar un evento', '');
        return;
      }
    } else if (this.layout == 'I') {
      if (!this.eventSelectedInmueble) {
        this.alert('warning', 'Es necesario especificar un evento', '');
        return;
      }
    }

    const modalConfig = MODAL_CONFIG;
    let event = this.eventSelected;

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

  allNo() {
    if (this.layout == 'M') {
      if (!this.eventSelected) {
        this.alert('warning', 'Es necesario especificar un evento', '');
        return;
      }

      if (this.data.count() == 0) {
        this.alert('warning', 'No hay clientes cargados en la tabla', '');
        return;
      }

      const data: any = this.data.getAll().then(async resp => {
        if (resp.length > 0) this.loading = true;
        await this.update(this.eventSelected.id, 'N');
        await this.getComerClientsXEvent('no');
      });
    } else if (this.layout == 'I') {
      if (!this.eventSelectedInmueble) {
        this.alert('warning', 'Es necesario especificar un evento', '');
        return;
      }

      if (this.data.count() == 0) {
        this.alert('warning', 'No hay clientes cargados en la tabla', '');
        return;
      }

      const data: any = this.data.getAll().then(async resp => {
        if (resp.length > 0) this.loading = true;
        await this.update(this.eventSelectedInmueble.id, 'N');
        await this.getComerClientsXEvent('no');
      });
    }
  }
  allYes() {
    if (this.layout == 'M') {
      if (!this.eventSelected) {
        this.alert('warning', 'Es necesario especificar un evento', '');
        return;
      }

      if (this.data.count() == 0) {
        this.alert('warning', 'No hay clientes cargados en la tabla', '');
        return;
      }

      const data: any = this.data.getAll().then(async resp => {
        if (resp.length > 0) this.loading = true;

        await this.update(this.eventSelected.id, 'S');
        await this.getComerClientsXEvent('no');
      });
    } else if (this.layout == 'I') {
      if (!this.eventSelectedInmueble) {
        this.alert('warning', 'Es necesario especificar un evento', '');
        return;
      }

      if (this.data.count() == 0) {
        this.alert('warning', 'No hay clientes cargados en la tabla', '');
        return;
      }

      const data: any = this.data.getAll().then(async resp => {
        if (resp.length > 0) this.loading = true;

        await this.update(this.eventSelectedInmueble.id, 'S');
        await this.getComerClientsXEvent('no');
      });
    }
  }

  // UPDATE CLIENTES X EventoS //
  async update(event: any, type: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.pFmcomr612ClientxEvent2(event, type).subscribe({
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

  // PARA ELIMINAR //
  async update_(data: any) {
    return new Promise((resolve, reject) => {
      this.comerClientsService.updateClientXEvent(data).subscribe({
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

  async enviarSIRSAE() {
    if (!this.eventSelected) {
      this.alert('warning', 'Es necesario especificar un evento', '');
      return;
    }
    if (this.layout == 'M') {
      const data: any = this.data.getAll().then(async resp => {
        if (resp.length > 0) {
          this.loading = true;
        }
        this.loadingBtn = true;

        // Promise.all(result).then(async resp => {
        await this.pFmcomr612getAuxCount(this.eventSelected.id);

        const resss: any = await this.sendSirsae(1, []);
        console.log('RESS', resss);
        if (resss.status == 400 || resss.status == 500) {
          if (
            resss.message == 'ERROR EN LA CONEXION A SIRSAE' ||
            resss.message ==
              'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
            resss.message ==
              'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
            resss.message ==
              'ConnectionError: Failed to connect to 172.20.226.12\\cluster2016 in 15000ms' ||
            resss.message ==
              'ConnectionError: Failed to connect to 172.20.226.12:undefined - Could not connect (sequence)'
          ) {
            this.alert(
              'error',
              'Error de conexión',
              'No se pudo conectar a la Base de Datos (SIRSAE)'
            );
            this.loadingBtn = false;
            await this.getComerClientsXEvent('no');
            return;
          } else {
            this.alert(
              'error',
              'Ha ocurrido un error al intentar enviar a SIRSAE',
              ''
            );
            this.loadingBtn = false;
            await this.getComerClientsXEvent('no');
            return;
          }
        } else {
          await this.actEstEve(this.eventSelected.id);
          this.loadingBtn = false;
          this.alert('success', 'Proceso terminado correctamente', '');
          await this.getComerClientsXEvent('no');
        }
        if (
          resss == 'ERROR EN LA CONEXION A SIRSAE' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12\\cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12:undefined - Could not connect (sequence)'
        ) {
          this.alert(
            'error',
            'Error de Conexión',
            'No se pudo Conectar a la Base de Datos (SIRSAE)'
          );
        } else {
        }
      });
    } else if (this.layout == 'I') {
      // if (!this.selectedBatch)
      //   return this.alert('warning', 'Debe Seleccionar un Lote', '');
      this.loadingBtnSendIn = true;
      let obj = {
        eventId: this.eventSelected.id,
        lot: this.selectedBatch ? this.selectedBatch.lotPublic : null,
      };

      const valid_pago = await this.VALIDA_PAGOS(obj);
      if (valid_pago == 0) {
        this.alert(
          'warning',
          'EL Evento o Lote seleccionado no tiene dispersión de pagos, verifique',
          ''
        );
        this.loadingBtnSendIn = false;
        return;
      }

      const AUX_ESTATUS: any = await this.GET_AUX_ESTATUS();
      if (AUX_ESTATUS <= 0) {
        this.alert('warning', 'Debe ejecutar primero el cambio de estatus', '');
        this.loadingBtnSendIn = false;
        return;
      }

      let objSirsae: any = {
        pMode: 1,
        pLot: this.selectedBatch ? this.selectedBatch.lotId : null,
        lotPublic: this.selectedBatch ? this.selectedBatch.lotPublic : null,
        idEvent: this.eventSelected.id,
      };
      const sendReadSirsae: any = await this.ENVIA_LEE_SIRSAE(objSirsae);
      if (!sendReadSirsae) {
        this.alert('error', 'Ha ocurrido un error al enviar', '');
        this.loadingBtnSendIn = false;
        return;
      } else {
        this.alert('success', 'Proceso terminado correctamente', '');
      }
      this.loadingBtnSendIn = false;
    }
  }

  async VALIDA_PAGOS(body: any) {
    return new Promise((resolve, reject) => {
      this.comerInvoiceService.VALIDA_PAGOS(body).subscribe({
        next: response => {
          resolve(response.aux_cont);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async GET_AUX_ESTATUS() {
    const params = new FilterParams();
    params.addFilter('idEvent', this.eventSelected.id, SearchFilter.EQ);
    if (this.selectedBatch)
      params.addFilter(
        'lotPublic',
        this.selectedBatch.lotPublic,
        SearchFilter.EQ
      );
    params.addFilter('idStatusVta', 'PAG,GARA', SearchFilter.NOTIN);
    return new Promise((resolve, reject) => {
      this.lotService.getLotbyEvent_(params.getParams()).subscribe({
        next: data => {
          resolve(data.count);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async ENVIA_LEE_SIRSAE(body: any) {
    return new Promise((resolve, reject) => {
      this.interfacesirsaeService.sendReadSirsae(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  actEstEve(id: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.actEstEve(id).subscribe({
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

  pFmcomr612getAuxCount(id: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.pFmcomr612getAuxCount(id).subscribe({
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

  async updateEvents(id: any, body: any) {
    return new Promise((resolve, reject) => {
      this.comerEventService.updateComerEvent(id, body).subscribe({
        next: data => {
          resolve(true);
        },
        error: err => {
          resolve(false);
        },
      });
    });
  }
  async validaPagos() {
    const data: any = this.data.getAll().then(resp => {
      let result = resp.map(async (item: any) => {
        const valid1 = await this.validPayments(item);
        if (valid1 == 0) {
          this.alert(
            'warning',
            `El Cliente ${item.customerId} no tiene pagos y no se enviará a SIRSAE `,
            ''
          );
        }
      });
      this.data.refresh();
    });
  }

  async validPayments(data: any) {
    const params = new ListParams();
    params['filter.idEvent'] = `$eq:${data.eventId}`;
    params['filter.clientRfc'] = `$eq:${data.rfc}`;
    return new Promise((resolve, reject) => {
      this.comerInvoiceService.getValidPayments(params).subscribe({
        next: response => {
          resolve(response.count);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  async sendSirsae(process: any, data: any) {
    let obj = {
      process: process,
      event:
        this.layout == 'I'
          ? this.eventSelectedInmueble.id
          : this.eventSelected.id,
      // customerXevent: data,
    };
    return new Promise((resolve, reject) => {
      this.paymentService.sendSirsaeFcomer112(obj).subscribe({
        next: response => {
          let obj = {
            status: 200,
            message: 'OK',
          };
          resolve(obj);
        },
        error: error => {
          console.log('error', error);
          let obj = {
            status: error.status,
            message: error.error.message,
          };
          resolve(obj);
        },
      });
    });
  }

  obtenerOI() {
    if (this.layout == 'M') {
      if (!this.eventSelected) {
        this.alert('warning', 'Es necesario especificar un evento', '');
        return;
      }
      const data: any = this.data.getAll().then(async resp => {
        if (resp.length > 0) this.loading = true;
        const resss = await this.sendSirsae(2, []);
        if (
          resss == 'ERROR EN LA CONEXION A SIRSAE' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12\\cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12:undefined - Could not connect (sequence)'
        ) {
          this.alert(
            'error',
            'Error de conexión',
            'No se pudo conectar a la Base de Datos (SIRSAE)'
          );
          await this.getComerClientsXEvent('no');
          return;
        } else {
          this.alert('success', 'Proceso terminado correctamente', '');
          // this.loading = false;
          await this.getComerClientsXEvent('no');
        }
      });
    } else if (this.layout == 'I') {
      if (!this.eventSelectedInmueble) {
        this.alert('warning', 'Es necesario especificar un evento', '');
        return;
      }
      this.loadingBtnOIICliente = true;
      const data: any = this.data.getAll().then(async resp => {
        if (resp.length > 0) this.loading = true;
        const resss = await this.sendSirsae(2, []);
        if (
          resss == 'ERROR EN LA CONEXION A SIRSAE' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12\\cluster2016 in 15000ms' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12:undefined - Could not connect (sequence)'
        ) {
          this.alert(
            'error',
            'Error de conexión',
            'No se pudo conectar a la Base de Datos (SIRSAE)'
          );
          await this.getComerClientsXEvent('no');
          this.loadingBtnOIICliente = false;
          return;
        } else {
          this.alert('success', 'Proceso terminado correctamente', '');
          // this.loading = false;
          await this.getComerClientsXEvent('no');
          this.loadingBtnOIICliente = false;
        }
      });
    }
  }
  loadingBtnOII: boolean = false;
  async obtenerOIInmueble() {
    // ENVIA_LEE_SIRSAE(2, null);
    if (!this.eventSelected) {
      this.alert('warning', 'Es necesario especificar un evento', '');
      return;
    }
    this.loadingBtnOII = true;
    let objSirsae: any = {
      pMode: 2,
      pLot: null,
      lotPublic: null,
      idEvent: this.eventSelected.id,
    };
    const sendReadSirsae: any = await this.ENVIA_LEE_SIRSAE(objSirsae);
    if (!sendReadSirsae) {
      this.alert('error', 'Ha ocurrido un error al enviar', '');
      this.loadingBtnOII = false;
      return;
    } else {
      this.alert('success', 'Proceso terminado correctamente', '');
    }
    this.loadingBtnOII = false;
  }

  // ------------------------------ ------------------------------ --------- //
  // ------------------------------ INMUEBLES ------------------------------ //
  // ------------------------------ ------------------------------ --------- //

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

    params.addFilter('idEvent', this.eventSelected.id, SearchFilter.EQ);
    params.addFilter('idStatusVta', 'PAG', SearchFilter.NOT);
    params.addFilter('idClient', '$null', SearchFilter.NOT);
    this.lotService.getLotbyEvent_(params.getParams()).subscribe({
      next: data => {
        console.log('LOTES', data);
        let result = data.data.map(async (item: any) => {
          item['idAndDesc'] = item.lotPublic + ' - ' + item.description;
        });

        Promise.all(result).then(resp => {
          this.lotes = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        if (filter == 'si') {
          this.alert('warning', 'No hay lotes disponibles en el Evento', '');
        }
        // this.conciliationForm.get('batch').setValue(null);
        this.lotes = new DefaultSelect([], 0);
      },
    });
  }

  getComerEventsInmueble(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('id_evento', lparams.text, SearchFilter.EQ);
    // params.addFilter('address', this.layout, SearchFilter.EQ);
    // params.addFilter('eventTpId', `1,2,3,4,5`, SearchFilter.NOTIN);
    // params.addFilter('statusVtaId', `CNE`, SearchFilter.NOT);
    params.addFilter3('pDirection', this.layout);
    params.sortBy = `id_evento:DESC`;
    this.comerEventosService.getLovEventos1(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map((item: any) => {
          item['id'] = item.id_evento;
          item['processKey'] = item.cve_proceso;
          // item['bindlabel_'] = item.id + ' - ' + item.description;
        });
        Promise.all(result).then(resp => {
          console.log('EVENT', data);
          this.comerEventSelectInmueble = new DefaultSelect(
            data.data,
            data.count
          );
        });
      },
      error: err => {
        this.comerEventSelectInmueble = new DefaultSelect();
      },
    });
  }

  eventSelectedInmueble: any = null;
  selectEventInmueble(event: any) {
    this.eventSelectedInmueble = event;
    if (event)
      this.formInmueble.get('descriptionInmueble').setValue(event.processKey);
  }

  searchInmueble() {
    if (!this.eventSelectedInmueble)
      return this.alert(
        'warning',
        'Es necesario especificar un evento para consultar',
        ''
      );

    this.disabledBtnCerrar = true;
    this.acordionOpen = true;
    this.totalItems = 0;
    this.clickSearch = true;
    // this.amountList = [];
    // this.typeEvents = event.data;
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerClientsXEvent('si'));
  }

  clearInmueble() {
    this.formInmueble.reset();
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.eventSelectedInmueble = null;
    this.getComerEventsInmueble(new ListParams());
    this.clearSubheaderFields();
  }

  async enviarSIRSAExCliente() {
    if (!this.eventSelectedInmueble) {
      this.alert('warning', 'Es necesario especificar un evento', '');
      return;
    }
    const data: any = this.data.getAll().then(async resp => {
      if (resp.length > 0) {
        this.loading = true;
      }
      this.loadingBtn = true;

      // VALIDA_PAGOSXCLI
      await this.VALIDA_PAGOSXCLI(this.eventSelectedInmueble.id);

      // ENVIAR_SIRSAE(1);
      const resss: any = await this.sendSirsaexCliente(1, []);
      console.log('RESS', resss);
      if (resss.status == 400 || resss.status == 500) {
        if (
          resss.message == 'ERROR EN LA CONEXION A SIRSAE' ||
          resss.message ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
          resss.message ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
          resss.message ==
            'ConnectionError: Failed to connect to 172.20.226.12\\cluster2016 in 15000ms' ||
          resss.message ==
            'ConnectionError: Failed to connect to 172.20.226.12:undefined - Could not connect (sequence)'
        ) {
          this.alert(
            'error',
            'Error de Conexión',
            'No se pudo conectar a la Base de Datos (SIRSAE)'
          );
          this.loadingBtn = false;
          await this.getComerClientsXEvent('no');
          return;
        } else {
          this.alert(
            'error',
            'Ha ocurrido un error al intentar enviar a SIRSAE',
            ''
          );
          this.loadingBtn = false;
          await this.getComerClientsXEvent('no');
          return;
        }
      } else {
        // ACT_EST_EVE
        await this.ACT_EST_EVE(this.eventSelectedInmueble.id);
        this.loadingBtn = false;
        this.alert('success', 'Proceso terminado correctamente', '');
        await this.getComerClientsXEvent('no');
      }
    });
  }

  ACT_EST_EVE(Evento: any) {
    return new Promise((resolve, reject) => {
      this.interfacesirsaeService.actEstEve(Evento).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  VALIDA_PAGOSXCLI(Evento: any) {
    return new Promise((resolve, reject) => {
      this.interfacesirsaeService.validatePaymentsXcli(Evento).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async sendSirsaexCliente(process: any, data: any) {
    let obj = {
      process: process,
      event: this.eventSelectedInmueble.id,
      // customerXevent: data,
    };
    return new Promise((resolve, reject) => {
      this.paymentService.sendSirsaeFcomer112(obj).subscribe({
        next: response => {
          let obj = {
            status: 200,
            message: 'OK',
          };
          resolve(obj);
        },
        error: error => {
          console.log('error', error);
          let obj = {
            status: error.status,
            message: error.error.message,
          };
          resolve(obj);
        },
      });
    });
  }

  obtenerOIxCliente() {
    if (!this.eventSelectedInmueble) {
      this.alert('warning', 'Es necesario especificar un evento', '');
      return;
    }

    const data: any = this.data.getAll().then(async resp => {
      if (resp.length > 0) this.loading = true;
      const resss = await this.sendSirsaexCliente(2, []);
      if (
        resss == 'ERROR EN LA CONEXION A SIRSAE' ||
        resss ==
          'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
        resss ==
          'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
        resss ==
          'ConnectionError: Failed to connect to 172.20.226.12\\cluster2016 in 15000ms' ||
        resss ==
          'ConnectionError: Failed to connect to 172.20.226.12:undefined - Could not connect (sequence)'
      ) {
        this.alert(
          'error',
          'Error de conexión',
          'No se pudo conectar a la Base de Datos (SIRSAE)'
        );
        await this.getComerClientsXEvent('no');
        return;
      } else {
        this.alert('success', 'Proceso terminado correctamente', '');
        // this.loading = false;
        await this.getComerClientsXEvent('no');
      }
    });
  }

  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
