import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AddLcModalComponent } from '../components/add-lc-modal/add-lc-modal.component';
import { TableCheckboxComponent } from '../components/table-checkbox/table-checkbox.component';
import {
  BATCH_REWORK_COLUMNS,
  CLIENTID_LAYOUT_COLUMNS,
  DATA_COLUMNS,
  LCS_COLUMNS,
  RFC_LAYOUT_COLUMNS,
  RFC_REWORK_COLUMNS,
} from './massive-conversion-columns';

@Component({
  selector: 'app-massive-conversion-main',
  templateUrl: './massive-conversion-main.component.html',
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
export class MassiveConversionMainComponent extends BasePage implements OnInit {
  consultForm: FormGroup = new FormGroup({});
  selectedEvent: any = null;
  // eventItems: IComerEvent[] = []//new DefaultSelect();
  batchItems = new DefaultSelect();
  operationItems = new DefaultSelect();
  toggleFilter: boolean = true;
  maintenance: boolean = false;
  rowsAdded: boolean = false;
  operationId: number = 0;
  totalEntries: number = 0;
  generatedLcs: number = 0;
  dataTotalItems: number = 0;
  dataColumns: any[] = [];
  layout: string = 'RFC'; // 'RFC' || 'clientId'
  reworkType: string = 'CLIENT'; // 'BATCH' || 'CLIENT'
  lcSource: LocalDataSource;
  addRows: any[] = [];
  editedRowModal: any;
  editedRowTable: any;
  reworkEntries: any[] = [];
  lcsTotalItems: number = 0;
  rfcTotalItems: number = 0;
  clientIdTotalItems: number = 0;
  batchReworkTotalItems: number = 0;
  rfcReworkTotalItems: number = 0;
  lcsColumns: any[] = [];
  rfcColumns: any[] = [];
  clientIdColumns: any[] = [];
  batchReworkColumns: any[] = [];
  rfcReworkColumns: any[] = [];
  dataParams = new BehaviorSubject<ListParams>(new ListParams());
  lcsParams = new BehaviorSubject<ListParams>(new ListParams());
  rfcParams = new BehaviorSubject<ListParams>(new ListParams());
  batchReworkParams = new BehaviorSubject<ListParams>(new ListParams());
  rfcReworkParams = new BehaviorSubject<ListParams>(new ListParams());
  clientIdParams = new BehaviorSubject<ListParams>(new ListParams());
  @ViewChild('lcsTabs', { static: false }) lcsTabs?: TabsetComponent;
  dataSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  lcsSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  rfcSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'left',
      add: true,
      edit: true,
      delete: true,
    },
  };
  clientIdSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'left',
      add: true,
      edit: true,
      delete: true,
    },
  };
  batchReworkSettings = {
    ...TABLE_SETTINGS,
    selectMode: 'multi',
    attr: {
      class: 'table-bordered center-checkbox',
    },
  };
  rfcReworkSettings = {
    ...TABLE_SETTINGS,
    selectMode: 'multi',
    attr: {
      class: 'table-bordered center-checkbox',
    },
  };
  events = new DefaultSelect<IComerEvent>();
  // [] = [
  //   // {
  //   //   id: 22410,
  //   //   cve: 'LPBM PRUEBAS',
  //   //   date: '14/07/2021',
  //   //   place: 'CIUDAD DE MÉXICO',
  //   //   rulingDate: '15/07/2021',
  //   //   status: 'VENDIDO',
  //   // },
  // ];

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

  checkTestData = [
    {
      eventId: 22410,
      batchId: 3544010,
      batch: 1,
      clientId: 13369,
      rfc: 'ZAVA7206027D0',
      amount: 10000,
      validitydate: '15/07/2021',
      checkNumber: 2285,
      checkBank: 'BBVA BANCOMER',
      status: 'LC GENERADA',
      observations: '',
    },
    {
      eventId: 22410,
      batchId: 3544011,
      batch: 2,
      clientId: 8696,
      rfc: 'MOSF690531FK5',
      amount: 10000,
      validitydate: '15/07/2021',
      checkNumber: 2287,
      checkBank: 'BBVA BANCOMER',
      status: 'LC GENERADA',
      observations: '',
    },
    {
      eventId: 22410,
      batchId: 3544013,
      batch: 4,
      clientId: 9539,
      rfc: 'NACR630606ENA',
      amount: 10000,
      validitydate: '15/07/2021',
      checkNumber: 2289,
      checkBank: 'BBVA BANCOMER',
      status: 'LC GENERADA',
      observations: '',
    },
  ];

  lcsTestData = [
    {
      id: 44926,
      eventId: 22410,
      batchId: 3482610,
      clientId: 10381,
      amount: 20000,
      gsaeRef: 'REFTEST123',
      gbankRef: 'BANKREF1234',
      validityDate: '15/07/2021',
      status: 'PAG',
      checkBank: 'BBVA BANCOMER',
      checkNumber: 2292,
    },
    {
      id: 44927,
      eventId: 22410,
      batchId: 3482610,
      clientId: 12187,
      amount: 10000,
      gsaeRef: 'REFTEST123',
      gbankRef: 'BANKREF1234',
      validityDate: '15/07/2021',
      status: 'PAG',
      checkBank: 'BBVA BANCOMER',
      checkNumber: 2293,
    },
    {
      id: 44928,
      eventId: 22410,
      batchId: 3482610,
      clientId: 12187,
      amount: 20000,
      gsaeRef: 'REFTEST123',
      gbankRef: 'BANKREF1234',
      validityDate: '15/07/2021',
      status: 'PAG',
      checkBank: 'BBVA BANCOMER',
      checkNumber: 2294,
    },
  ];

  rfcTestdata = [
    {
      rfc: 'MOSF690531FK5',
      batch: 1,
      amount: 10000,
      palette: 1,
      checkNumber: 2285,
      checkBank: 'BBVA BANCOMER',
      validityDate: '15/07/2021',
      gsaeRef: 1133690012285,
      gbankRef: 8012785,
      status: 'PAG',
      registerDate: '14/07/2021',
      type: 'CHECK',
    },
    {
      rfc: 'MOSF690531JU6',
      batch: 1,
      amount: 20000,
      palette: 1,
      checkNumber: 2286,
      checkBank: 'BBVA BANCOMER',
      validityDate: '15/07/2021',
      gsaeRef: 1133690012286,
      gbankRef: 8012486,
      status: 'PAG',
      registerDate: '14/07/2021',
      type: 'CHECK',
    },
    {
      rfc: 'MOSF690531LW1',
      batch: 2,
      amount: 10000,
      palette: 1,
      checkNumber: 2287,
      checkBank: 'BBVA BANCOMER',
      validityDate: '15/07/2021',
      gsaeRef: 1133690012287,
      gbankRef: 8012753,
      status: 'PAG',
      registerDate: '14/07/2021',
      type: 'CHECK',
    },
  ];

  clientIdTestData = [
    {
      rfc: 13369,
      batch: 1,
      amount: 10000,
      palette: 1,
      checkNumber: 2285,
      checkBank: 'BBVA BANCOMER',
      validityDate: '15/07/2021',
      gsaeRef: 1133690012285,
      gbankRef: 8012785,
      status: 'PAG',
      registerDate: '14/07/2021',
      type: 'CHECK',
    },
    {
      rfc: 13369,
      batch: 1,
      amount: 20000,
      palette: 1,
      checkNumber: 2286,
      checkBank: 'BBVA BANCOMER',
      validityDate: '15/07/2021',
      gsaeRef: 1133690012286,
      gbankRef: 8012486,
      status: 'PAG',
      registerDate: '14/07/2021',
      type: 'CHECK',
    },
    {
      rfc: 8696,
      batch: 2,
      amount: 10000,
      palette: 1,
      checkNumber: 2287,
      checkBank: 'BBVA BANCOMER',
      validityDate: '15/07/2021',
      gsaeRef: 1133690012287,
      gbankRef: 8012753,
      status: 'PAG',
      registerDate: '14/07/2021',
      type: 'CHECK',
    },
  ];

  rfcReworkTestData = [
    {
      rfc: 'AARM63022RJ6',
      name: 'MISAEL VICENTE ALVAREZ RODRIGUEZ',
    },
    {
      rfc: 'GOEJ800613RL8',
      name: 'FERNANDO MORALES SOTO',
    },
    {
      rfc: 'ZAVA7206027D0',
      name: 'ROBERTO NAVA CAZARES',
    },
  ];

  batchReworkTestData = [
    {
      batch: 3454963,
      description: 'DESCRIPTION TEST 1234567890',
    },
    {
      batch: 3454964,
      description: 'DESCRIPTION TEST 1234567890',
    },
    {
      batch: 3454965,
      description: 'DESCRIPTION TEST 1234567890',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private modalService: BsModalService,
    private comerEventosService: ComerEventosService
  ) {
    super();
    this.dataSettings.columns = DATA_COLUMNS;
    this.lcsSettings.columns = LCS_COLUMNS;
    this.rfcSettings.columns = RFC_LAYOUT_COLUMNS;
    this.clientIdSettings.columns = CLIENTID_LAYOUT_COLUMNS;
    this.batchReworkSettings.columns = BATCH_REWORK_COLUMNS;
    this.rfcReworkSettings.columns = RFC_REWORK_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getEvents({ page: 1, text: '' });
    this.getBatches({ page: 1, text: '' });
    this.getOperations({ page: 1, text: '' });
    this.rfcSettings.columns = this.modifyColumns(this.rfcSettings.columns);
    this.clientIdSettings.columns = this.modifyColumns(
      this.clientIdSettings.columns
    );
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
    // if (params.text == '') {
    //   this.eventItems = new DefaultSelect(this.events, 5);
    // } else {
    //   const id = parseInt(params.text);
    //   const item = [this.events.filter((i: any) => i.id == id)];
    //   this.eventItems = new DefaultSelect(item[0], 1);
    // }
    if (!params.text) {
      this.events = new DefaultSelect([], 1);
    }
    if (!isNaN(params.text as any)) {
      this.comerEventosService.getById(params.text).subscribe({
        next: (res: any) => {
          this.events = new DefaultSelect([res], 1);
        },
        error: () => {
          this.events = new DefaultSelect([], 1);
        },
      });
    } else {
      this.comerEventosService.getAll(params).subscribe({
        next: (res: any) => {
          this.events = new DefaultSelect(res.data, 1);
        },
        error: () => {
          this.events = new DefaultSelect([], 1);
        },
      });
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

  resetFilter() {
    this.consultForm.controls['batchId'].setValue(null);
    this.consultForm.controls['status'].setValue(null);
    this.consultForm.controls['operationId'].setValue(null);
    this.consultForm.controls['insertDate'].setValue(null);
    this.consultForm.controls['validityDate'].setValue(null);
  }

  consult() {
    console.log(this.consultForm.value);
    this.dataColumns = this.checkTestData;
  }

  getCsv(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1)
      throw 'No seleccionó ningún archivo o seleccionó más de la cantidad permitida (1)';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      let arr = this.excelService.getData(binaryExcel);
      console.log(arr);
      this.maintenance = true;
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  loadChecks() {
    this.dataColumns = this.checkTestData;
  }

  generateLcs() {
    this.lcsColumns = this.lcsTestData;
    this.lcsTotalItems = this.lcsColumns.length;
    if (this.layout == 'RFC') {
      this.rfcColumns = this.rfcTestdata;
      this.rfcColumns = this.modifyType(this.rfcColumns);
      this.rfcTotalItems = this.rfcColumns.length;
      this.lcSource = new LocalDataSource(this.rfcColumns);
    }
    if (this.layout == 'clientId') {
      this.clientIdColumns = this.clientIdTestData;
      this.clientIdColumns = this.modifyType(this.clientIdColumns);
      this.clientIdTotalItems = this.clientIdColumns.length;
      this.lcSource = new LocalDataSource(this.clientIdColumns);
    }
    this.batchReworkColumns = this.batchReworkTestData;
    this.batchReworkTotalItems = this.batchReworkColumns.length;
    this.rfcReworkColumns = this.rfcReworkTestData;
    this.rfcReworkTotalItems = this.rfcReworkColumns.length;
    this.maintenance = true;
    this.lcsTabs.tabs[1].active = true;
  }

  hideActions() {
    setTimeout(() => {
      let actions = document.querySelectorAll('a.ng2-smart-action');
      actions.forEach((a, i) => {
        let action = actions.item(i);
        action.classList.add('d-none');
      });
    }, 400);
  }

  modifyType(columns: any[]) {
    columns = columns.map((c, i) => {
      let type: boolean;
      c.type == 'CHECK' ? (type = true) : (type = false);
      c = {
        ...c,
        typeCheck: type,
        typeLine: !type,
      };
      delete c.type;
      return c;
    });
    return columns;
  }

  revertType(obj: any) {
    let type: string;
    obj.typeCheck == true ? (type = 'CHECK') : (type = 'LINE');
    obj = {
      ...obj,
      type: type,
    };
    delete obj.typeCheck;
    delete obj.typeLine;
    return obj;
  }

  modifyColumns(columns: any) {
    columns = {
      ...columns,
      typeCheck: {
        title: 'Cheque',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckboxComponent,
      },
      typeLine: {
        title: 'Línea',
        type: 'custom',
        sort: false,
        renderComponent: TableCheckboxComponent,
      },
    };
    delete columns.type;
    return columns;
  }

  openModal(context?: Partial<AddLcModalComponent>) {
    const modalRef = this.modalService.show(AddLcModalComponent, {
      initialState: { ...context, layout: this.layout },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onAdd.subscribe(data => {
      if (data) this.addRow(data);
    });
    modalRef.content.onEdit.subscribe(data => {
      if (data) this.editRow(data);
    });
  }

  openForm(lc?: any) {
    if (this.addRows.length == 0) {
      this.onLoadToast(
        'error',
        'Acción no permitida',
        'No se permite alteración de registros previos.'
      );
      return;
    }
    this.openModal({ lc });
    if (lc) {
      this.editedRowModal = this.revertType(lc);
      this.editedRowTable = lc;
    }
  }

  delete(lc: any) {
    if (this.addRows.length == 0) {
      this.onLoadToast(
        'error',
        'Acción no permitida',
        'No se permite alteración de registros previos.'
      );
      return;
    }
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.lcSource.remove(lc);
        let row = this.revertType(lc);
        let idx = this.addRows.findIndex(
          c => JSON.stringify(c) == JSON.stringify(row)
        );
        if (idx != -1) {
          this.addRows.splice(idx, 1);
        }
      }
    });
  }

  addRow(lc: any) {
    let arr = [lc];
    arr = this.modifyType(arr);
    this.lcSource.append(arr[0]);
    this.layout == 'RFC'
      ? (this.rfcTotalItems = this.lcSource.count())
      : (this.clientIdTotalItems = this.lcSource.count());
    this.addRows.push(lc);
  }

  editRow(lc: any) {
    let arr = [lc];
    arr = this.modifyType(arr);
    this.lcSource.update(this.editedRowTable, arr[0]);
    let idx = this.addRows.findIndex(
      c => JSON.stringify(c) == JSON.stringify(this.editedRowModal)
    );
    if (idx != -1) {
      this.addRows[idx] = lc;
    }
  }

  saveRows() {
    console.log(this.addRows);
    this.onLoadToast(
      'success',
      'Líneas de Captura',
      'Registros agregados exitosamente'
    );
  }

  reworkSelect(data: any) {
    this.reworkEntries = data;
  }

  rework() {
    this.alertQuestion(
      'question',
      '¿Desea continuar?',
      'La siguiente operación reprocesará el evento',
      'Sí'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(this.reworkEntries);
        this.onLoadToast(
          'success',
          'Reproceso',
          'El reproceso se ejecutó con éxito'
        );
      }
    });
  }

  exportExcel() {
    const filename: string = 'Líneas_de_Captura';
    this.excelService.export(this.lcsColumns, { filename });
  }
}
