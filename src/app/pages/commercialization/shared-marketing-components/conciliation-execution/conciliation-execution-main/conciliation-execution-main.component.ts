import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CONCILIATION_EXECUTION_COLUMNS } from './conciliation-execution-columns';

@Component({
  selector: 'app-conciliation-execution-main',
  templateUrl: './conciliation-execution-main.component.html',
  styles: [],
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
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private comerEventService: ComerEventService
  ) {
    super();
    this.conciliationSettings.columns = CONCILIATION_EXECUTION_COLUMNS;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        if (this.navigateCount > 0) {
          // this.movementForm.reset();
          // this.clientRows = [];
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
    this.selectedEvent = event;
  }

  selectBatch(batch: any) {
    this.selectedBatch = batch;
  }

  selectClients(rows: any[]) {
    this.clientRows = rows;
  }

  execute() {}

  modify() {}

  cancel() {}

  // ----------------------- WILMER ----------------------- //
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
}
