import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PaymentSearchModalComponent } from '../payment-search-modal/payment-search-modal.component';
import { PAYMENT_COLUMNS } from './payment-search-columns';

@Component({
  selector: 'app-payment-search-list',
  templateUrl: './payment-search-list.component.html',
  styles: [],
})
export class PaymentSearchListComponent extends BasePage implements OnInit {
  searchForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  addRows: any[] = [];
  editRows: any[] = [];
  selectedRows: any[] = [];
  paymentColumns: any[] = [];
  totalItems: number = 0;
  eventItems = new DefaultSelect();
  bankItems = new DefaultSelect();
  paymentSettings = {
    ...TABLE_SETTINGS,
    selectMode: 'multi',
  };

  eventsTestData = [
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

  banksTestData = [
    {
      id: 1,
      description: 'BANAMEX',
    },
    {
      id: 2,
      description: 'BANCO SANTANDER',
    },
    {
      id: 3,
      description: 'BANORTE',
    },
    {
      id: 4,
      description: 'HSBC',
    },
    {
      id: 5,
      description: 'BBVA BANCOMER',
    },
  ];

  paymentTestData = [
    {
      movement: 41678,
      date: '12/09/2021',
      originalReference: 'GES515SHEH588TE',
      reference: 'INAE8166XG2PL',
      amount: 10000,
      cve: 'EGW52843',
      code: 51661,
      publicBatch: 9273,
      event: 14267,
      systemValidity: 'B',
      result: 'TEST RESULT FOR DEVELOPMENT',
      paymentId: 16834739,
      batchId: 122970,
      entryOrderId: 11387,
      satDescription: 'TRANSFERENCIA ELECTRÓNICA',
      type: 'L',
      inconsistencies: '19 La referncia de carga CSV generó un conflicto',
    },
    {
      movement: 41876,
      date: '13/09/2021',
      originalReference: 'GES515SHEH588TE',
      reference: 'INAE8166XG2PL',
      amount: 20000,
      cve: 'EGW52843',
      code: 51661,
      publicBatch: 9273,
      event: 14267,
      systemValidity: 'B',
      result: 'TEST RESULT FOR DEVELOPMENT',
      paymentId: 16834739,
      batchId: 122970,
      entryOrderId: 11387,
      satDescription: 'TRANSFERENCIA ELECTRÓNICA',
      type: 'L',
      inconsistencies: '19 La referncia de carga CSV generó un conflicto',
    },
    {
      movement: 41937,
      date: '14/09/2021',
      originalReference: 'GES515SHEH588TE',
      reference: 'INAE8166XG2PL',
      amount: 15000,
      cve: 'EGW52843',
      code: 51661,
      publicBatch: 9273,
      event: 14267,
      systemValidity: 'B',
      result: 'TEST RESULT FOR DEVELOPMENT',
      paymentId: 16834739,
      batchId: 122970,
      entryOrderId: 11387,
      satDescription: 'TRANSFERENCIA ELECTRÓNICA',
      type: 'L',
      inconsistencies: '19 La referncia de carga CSV genero un conflicto',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private modalService: BsModalService
  ) {
    super();
    this.paymentSettings.columns = PAYMENT_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.searchForm = this.fb.group({
      event: [null, [Validators.required]],
      batch: [null, [Validators.required]],
      bank: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      reference: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      validity: [null, [Validators.required]],
      searchType: [null, [Validators.required]],
      system: [null, [Validators.required]],
    });
    this.getEvents({ page: 1, text: '' });
    this.getBanks({ page: 1, text: '' });
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

  getBanks(params: ListParams) {
    if (params.text == '') {
      this.bankItems = new DefaultSelect(this.banksTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.banksTestData.filter((i: any) => i.id == id)];
      this.bankItems = new DefaultSelect(item[0], 1);
    }
  }

  search() {
    this.paymentColumns = this.paymentTestData;
    this.totalItems = this.paymentColumns.length;
  }

  cleanSearch() {
    this.searchForm.reset();
    this.paymentColumns = [];
    this.totalItems = 0;
  }

  openModal(context?: Partial<PaymentSearchModalComponent>) {
    const modalRef = this.modalService.show(PaymentSearchModalComponent, {
      initialState: { ...context },
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

  openForm(payment?: any) {
    this.openModal({ payment });
    // if (payment) {
    //   this.editedRowModal = this.revertType(lc);
    //   this.editedRowTable = lc;
    // }
  }

  addRow(data: any) {
    this.paymentColumns = [...this.paymentColumns, data];
    this.totalItems = this.paymentColumns.length;
    this.addRows.push(data);
    console.log(this.addRows);
  }

  editRow(data: any) {
    let { newData, oldData } = data;
    let idx = this.paymentColumns.findIndex(
      c => JSON.stringify(c) == JSON.stringify(oldData)
    );
    if (idx != -1) {
      this.paymentColumns[idx] = newData;
      this.paymentColumns = [...this.paymentColumns];
      this.editRows.push(data);
      console.log(this.editRows);
    }
  }

  selectRows(rows: any[]) {
    this.selectedRows = rows;
  }

  getCsv(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readFile(fileReader.result);
  }

  readFile(binaryExcel: string | ArrayBuffer) {
    try {
      let data = this.excelService.getData(binaryExcel);
      console.log(data);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  changeProcess(type: string) {
    switch (type) {
      case 'NORMALES':
        console.log(type, this.selectedRows);
        break;
      case 'DUPLICADOS':
        console.log(type, this.selectedRows);
        break;
      case 'NO REFERENCIADOS':
        console.log(type, this.selectedRows);
        break;
      case 'EFECTIVO':
        console.log(type, this.selectedRows);
        break;
      case 'INCONSISTENCIA':
        console.log(type, this.selectedRows);
        break;
      case 'CARGA DE ARCHIVO CSV':
        console.log(type, this.selectedRows);
        break;
      default:
        console.log('Error: No se recibieron argumentos');
        break;
    }
  }

  actions(action: string) {
    switch (action) {
      case 'CANCELAR':
        console.log(action, this.selectedRows);
        break;
      case 'ACTUALIZAR':
        console.log(action, this.selectedRows);
        break;
      case 'REGISTRAR':
        console.log(action, this.selectedRows);
        break;
      default:
        console.log('Error: No se recibieron argumentos');
        break;
    }
  }
}
