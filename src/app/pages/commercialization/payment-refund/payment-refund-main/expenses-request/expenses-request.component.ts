import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IMandExpenseCont } from 'src/app/core/models/ms-accounting/mand-expensecont';
import {
  IComerExpenseDTO2,
  IComerGastosDev,
} from 'src/app/core/models/ms-spent/comer-expense';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountingService } from 'src/app/core/services/ms-accounting/accounting.service';
import { InterfaceesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfaceesirsae.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BasePage } from '../../../../../core/shared/base-page';
import { ExpensesRequestModalComponent } from '../expenses-request-modal/expenses-request-modal.component';
import { PAYMENT_REQUEST_COLUMNS } from './expense-request-columns';

@Component({
  selector: 'app-expenses-request',
  templateUrl: './expenses-request.component.html',
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
  requestSettings = {
    ...TABLE_SETTINGS,
    actions: {
      columnTitle: 'Acciones',
      position: 'left',
      add: false,
      edit: true,
      delete: true,
    },
  };
  requestSource: LocalDataSource = new LocalDataSource();
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

  blkBankPays: any[];
  selectRowCtrol: any = null;
  btnLoading: boolean = false;
  constructor(
    private interfaceesirsaeService: InterfaceesirsaeService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef,
    private datePipe: DatePipe,
    private spentService: SpentService,
    private comerDetexpensesService: ComerDetexpensesService,
    private accountingService: AccountingService,
    private svPaymentService: PaymentService,
    private svPaymentDevolutionService: PaymentDevolutionService,
    private authService: AuthService
  ) {
    super();
    this.requestSettings.columns = PAYMENT_REQUEST_COLUMNS;
  }
  comerGastosFields: IComerGastosDev;
  ngOnInit(): void {
    console.log('blkBankPays', this.blkBankPays);
    this.prepareForm();
    // this.getUsers({ page: 1, text: '' });
    this.getData();
  }

  return() {
    this.onReturn.emit(true);
  }

  private prepareForm(): void {
    this.requestForm = this.fb.group({
      concept: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      desconcept: [null, [Validators.pattern(STRING_PATTERN)]],
      event: [null, [Validators.pattern(STRING_PATTERN)]],
      idevent: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      voucherCount: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      documentNumber: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      paymentType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      voucher: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      voucherName: [null, [Validators.pattern(STRING_PATTERN)]],

      documentDate: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],

      userCapture: [null, [Validators.required]],
      userRequest: [null, [Validators.required]],
      userAuthorize: [null, [Validators.required]],
      userCaptureName: [null, [Validators.required]],
      userRequestName: [null, [Validators.required]],
      userAuthorizeName: [null, [Validators.required]],

      address: [null],
    });
    if (this.comerGastosFields) {
      this.requestForm.patchValue({
        concept: this.comerGastosFields.idConcept,
        desconcept: this.comerGastosFields.descConcept,
        address: this.comerGastosFields.direccion,
        idevent: this.comerGastosFields.id_evento,

        documentDate: this.comerGastosFields.fecha_factura_rec,
        paymentDate: this.comerGastosFields.fecha_pago,
        captureDate: this.comerGastosFields.fecha_captura,

        userCapture: this.comerGastosFields.usuario_capturo,
        userRequest: this.comerGastosFields.usuario_solicita,
        userAuthorize: this.comerGastosFields.usuario_autoriza,

        userCaptureName: this.comerGastosFields.nom_empl_captura,
        userRequestName: this.comerGastosFields.nom_empl_solicita,
        userAuthorizeName: this.comerGastosFields.nom_empl_autoriza,

        paymentType: this.comerGastosFields.forma_pago,
        voucherCount: this.comerGastosFields.num_comprobantes,
        documentNumber: this.comerGastosFields.no_factura_rec,

        voucher: this.comerGastosFields.comproafmandsae,
        voucherName: this.comerGastosFields.nom_sae,
      });
    }
  }

  getUsers(params: ListParams) {
    const params_ = new FilterParams();
    if (params.text) {
      params_.addFilter('clkdet', params.text, SearchFilter.EQ);
      // params['filter.clkdet'] = `$eq:${params.text}`;
    }
    params_.limit = params.limit;
    params_.page = params.page;
    this.interfaceesirsaeService
      .ApplicationGetReturnPayments(params_.getParams())
      .subscribe({
        next: value => {
          this.userItems = new DefaultSelect(value.data, value.count);
        },
        error: err => {
          this.userItems = new DefaultSelect([], 0);
        },
      });
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
    let name = '';
    if (item) name = item.menomemp + ' ' + item.menomam;
    switch (type) {
      case 'CAPTURE':
        this.userCapture = item;
        this.requestForm.get('userCaptureName').setValue(name);
        break;
      case 'REQUEST':
        this.userRequest = item;
        this.requestForm.get('userRequestName').setValue(name);
        break;
      case 'AUTHORIZE':
        this.userAuthorize = item;
        this.requestForm.get('userAuthorizeName').setValue(name);
        break;
      default:
        break;
    }
  }

  getData() {
    // Llamar al servicio para llenar la informacion
    this.requestSource.load(this.blkBankPays);
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
    this.requestSource.refresh();
    this.requestTotalItems = this.requestSource.count();
  }

  async sendRequests() {
    let resp: boolean = this.validationFields();
    if (resp) {
      const data = await this.requestSource.getAll();

      if (data.length == 0)
        return this.alert('warning', 'No se tienen solicitudes a generar.', '');

      this.btnLoading = true;
      this.alertQuestion(
        'question',
        'Se generarán las Solicitudes de Pago',
        '¿Desea Continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          // PUP_GEN_SOLPAGOS
          this.pupGenSolPagos(data);
        } else {
          this.btnLoading = false;
        }
      });
    }
  }

  pupGenSolPagos(dataTable: any[]) {
    const {
      concept,
      desconcept,
      event,
      idevent,
      voucherCount,
      documentNumber,
      paymentType,
      voucher,
      voucherName,
      documentDate,
      paymentDate,
      captureDate,
      userCapture,
      userRequest,
      userAuthorize,
      userCaptureName,
      userRequestName,
      userAuthorizeName,
    } = this.requestForm.value;
    let n_descDep = '';
    if (this.selectRowCtrol.idOrigen == 1) {
      n_descDep = 'DEVOLUCIONES DE DEPOSITOS DE GARANTIA';
    } else {
      n_descDep = 'DEVOLUCIONES DE PAGOS EN EXCESO';
    }
    const mm1 = this.datePipe.transform(paymentDate, 'MM');
    // let mm = Number(paymentDate.split('-')[0]);

    let result = dataTable.map(async item => {
      let bodyInsert: IComerExpenseDTO2 = {
        // expenseNumber: "expenseNumber",
        conceptNumber: concept,
        comment: item.commentary,
        amount: item.amount,
        vat: this.comerGastosFields.iva,
        invoiceRecNumber: documentNumber,
        invoiceRecDate: documentDate,
        eventNumber: idevent,
        lotNumber: this.comerGastosFields.id_lote,
        paymentRequestNumber: null,
        capturedUser: userCapture,
        authorizedUser: userAuthorize,
        requestedUser: userRequest,
        fecha_contrarecibo: null,
        captureDate: captureDate,
        payDay: paymentDate,
        attachedDocumentation: item.documentation,
        numReceipts: voucherCount,
        paymentInstructions: null,
        vatWithheld: this.comerGastosFields.iva_retenido,
        isrWithheld: this.comerGastosFields.isr_retenido,
        folioAtnCustomer: null,
        totDocument: item.amount,
        formPayment: paymentType,
        clkpv: item.beneficiary,
        providerName: item.name,
        monthExpense: Number(mm1) == 1 ? '1' : null,
        monthExpense2: Number(mm1) == 2 ? '2' : null,
        monthExpense3: Number(mm1) == 3 ? '3' : null,
        monthExpense4: Number(mm1) == 4 ? '4' : null,
        monthExpense5: Number(mm1) == 5 ? '5' : null,
        monthExpense6: Number(mm1) == 6 ? '6' : null,
        monthExpense7: Number(mm1) == 7 ? '7' : null,
        monthExpense8: Number(mm1) == 8 ? '8' : null,
        monthExpense9: Number(mm1) == 9 ? '9' : null,
        monthExpense10: Number(mm1) == 10 ? '10' : null,
        monthExpense11: Number(mm1) == 11 ? '11' : null,
        monthExpense12: Number(mm1) == 12 ? '12' : null,
        spDate: null,
        comproafmandsae: voucher,
        idOrdinginter: null,
        exchangeRate: null,
        nomEmplRequest: userRequestName,
        nomEmplAuthorizes: userAuthorizeName,
        nomEmplcapture: userCaptureName,
        ur_coordregional: null,
        descurcoord: null,
        address: this.comerGastosFields.direccion,
        usu_captura_siab: this.comerGastosFields.usu_captura_siab,
        dateOfResolution: null,
        typepe: null,
        tiptram: null,
        contractNumber: null,
        adj: null,
        spFolio: null,
        indicator: this.comerGastosFields.indicador,
      };
      // INSERT INTO COMER_GASTOS
      let resInsert: any = await this.saveComerExpenses(bodyInsert);
      console.log('resInsert', resInsert);
      if (resInsert) {
        let bodyInsertDet = {
          expenseDetailNumber: 1,
          expenseNumber: resInsert.expenseNumber,
          amount: item.amount,
          vat: 0,
          isrWithholding: 0,
          vatWithholding: 0,
          transferorNumber: null,
          goodNumber: null,
          total: item.amount,
          cvman: '800000',
          budgetItem: 'A',
        };
        // INSERT INTO COMER_DETGASTOS
        await this.saveComerDetExpenses(bodyInsertDet);

        if (this.selectRowCtrol.idOrigen == 1) {
          let objInsertMandXGast = {
            spentId: resInsert.expenseNumber,
            mandxexpensecontId: 1,
            cvman: '800000',
            amount: item.amount,
            cabms: 'OT39909196',
            vat: 0,
            departure: '39909',
            cooperation: 'B97',
            descabms: n_descDep,
            retentionisr: 0,
            retentionvat: 0,
            total: item.amount,
            categorycabms: '1',
            appliesto: null,
            departurestop: 'A',
          };
          // INSERT INTO COMER_MANDXGASTOSCONT
          await this.saveAccounting(objInsertMandXGast);

          item['idwaste'] = resInsert.expenseNumber;

          let bodyUpdate = {
            idCtldevpag: this.selectRowCtrol.ctlDevPagId,
            cveBank: item.cveBank,
            account: item.account,
            idwaste: resInsert.expenseNumber,
          };
          // UPDATE COMER_CTLDEVPAG_B
          await this.updateCtlDevPagB(bodyUpdate);
        } else {
          let objInsertMandXGast = {
            spentId: resInsert.expenseNumber,
            mandxexpensecontId: 1,
            cvman: '800000',
            amount: item.amount,
            cabms: 'AD33104025',
            vat: 0,
            departure: '33104',
            cooperation: '189',
            descabms: n_descDep,
            retentionisr: 0,
            retentionvat: 0,
            total: item.amount,
            categorycabms: '1',
            appliesto: null,
            departurestop: 'A',
          };
          // INSERT INTO COMER_MANDXGASTOSCONT
          await this.saveAccounting(objInsertMandXGast);

          item['idwaste'] = resInsert.expenseNumber;

          let bodyUpdate = {
            idCtldevpag: this.selectRowCtrol.ctlDevPagId,
          };
          // UPDATE COMER_CTLDEVPAG_B
          await this.updateCtlDevPagBOrigen2(resInsert.expenseNumber);
          // await this.updateCtlDevPagB(bodyUpdate);
        }
      }
    });

    Promise.all(result).then(resp => {
      let result2 = dataTable.map(async item => {
        let body = {
          pSpentId: Number(item.idwaste),
          pBankKey: item.cveBank,
          pAccount: item.account,
          toolbarUser: this.authService.decodeToken().preferred_username,
          idCtldevpag: Number(this.selectRowCtrol.ctlDevPagId),
          originId: Number(this.selectRowCtrol.idOrigen),
        };
        await this.pupSendSirsae(body);
      });
      Promise.all(result2).then(resp2 => {
        this.btnLoading = false;
        this.alert('success', 'Proceso Terminado Correctamente', '');
        this.modalRef.hide();
        this.modalRef.content.callback(true);
      });
    });
  }
  saveComerExpenses(data: IComerExpenseDTO2) {
    return new Promise((resolve, reject) => {
      this.spentService.save_(data).subscribe({
        next: value => {
          resolve(value);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  saveComerDetExpenses(data: any) {
    return new Promise((resolve, reject) => {
      this.comerDetexpensesService.create_(data).subscribe({
        next: value => {
          resolve(true);
        },
        error: err => {
          resolve(false);
        },
      });
    });
  }

  saveAccounting(data: IMandExpenseCont) {
    return new Promise((resolve, reject) => {
      this.accountingService.create(data).subscribe({
        next: value => {
          resolve(value);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async updateCtlDevPagBOrigen2(expenseNumber: any) {
    const params = new ListParams();
    params['filter.idCtldevpag'] = `$eq:${this.selectRowCtrol.ctlDevPagId}`;
    params.limit = 100;
    let data: any = await this.getCtlDevPagB(params);
    let result = data.map(async item => {
      let bodyUpdate = {
        idCtldevpag: this.selectRowCtrol.ctlDevPagId,
        cveBank: item.cveBank,
        account: item.account,
        idwaste: expenseNumber,
      };

      await this.updateCtlDevPagB(bodyUpdate);
    });

    Promise.all(result).then(resp => {
      return true;
    });
  }
  getCtlDevPagB(params: any) {
    return new Promise((resolve, reject) => {
      this.svPaymentService.getCtlDevPagB(params).subscribe({
        next: value => {
          resolve(value.data);
        },
        error: err => {
          resolve([]);
        },
      });
    });
  }
  updateCtlDevPagB(data: any) {
    return new Promise((resolve, reject) => {
      this.svPaymentService.updateComerCtldevpagB(data).subscribe({
        next: value => {
          resolve(value);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  // PUP_ENVIAR_SIRSAE
  async pupSendSirsae(data: any) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.applicationPupSendSirsae(data).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }
  validationFields(): boolean {
    const {
      userAuthorize,
      userCapture,
      userRequest,
      captureDate,
      paymentDate,
      documentDate,
    } = this.requestForm.value;
    if (!paymentDate) {
      this.alert('warning', 'Debe insertar la Fecha de Pago', '');
      return false;
    } else if (!captureDate) {
      this.alert('warning', 'Debe insertar la Fecha de Captura', '');
      return false;
    } else if (!documentDate) {
      this.alert('warning', 'Debe insertar la Fecha de Documento', '');
      return false;
    } else if (!userAuthorize) {
      this.alert('warning', 'Debe insertar el Usuario que Autoriza', '');
      return false;
    } else if (!userCapture) {
      this.alert('warning', 'Debe insertar el Usuario que Captura', '');
      return false;
    } else if (!userRequest) {
      this.alert('warning', 'Debe insertar el Usuario que Solicita', '');
      return false;
    }

    return true;
  }

  async close() {
    this.modalService.hide();
  }

  async questionDelete(data: any) {
    console.log(data);
    this.alertQuestion(
      'question',
      'Se eliminará el registro',
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.requestSource.remove(data);
        this.requestSource.refresh();
        this.alert('success', 'El registro se eliminó correctamente', '');
      }
    });
  }
}
