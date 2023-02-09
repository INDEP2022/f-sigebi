import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
  movementForm: FormGroup = new FormGroup({});
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  selectedEvent: any = null;
  selectedBatch: any = null;
  clientRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  movementColumns: any[] = [];
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

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    super();
    this.movementSettings.columns = SIRSAE_MOVEMENT_SENDING_COLUMNS;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        if (this.navigateCount > 0) {
          this.movementForm.reset();
          this.clientRows = [];
          window.location.reload();
        }
        this.layout = params.get('goodType');
        this.navigateCount += 1;
      }
    });
    this.prepareForm();
    this.getData();
    this.getEvents({ page: 1, text: '' });
    this.getBatches({ page: 1, text: '' });
  }

  private prepareForm(): void {
    this.movementForm = this.fb.group({
      event: [null, [Validators.required]],
      batch: [null, [Validators.required]],
    });
  }

  getData() {
    this.movementColumns = this.clientsTestData;
    this.totalItems = this.movementColumns.length;
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
    this.selectedEvent = event;
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
}
