import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { trigger, transition, style, animate } from '@angular/animations';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-c-m-lcs-massive-conversion-main',
  templateUrl: './c-m-lcs-massive-conversion-main.component.html',
  styles: [],
  animations: [
    trigger('OnEventSelected', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class CMLcsMassiveConversionMainComponent
  extends BasePage
  implements OnInit
{
  consultForm: FormGroup = new FormGroup({});
  selectedEvent: any = null;
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  operationItems = new DefaultSelect();
  toggleFilter: boolean = true;
  maintenance: boolean = true;
  operationId: number = 0;
  totalEntries: number = 0;
  generatedLcs: number = 0;
  dataTotalItems: number = 0;
  lcsTotalItems: number = 0;
  dataColumns: any[] = [];
  lcsColumns: any[] = [];
  dataParams = new BehaviorSubject<ListParams>(new ListParams());
  lcsParams = new BehaviorSubject<ListParams>(new ListParams());
  dataSettings = {
    ...TABLE_SETTINGS,
  };
  lcsSettings = {
    ...TABLE_SETTINGS,
  };
  eventTestData: any[] = [
    {
      id: 22410,
      cve: 'LPBM PRUEBAS',
      date: '14/07/2021',
      place: 'CIUDAD DE MÉXICO',
      rulingDate: '15/07/2021',
      status: 'VENDIDO',
    },
  ];

  batchTestData: any[] = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ];

  operationTestData: any[] = [
    {
      id: 101,
    },
    {
      id: 102,
    },
    {
      id: 103,
    },
    {
      id: 104,
    },
    {
      id: 105,
    },
  ];

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getEvents({ inicio: 1, text: '' });
    this.getBatches({ inicio: 1, text: '' });
    this.getOperations({ inicio: 1, text: '' });
  }

  prepareForm() {
    this.consultForm = this.fb.group({
      id: [null, [Validators.required]],
      batchId: [null],
      status: [null],
      operationId: [null],
      insertDate: [null],
      validityDate: [null],
    });
  }

  getEvents(params: ListParams) {
    if (params.text == '') {
      this.eventItems = new DefaultSelect(this.eventTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.eventTestData.filter((i: any) => i.id == id)];
      this.eventItems = new DefaultSelect(item[0], 1);
    }
  }

  getBatches(params: ListParams) {
    if (params.text == '') {
      this.batchItems = new DefaultSelect(this.batchTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.batchTestData.filter((i: any) => i.id == id)];
      this.batchItems = new DefaultSelect(item[0], 1);
    }
  }

  getOperations(params: ListParams) {
    if (params.text == '') {
      this.operationItems = new DefaultSelect(this.operationTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.operationTestData.filter((i: any) => i.id == id)];
      this.operationItems = new DefaultSelect(item[0], 1);
    }
  }

  selectEvent(event: any) {
    this.selectedEvent = event;
  }

  resetFilter() {}

  consult() {}

  loadRFC() {}

  loadClientId() {}

  loadChecks() {}

  generateLcs() {}

  addRow() {}

  editRow() {}

  rework() {}

  exportExcel() {}
}
