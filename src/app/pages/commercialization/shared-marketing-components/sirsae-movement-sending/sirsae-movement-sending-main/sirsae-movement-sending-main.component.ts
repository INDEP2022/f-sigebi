import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SIRSAE_MOVEMENT_SENDING_COLUMNS } from './sirsae-movement-sending-columns';

@Component({
  selector: 'app-sirsae-movement-sending-main',
  templateUrl: './sirsae-movement-sending-main.component.html',
  styles: [],
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
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private comerEventService: ComerEventService,
    private comerClientsService: ComerClientsService
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

  sendSirsae(type: string = '') {
    switch (type) {
      case 'BATCH':
        console.log(this.clientRows);
        break;
      case 'CLIENT':
        console.log(this.clientRows);
        break;
      default:
        console.log(this.clientRows);
        break;
    }
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

  getComerClientsXEvent() {
    this.loading = true;
    const params = new FilterParams();
    params.addFilter('eventId', this.eventSelected.id, SearchFilter.EQ);
    this.comerClientsService.getAll_(params.getParams()).subscribe({
      next: data => {
        this.data.load(data.data);
        this.data.refresh();
        this.totalItems = data.count;
        this.loading = false;
      },
      error: err => {
        this.alert(
          'warning',
          'No se Encontraron Clientes para este Evento',
          ''
        );
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  search() {
    if (!this.eventSelected)
      return this.alert(
        'warning',
        'Debe Seleccionar un Evento para Consultar',
        ''
      );

    this.totalItems = 0;
    // this.amountList = [];
    // this.typeEvents = event.data;

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerClientsXEvent());
  }

  edit($event: any) {}

  openForm() {}

  enviarSIRSAE() {}

  allNo() {}
  allYes() {}
}
