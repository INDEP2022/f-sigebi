import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
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
  columnFilters: any = [];
  acordionOpen: boolean = false;
  disabledBtnCerrar: boolean = false;
  loadingBtn: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private comerEventService: ComerEventService,
    private comerClientsService: ComerClientsService,
    private modalService: BsModalService,
    private comerInvoiceService: ComerInvoiceService,
    private paymentService: PaymentService
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

  private prepareForm(): void {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
      batch: [null],
      description: [null],
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
  }

  selectBatch(batch: any) {
    this.selectedBatch = batch;
  }

  selectClients(rows: any[]) {
    this.clientRows = rows;
  }

  // ---------------------- WILMER ---------------------- //

  getComerEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);

    params.addFilter('address', `M`, SearchFilter.EQ);
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
  }

  // COMER_CLIENTESXEVENTO
  async getComerClientsXEvent(filter: any) {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.eventId'] = `$eq:${this.eventSelected.id}`;
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

  search() {
    if (!this.eventSelected)
      return this.alert(
        'warning',
        'Debe Seleccionar un Evento para Consultar',
        ''
      );

    this.disabledBtnCerrar = true;
    this.acordionOpen = true;
    this.totalItems = 0;
    // this.amountList = [];
    // this.typeEvents = event.data;

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerClientsXEvent('si'));
  }

  clear() {
    this.form.reset();
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.disabledBtnCerrar = false;
    this.acordionOpen = false;
  }
  edit(event: any) {
    console.log('aaa', event);
    this.openForm(event, true);
  }
  add() {
    this.openForm(null, false);
  }
  openForm(data: any, editVal: boolean) {
    if (!this.eventSelected) {
      this.alert('warning', 'Debe Seleccionar un Evento', '');
      return;
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
    if (!this.eventSelected) {
      this.alert('warning', 'Debe Seleccionar un Evento', '');
      return;
    }

    if (this.data.count() == 0) {
      this.alert('warning', 'No hay Clientes Cargados en la Tabla', '');
      return;
    }

    const data: any = this.data.getAll().then(resp => {
      if (resp.length > 0) this.loading = true;

      let result = resp.map(async (item: any) => {
        item.sendedSirsae = item.sendedSirsae == null ? 'N' : item.sendedSirsae;
        if (item.sendedSirsae != 'S') {
          item.sendSirsae = 'N';
          delete item.rfc;
          delete item.name;
          await this.update(item);
        }
      });

      Promise.all(result).then(resp => {
        // this.loading = false;
        this.getComerClientsXEvent('no');
        // this.data.refresh()
      });
    });
  }
  allYes() {
    if (!this.eventSelected) {
      this.alert('warning', 'Debe Seleccionar un Evento', '');
      return;
    }

    if (this.data.count() == 0) {
      this.alert('warning', 'No hay Clientes Cargados en la Tabla', '');
      return;
    }

    const data: any = this.data.getAll().then(resp => {
      if (resp.length > 0) this.loading = true;
      let result = resp.map(async (item: any) => {
        item.sendedSirsae = item.sendedSirsae == null ? 'N' : item.sendedSirsae;
        if (item.sendedSirsae != 'S') {
          item.sendSirsae = 'S';
          delete item.rfc;
          delete item.name;
          await this.update(item);
        }
      });

      Promise.all(result).then(async resp => {
        // this.loading = false;
        await this.getComerClientsXEvent('no');
        // this.data.refresh()
      });
    });
  }

  // UPDATE CLIENTES X EVENTOS //
  async update(body: any) {
    return new Promise((resolve, reject) => {
      this.comerClientsService.updateClientXEvent(body).subscribe({
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
      this.alert('warning', 'Debe Seleccionar un Evento', '');
      return;
    }

    // if (this.data.count() == 0) {
    //   this.alert('warning', 'No hay Clientes Cargados en la Tabla', '');
    //   return;
    // }

    // await this.validaPagos()

    const data: any = this.data.getAll().then(async resp => {
      if (resp.length > 0) {
        this.loading = true;
        this.loadingBtn = true;
      }
      let arr: any = [];
      let result = resp.map(async (item: any) => {
        const rfc = item.rfc;
        // VALIDA_PAGOS
        const valid1 = await this.validPayments(item);
        if (valid1 == 0) {
          this.alert(
            'warning',
            `El Cliente ${item.customerId} No tiene Pagos y no se Enviará a SIRSAE `,
            ''
          );
          item.sendSirsae = 'N';
          delete item.rfc;
          delete item.name;
          await this.update(item);
        }

        let obj = {
          sendSirsae: item.sendSirsae,
          sentSirsae: item.sendedSirsae,
          rfc: rfc,
          customer: item.clientId,
        };
        arr.push(obj);
      });

      Promise.all(result).then(async resp => {
        const resss = await this.sendSirsae(1, arr);

        if (
          resss == 'ERROR EN LA CONEXION A SIRSAE' ||
          resss ==
            'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms'
        ) {
          this.alert(
            'error',
            'Error de Conexión, No se Pudo Conectar a la Base de Datos (SIRSAE)',
            ''
          );
          this.loadingBtn = false;
          await this.getComerClientsXEvent('no');
        } else {
          // ACT_EST_EVE
          const valid2 = await this.actEstEve();
          if (valid2 == 0) {
            let obj = {
              statusVtaId: 'CONC',
              id: this.eventSelected.id,
              eventTpId: this.eventSelected.eventTpId,
            };

            await this.updateEvents(this.eventSelected.id, obj);
          } else {
            let obj = {
              statusVtaId: 'PCON',
              id: this.eventSelected.id,
              eventTpId: this.eventSelected.eventTpId,
            };
            await this.updateEvents(this.eventSelected.id, obj);
          }

          this.alert('success', 'Proceso Terminado Correctamente', '');
          this.loadingBtn = false;
          await this.getComerClientsXEvent('no');
        }
      });
    });
  }

  actEstEve() {
    const params = new ListParams();
    params['filter.idEvent'] = `$eq:${this.eventSelected.id}`;
    params['filter.sendedSirsae'] = `$eq:N`;
    return new Promise((resolve, reject) => {
      this.comerClientsService.getComerClientsXEventgetAllV2(params).subscribe({
        next: response => {
          resolve(response.count);
        },
        error: err => {
          resolve(0);
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
            `El Cliente ${item.customerId} No tiene Pagos y no se Enviará a SIRSAE `,
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
      event: this.eventSelected.id,
      customerXevent: data,
    };
    // {
    //   process: process,
    //   event: data.eventId,
    //   sendSirsae: data.sendSirsae,
    //   sentSirsae: data.sendedSirsae,
    //   rfc: data.rfc,
    // };
    return new Promise((resolve, reject) => {
      this.paymentService.sendSirsaeFcomer112(obj).subscribe({
        next: response => {
          resolve(true);
          // this.alert('success', 'Proceso Ejecutado Correctamente', '');
          // this.getPayments();
        },
        error: error => {
          console.log('error', error);
          resolve(error.error.message);
        },
      });
    });
  }

  obtenerOI() {
    if (!this.eventSelected) {
      this.alert('warning', 'Debe Seleccionar un Evento', '');
      return;
    }

    const data: any = this.data.getAll().then(async resp => {
      if (resp.length > 0) this.loading = true;

      // let arr: any = []
      // let result = resp.map(async (item: any) => {
      //   const rfc = item.rfc;
      //   let obj = {
      //     sendSirsae: item.sendSirsae,
      //     sentSirsae: item.sendedSirsae,
      //     rfc: rfc,
      //     customer: item.clientId
      //   }

      //   arr.push(obj)
      // });

      // Promise.all(result).then(async resp => {
      const resss = await this.sendSirsae(2, []);
      if (resss == 'ERROR EN LA CONEXION A SIRSAE') {
        this.alert(
          'error',
          'Error de Conexión, No se pudo Conectar a la Base de Datos (SIRSAE)',
          ''
        );
        await this.getComerClientsXEvent('no');
      } else {
        this.alert('success', 'Proceso Terminado Correctamente', '');
        // this.loading = false;
        await this.getComerClientsXEvent('no');
      }

      // });
    });
  }
}
