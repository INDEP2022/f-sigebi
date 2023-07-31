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
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private comerEventService: ComerEventService,
    private comerClientsService: ComerClientsService,
    private modalService: BsModalService,
    private comerEventosService: ComerEventosService,
    private lotService: LotService
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
      date: [null, [Validators.required]],
      phase: [null, [Validators.required]],
      batch: [null],
      price: [null],
    });
  }

  getData() {
    this.conciliationColumns = this.clientsTestData;
    this.totalItems = this.conciliationColumns.length;
  }

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

  selectEvent(event: any) {
    console.log(event);
    this.selectedEvent = event;
    if (event) {
      this.conciliationForm.get('description').setValue(event.cve_proceso);
      this.getLotes(new ListParams());
    }
  }

  selectBatch(batch: any) {
    this.selectedBatch = batch;
  }

  selectClients(rows: any[]) {
    this.clientRows = rows;
  }

  execute() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Ejecutar',
        ''
      );
  }

  modify() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Modificar',
        ''
      );
  }

  cancel() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Deshacer',
        ''
      );
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
    this.disabledBtnCerrar = false;
    this.acordionOpen = false;
    this.selectedEvent = null;
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

    const data: any = this.data.getAll().then(resp => {
      if (resp.length > 0) this.loading = true;
      let result = resp.map(async (item: any) => {
        item.process = 'N';
        delete item.rfc;
        delete item.name;
        await this.update(item);
      });

      Promise.all(result).then(async resp => {
        // this.loading = false;
        await this.getComerClientsXEvent('no');
        // this.data.refresh()
      });
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

    const data: any = this.data.getAll().then(resp => {
      if (resp.length > 0) this.loading = true;
      let result = resp.map(async (item: any) => {
        item.process = 'S';
        delete item.rfc;
        delete item.name;
        await this.update(item);
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
      V_IDTPVENTO = respEvent.V_IDTPVENTO;
      V_FASE = respEvent.V_FASE;
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
      // this.comerClientsService.updateClientXEvent(body).subscribe({
      //   next: response => {
      //     resolve(true);
      //   },
      //   error: err => {
      //     resolve(false);
      //     console.log('ERR', err);
      //   },
      // });
    });
  }

  getLotes(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idLot', lparams.text, SearchFilter.EQ);
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
          item['idAndDesc'] = item.idLot + ' - ' + item.description;
        });

        Promise.all(result).then(resp => {
          this.lotes = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.lotes = new DefaultSelect();
      },
    });
  }
}
