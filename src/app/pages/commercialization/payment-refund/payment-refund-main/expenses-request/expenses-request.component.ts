import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BasePage } from '../../../../../core/shared/base-page';
import { ExpensesRequestModalComponent } from '../expenses-request-modal/expenses-request-modal.component';
import { PAYMENT_REQUEST_COLUMNS } from './expense-request-columns';

@Component({
  selector: 'app-expenses-request',
  templateUrl: './expenses-request.component.html',
  styles: [],
})
export class ExpensesRequestComponent extends BasePage implements OnInit {
  requestForm: FormGroup = new FormGroup({});
  editedRow: any;
  selectedConcept: any = null;
  selectedEvent: any = null;
  selectedVoucher: any = null;
  userCapture: any = null;
  userRequest: any = null;
  userAuthorize: any = null;
  maxDate = new Date();
  conceptItems = new DefaultSelect();
  eventItems = new DefaultSelect();
  voucherItems = new DefaultSelect();
  userItems = new DefaultSelect();
  requestParams = new BehaviorSubject<ListParams>(new ListParams());
  requestTotalItems: number = 0;
  requestColumns: any[] = [];
  requestSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'left',
      add: true,
      edit: true,
      delete: false,
    },
  };
  requestSource: LocalDataSource;
  @Output() onReturn = new EventEmitter<boolean>();

  conceptTestData = [
    {
      id: 1,
      description: 'TEST CONCEPT 1',
    },
    {
      id: 2,
      description: 'TEST CONCEPT 2',
    },
    {
      id: 3,
      description: 'TEST CONCEPT 3',
    },
    {
      id: 4,
      description: 'TEST CONCEPT 4',
    },
    {
      id: 5,
      description: 'TEST CONCEPT 5',
    },
  ];

  eventTestData = [
    {
      id: 1,
      description: 'TEST EVENT 1',
    },
    {
      id: 2,
      description: 'TEST EVENT 2',
    },
    {
      id: 3,
      description: 'TEST EVENT 3',
    },
    {
      id: 4,
      description: 'TEST EVENT 4',
    },
    {
      id: 5,
      description: 'TEST EVENT 5',
    },
  ];

  voucherTestData = [
    {
      id: 101,
      name: 'ANTONIO RIVERA',
    },
    {
      id: 201,
      name: 'JUAN PEREZ',
    },
    {
      id: 301,
      name: 'MARIA COLINDRES',
    },
    {
      id: 401,
      name: 'ANDREA MORALES',
    },
    {
      id: 501,
      name: 'LUIS RODRIGUEZ',
    },
  ];

  userTestData = [
    {
      user: 'MRIVERA',
      name: 'MICHAEL RIVERA',
    },
    {
      user: 'LPEREZ',
      name: 'LUIS PEREZ',
    },
    {
      user: 'APACHECO',
      name: 'ALEJANDRA PACHECO',
    },
    {
      user: 'JMENDOZA',
      name: 'JULIA MENDOZA',
    },
    {
      user: 'VPALACIOS',
      name: 'VICTOR PALACIOS',
    },
  ];

  requestTestData = [
    {
      beneficiary: 16186,
      name: 'ANTONIO RIVERA',
      amount: 10000,
      service: 'SERVICE TEST DATA',
      documentation: 'DOCUMENTATION TEST DATA',
    },
    {
      beneficiary: 16187,
      name: 'ANDREA ORTIZ',
      amount: 30000,
      service: 'SERVICE TEST DATA',
      documentation: 'DOCUMENTATION TEST DATA',
    },
    {
      beneficiary: 16188,
      name: 'PABLO ESTEVEZ',
      amount: 20000,
      service: 'SERVICE TEST DATA',
      documentation: 'DOCUMENTATION TEST DATA',
    },
  ];

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.requestSettings.columns = PAYMENT_REQUEST_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getConcepts({ page: 1, text: '' });
    this.getEvents({ page: 1, text: '' });
    this.getVouchers({ page: 1, text: '' });
    this.getUsers({ page: 1, text: '' });
    this.getData();
  }

  return() {
    this.onReturn.emit(true);
  }

  private prepareForm(): void {
    this.requestForm = this.fb.group({
      concept: [null, [Validators.required]],
      event: [null, [Validators.required]],
      voucherCount: [null, [Validators.required]],
      documentNumber: [null, [Validators.required]],
      paymentType: [null, [Validators.required]],
      voucher: [null, [Validators.required]],
      documentDate: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      userCapture: [null, [Validators.required]],
      userRequest: [null, [Validators.required]],
      userAuthorize: [null, [Validators.required]],
    });
  }

  getConcepts(params: ListParams) {
    if (params.text == '') {
      this.conceptItems = new DefaultSelect(this.conceptTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.conceptTestData.filter((i: any) => i.id == id)];
      this.conceptItems = new DefaultSelect(item[0], 1);
    }
  }

  getEvents(params: ListParams) {
    if (params.text == '') {
      this.eventItems = new DefaultSelect(this.eventTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.conceptTestData.filter((i: any) => i.id == id)];
      this.eventItems = new DefaultSelect(item[0], 1);
    }
  }

  getVouchers(params: ListParams) {
    if (params.text == '') {
      this.voucherItems = new DefaultSelect(this.voucherTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.voucherTestData.filter((i: any) => i.id == id)];
      this.voucherItems = new DefaultSelect(item[0], 1);
    }
  }

  getUsers(params: ListParams) {
    if (params.text == '') {
      this.userItems = new DefaultSelect(this.userTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.userTestData.filter((i: any) => i.id == id)];
      this.userItems = new DefaultSelect(item[0], 1);
    }
  }

  selectConcept(item: any) {
    this.selectedConcept = item;
  }

  selectEvent(item: any) {
    this.selectedEvent = item;
  }

  selectVoucher(item: any) {
    this.selectedVoucher = item;
  }

  selectUser(item: any, type: string) {
    switch (type) {
      case 'CAPTURE':
        this.userCapture = item;
        break;
      case 'REQUEST':
        this.userRequest = item;
        break;
      case 'AUTHORIZE':
        this.userAuthorize = item;
        break;
      default:
        break;
    }
  }

  getData() {
    // Llamar al servicio para llenar la informacion
    this.requestColumns = this.requestTestData;
    this.requestSource = new LocalDataSource(this.requestColumns);
    this.requestTotalItems = this.requestSource.count();
  }

  openForm(data?: any) {
    this.openModal({ data });
    this.editedRow = data;
  }

  openModal(context?: Partial<ExpensesRequestModalComponent>) {
    const modalRef = this.modalService.show(ExpensesRequestModalComponent, {
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

  addRow(row: any) {
    this.requestSource.add(row);
    this.requestSource.refresh();
    this.requestTotalItems = this.requestSource.count();
  }

  editRow(row: any) {
    this.requestSource.update(this.editedRow, row);
    this.requestTotalItems = this.requestSource.count();
  }

  async sendRequests() {
    this.requestSource.getAll().then(table => {
      let array = this.fb.array([...table]);
      this.requestForm.addControl('beneficiaries', array);
      console.log(this.requestForm.value);
    });
  }
}
