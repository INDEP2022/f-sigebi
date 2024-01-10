import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  take,
  takeUntil,
} from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IPayment } from 'src/app/core/models/ms-payment/payment';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PaymentSearchModalComponent } from '../payment-search-modal/payment-search-modal.component';
import { PaymentSearchProcessComponent } from '../payment-search-process/payment-search-process.component';
import { PAYMENT_COLUMNS } from './payment-search-columns';

@Component({
  selector: 'app-payment-search-list',
  templateUrl: './payment-search-list.component.html',
  styles: [],
})
export class PaymentSearchListComponent extends BasePage implements OnInit {
  searchForm: FormGroup;
  params = new BehaviorSubject<ListParams>(new ListParams());
  addRows: any[] = [];
  editRows: any[] = [];
  selectedRows: any = [];
  paymentColumns: any[] = [];
  dataRows: IPayment[] = [];
  totalItems: number = 0;
  eventItems = new DefaultSelect();
  bankItems = new DefaultSelect();
  localdata: LocalDataSource = new LocalDataSource();
  banks = new DefaultSelect();
  columnFilters: any = [];
  sssubtypes = new DefaultSelect<any>();
  flag: boolean = false;
  selectedFile: File | null = null;
  @ViewChild('loadCSV') loadCSV: any;
  @ViewChild('loadCSV2') loadCSV2: any;
  LV_MSG_PROCESO: string;
  LV_EST_PROCESO: number = 1;
  LV_TOTREG: number;
  LV_WHERE: number;
  n_CONT: number = 0;
  @ViewChild('table') table: Ng2SmartTableComponent;

  processTypes = [
    { value: 0, description: 'Normales' },
    { value: 1, description: 'Duplicados' },
    { value: 2, description: 'No Referenciados' },
    { value: 3, description: 'Efectivo' },
    { value: 4, description: 'Inconsistencia' },
  ];
  actions = [
    { value: 1, description: 'Cancelar' },
    { value: 2, description: 'Actualizar' },
    { value: 3, description: 'Registrar' },
  ];
  APLICADO_MSG: string;
  APLICADO_EST: number;

  statusPaymentChange: number;
  msgPaymentChange: string;

  processId: any;
  idCustomer: any;
  idGuySat: any;
  idselect: any;
  incomeid: any;
  account: any;

  LV_VALUSER: number;
  LV_USR_CON: number = 0;

  LV_VAL_SISTEMA: string;
  validSystem: any[] = [];

  keyValidEdit: string;

  //params = new BehaviorSubject<FilterParams>(new FilterParams());
  paymentSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    rowClassFunction: (row: { data: { available: any } }) =>
      row.data.available ? 'available' : 'not-available',
    selectMode: 'multi', //multi
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      add: false,
      delete: false,
      position: 'right',
    },
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

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private modalService: BsModalService,
    private paymentService: PaymentService,
    private accountMovementService: AccountMovementService,
    private msDepositaryService: MsDepositaryService,
    private bankMovementType: BankMovementType,
    private authService: AuthService,
    private indUserService: IndUserService,
    private interfacesirsaeService: InterfacesirsaeService,
    private lotService: LotService,
    private userAutxCancService: UsersService,
    private massiveGoodService: MassiveGoodService,
    private http: HttpClient
  ) {
    super();
    this.paymentSettings.columns = PAYMENT_COLUMNS;
    this.prepareForm();
  }

  get event() {
    return this.searchForm.controls['event'];
  }

  get batch() {
    return this.searchForm.get('batch');
  }

  get bank() {
    return this.searchForm ? this.searchForm.get('bank') : null;
  }

  get amount() {
    return this.searchForm.get('amount');
  }

  get reference() {
    return this.searchForm.get('reference');
  }

  get system() {
    return this.searchForm.get('system');
  }

  get validity() {
    return this.searchForm.get('validity');
  }

  get searchType() {
    return this.searchForm.get('searchType');
  }

  onChange(sistema: number) {
    console.log(sistema);
    // if (sistema == 1) {
    //   this.amount.setValidators(Validators.required);
    //   this.event.setValidators(Validators.required);
    //   this.batch.setValidators(Validators.required);
    //   this.searchForm.updateValueAndValidity();
    // } else {
    //   if (this.amount.hasValidator(Validators.required)) {
    //     this.amount.removeValidators(Validators.required);
    //   }
    //   if (this.event.hasValidator(Validators.required)) {
    //     this.event.removeValidators(Validators.required);
    //   }
    //   if (this.batch.hasValidator(Validators.required)) {
    //     this.batch.removeValidators(Validators.required);
    //   }
    //   this.searchForm.updateValueAndValidity();
    // }
  }
  ngOnInit(): void {
    this.getValidSystem();

    this.getParametercomer('SUPUSUCOMER');
    // this.getBusquedaPagDet(5);
    // this.searchID(5);
    this.localdata
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'movement':
                field = 'filter.numbermovement';
                console.log('ENTRA A MOVEMENT');
                searchFilter = SearchFilter.EQ;
                break;
              case 'date':
                searchFilter = SearchFilter.EQ;
                break;
              case 'referenceori':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'reference':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'amount':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'cve':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'code':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'publicBatch':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'event':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'systemValidity':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'result':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'paymentId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'batchId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'entryOrderId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'satDescription':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'type':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'inconsistencies':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getTableData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getTableData(true));
    //this.pagosArchivos(5, 2);
  }

  private prepareForm(): void {
    this.searchForm = this.fb.group({
      event: [null, [Validators.pattern(NUM_POSITIVE)]],
      batch: [null, [Validators.pattern(NUM_POSITIVE)]],
      bank: [null, []],
      amount: [null, []],
      reference: [null, []],
      validity: [null, []],
      searchType: [null, [Validators.required]],
      processType: [null],
      system: [null, [Validators.required]],
      action: [null],
      type: [null],
    });
    this.getEvents({ page: 1, text: '' });
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

  getBanks2(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    let params__ = '';
    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idCode', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('cveBank', lparams.text, SearchFilter.ILIKE);

        // params.addFilter('cve_banco', lparams.text);
      }

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.accountMovementService
        .getPaymentControl(params.getParams())
        .subscribe({
          next: response => {
            console.log('ress1', response);
            let result = response.data.map(item => {
              item['bankAndNumber'] = item.idCode + ' - ' + item.cveBank;
            });

            Promise.all(result).then((resp: any) => {
              this.banks = new DefaultSelect(response.data, response.count);
              this.loading = false;
            });
          },
          error: err => {
            this.banks = new DefaultSelect();
            console.log(err);
          },
        });
    });
  }

  async searchDet() {
    // console.log(
    //   'valido sistema key -> ',
    //   this.searchForm.get('validity').value
    // );
    let LV_TOTREG: number;

    // this.searchID(5);

    if (this.system.value == 1) {
      if (this.searchType.value == 5) {
        // this.bank;
      } else {
        this.loader.load = true;
        let param = {
          typeSearch: this.searchType.value,
          event: this.event.value,
          lot: this.batch.value,
          bankKey: this.bank.value,
          amount: this.amount.value,
          preference: this.reference.value,
          sistemValue: this.validity.value,
        };
        let resultSearch = await this.searchPayment(param);
        if (this.LV_EST_PROCESO == 1) {
          console.log('Tipo búsqueda', this.searchType.value);
          this.searchForm.patchValue({
            type: this.searchType.value,
          });
          this.getTableData();
        } else {
          this.loader.load = false;
          this.alert('warning', 'Información', this.LV_MSG_PROCESO);
          // this.getTableData();
        }
      }
    } else {
      this.loader.load = true;
      //Servicio PUP_BUSQUEDA
      if (!this.bank.value && !this.amount.value && !this.reference.value) {
        this.alert(
          'warning',
          'Se requiere banco, referencia o monto para continuar',
          ''
        );
        return;
      }
      let params = {
        keyBank: this.searchForm.get('bank').value,
        amount: this.searchForm.get('amount').value,
        ref: this.searchForm.get('reference').value,
      };
      await this.PupBusqueda(params);
      this.searchForm.patchValue({
        type: 5,
      });
      this.getTableData();
    }
  }

  formClean() {
    this.searchForm.reset();
    this.paymentColumns = [];
    this.dataRows = [];
    this.localdata.load(this.dataRows);
    this.localdata.refresh();
    this.totalItems = 0;
  }

  async validateLoadLoteCSV() {
    if (this.n_CONT == 0) {
      this.alert(
        'error',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Usuario Inválido para Ejecutar Este Procedimiento.'
      );
      return;
    }
    this.loadCSV2.nativeElement.click();
  }

  cleanSearch() {
    if (this.totalItems == 0) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'No Hay Registros para Borrar ...'
      );
      return;
    }
    if (!this.searchForm.get('type').value) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'No Hay tipo de búsqueda mae seleccionada'
      );
      return;
    }
    // const elemC = document.getElementById('typeId') as HTMLInputElement;

    //elemC.value = '';

    // this.searchID(elemC.value);
    this.alertQuestion(
      'question',
      'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
      '¿Está Seguro de Eliminar los Registros de la Búsqueda o Cargados por Archivo Tipo CSV ?'
    ).then(async question => {
      if (question.isConfirmed) {
        /*this.searchForm.reset();
        this.paymentColumns = [];
        this.totalItems = 0;*/

        this.deleteMassive(this.searchForm.get('type').value);
      }
    });
  }

  openModal(context?: Partial<PaymentSearchModalComponent>) {
    const modalRef = this.modalService.show(PaymentSearchModalComponent, {
      initialState: {
        ...context,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onAdd.subscribe(({ newData }) => {
      if (newData) {
        console.log('Data Recibida ADD', newData);
        this.loading = true;
        let param = {
          payId: newData.paymentId,
          processId: Number(this.processId),
          batchId: newData.batchId,
          idEvent: newData.event,
          // idCustomer: Number(this.idCustomer),
          idGuySat: newData.satDescription,
          idselect: newData.idselect ? 1 : 0,
          incomeid: Number(newData.entryOrderId),
          // idinconsis: Number(newData.newData.inconsistencies),
          tsearchId: newData.tsearchId,
          numbermovement: newData.numbermovement,
          date: newData.date != null ? new Date(newData.date) : null,
          reference: newData.reference,
          referenceori: newData.referenceori,
          amount: newData.amount,
          cveBank: newData.cve,
          code: newData.code,
          batchPublic: newData.publicBatch,
          validSystem: newData.systemValidity,
          result: newData.result,
          account: this.account,
          guy: newData.type,
        };
        // this.getCreateValidSys(data.systemValidity, param);
        this.CreateAddRow(param);
        //this.getTableData();
      }
    });
    modalRef.content.onEdit.subscribe(({ newData, oldData }) => {
      // const elemC = document.getElementById('typeId') as HTMLInputElement;
      if (newData) {
        this.loading = true;
        //this.editRow(data);
        console.log('Data Editar', newData);
        console.log('fecha a editar -> ', newData.date);
        // let param = {
        //   tsearchId: Number(5),
        //   payId: data.newData.paymentId,
        //   processId: Number(this.processId),
        //   batchId: Number(data.newData.batchId),
        //   idEvent: Number(data.newData.event),
        //   idCustomer: Number(this.idCustomer),
        //   idGuySat: Number(this.idGuySat),
        //   idselect: Number(this.idselect),
        //   incomeid: Number(this.incomeid),
        //   idinconsis: Number(data.newData.inconsistencies),
        //   numbermovement: Number(data.newData.entryOrderId),
        //   date: data.newData.date != null ? new Date(data.newData.date) : null,
        //   reference: data.newData.reference,
        //   referenceori: data.newData.referenceori,
        //   amount: data.newData.amount,
        //   cveBank: data.newData.cve,
        //   code: Number(data.newData.code),
        //   batchPublic: Number(data.newData.publicBatch),
        //   validSystem: this.keyValidEdit,
        //   result: data.newData.result,
        //   account: this.account,
        //   guy: data.newData.type,
        // };
        let param = {
          payId: newData.paymentId,
          processId: oldData.processId,
          batchId: newData.batchId,
          idEvent: newData.event,
          // idCustomer: Number(this.idCustomer),
          idGuySat: newData.satDescription,
          idselect: newData.idselect ? 1 : 0,
          incomeid: Number(newData.entryOrderId),
          // idinconsis: Number(newData.newData.inconsistencies),
          tsearchId: newData.tsearchId,
          numbermovement: newData.numbermovement,
          date: newData.date != null ? new Date(newData.date) : null,
          reference: newData.reference,
          referenceori: newData.referenceori,
          amount: newData.amount,
          cveBank: newData.cve,
          code: newData.code,
          batchPublic: newData.publicBatch,
          validSystem: newData.systemValidity,
          result: newData.result,
          account: this.account,
          guy: newData.type,
        };
        // this.getValidSystemKey(newData.newData.systemValidity, param);
        console.log('ParamsUpdate->', param);
        this.updateRecord(param);
        //this.getTableData();
      }
    });
  }

  openForm(payment?: any) {
    this.openModal({ payment });
    // if (payment) {
    //   this.editedRowModal = this.revertType(lc);
    //   this.editedRowTable = lc;
    // }
  }

  openModal2(data?: any) {
    console.log('Data Modal2-> ', data);
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: number) => {
          if (next) {
            this.searchForm.patchValue({
              type: next,
            });
            this.getTableData();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PaymentSearchProcessComponent, config);
  }

  async changeProcess2() {
    if (this.dataRows.filter(x => x.idselect == '1').length === 0) {
      this.alert(
        'warning',
        'Cambiar Proceso',
        'No hay Registros Seleccionados para Procesar, recuerde dar click a selección antes de continuar'
      );
      return;
    }
    if (!this.searchForm.get('type').value) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'No hay tipo seleccionado'
      );
      return;
    }
    this.openModal2(this.searchForm.get('type').value);
  }

  addRow(rows: any[]) {
    console.log('Add Row->', rows);
    this.paymentColumns = [...this.paymentColumns, rows];
    this.totalItems = this.paymentColumns.length;
    this.addRows.push(rows);
    console.log(this.addRows);
    this.CreateAddRow(rows);
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
    console.log('row ', rows);
    if (rows.length > 0) {
      this.selectedRows = rows;
      console.log('SelectRows', this.selectedRows[0].idselect);
      this.flag = true;
    } else {
      this.flag = false;
      this.selectedRows = [];
    }
  }

  changeCheckBox() {
    console.log('this.selectedRows-> ', this.selectedRows);

    if (
      this.searchForm.get('type').value == null ||
      this.searchForm.get('type').value == ''
    ) {
      this.alert(
        'warning',
        '',
        'No se Ha Seleccionado el Campo Tipo de Búsqueda'
      );
    } else {
      this.SelectPago();
    }
  }

  async getCsv(event: Event) {
    console.log(' n_CONT finalv -> ', this.n_CONT);
    //debugger;
    if (this.n_CONT == 0) {
      await this.msgUser(this.n_CONT);
    }

    /*
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readFile(fileReader.result);
    this.getParametercomer(event); */
  }

  async msgUser(num: number) {
    if (num == 0) {
      this.alert(
        'error',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Usuario Inválido para Ejecutar Este Procedimiento.'
      );
    } else {
      this.alertQuestion(
        'question',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        '¿Quiere Continuar con el Proceso?'
      ).then(async question => {
        if (question.isConfirmed) {
          // add PUP_CAMBIO_MASIV_LOTES;
          //this.PupCambioMasivo();
        }
      });
    }
  }

  aplica() {
    if (this.searchForm.get('processType').value == null) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Debe Elegir un Tipo de Proceso'
      );
    } else {
      if (this.searchForm.get('action').value == null) {
        this.alert(
          'warning',
          'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
          'Debe Elegir un Tipo de Acción'
        );
      } else {
        this.confirm();
      }
    }
  }

  // openModalSec(context?: Partial<PaymentSearchSecurityComponent>) {
  //   const modalRef = this.modalService.show(PaymentSearchSecurityComponent, {
  //     initialState: { ...context },
  //     class: 'modal-lg modal-dialog-centered',
  //     ignoreBackdropClick: true,
  //   });
  // }

  // openFormSec() {
  //   this.openModalSec();
  // }

  readFile(binaryExcel: string | ArrayBuffer) {
    try {
      let data = this.excelService.getData(binaryExcel);
      console.log(data);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un Error al Leer el Archivo', 'Error');
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

  getFilterParams(byPage = false) {
    if (this.searchForm.invalid && this.searchType.value !== 6) {
      return null;
    }
    debugger;
    let filterParams = new FilterParams();
    filterParams.limit = this.params.getValue().limit;
    if (byPage) {
      filterParams.page = this.params.getValue().page;
    } else {
      this.params.value.page = 1;
      // this.params.value.limit = 10;
    }
    if (this.system.value == 1) {
      if (this.searchType.value != 5) {
        filterParams.addFilter('tsearchId', this.searchType.value);
      }
      if (this.validity.value) {
        filterParams.addFilter('validSystem', this.validity.value);
      }
      if (this.event.value) {
        filterParams.addFilter('idEvent', this.event.value);
      }
      if (this.batch.value) {
        filterParams.addFilter('batchId', this.batch.value);
      }
      if (this.amount.value) {
        filterParams.addFilter('amount', this.amount.value);
      }
      if (this.reference.value) {
        filterParams.addFilter('reference', this.reference.value);
      }
      if (this.bank.value) {
        filterParams.addFilter('cveBank', this.bank.value);
      }
    } else {
      filterParams.addFilter('tsearchId', 5);
    }
    for (var filter in this.columnFilters) {
      if (this.columnFilters.hasOwnProperty(filter)) {
        filterParams.addFilter3(filter, this.columnFilters[filter]);
      }
    }
    return filterParams;
  }

  private fillSelectedRows() {
    setTimeout(() => {
      this.table.isAllSelected = false;
      let allSelected = true;
      if (
        (this.selectedRows && this.selectedRows.length > 0) ||
        (this.dataRows && this.dataRows.length > 0)
      ) {
        this.table.grid.getRows().forEach(row => {
          // console.log(row);

          if (
            this.selectedRows &&
            this.selectedRows.length > 0 &&
            this.selectedRows.find(
              item => row.getData().toString() === item.toString()
            )
          ) {
            this.table.grid.multipleSelectRow(row);
            allSelected = allSelected && true;
          } else if (row.getData()['idselect'] === '1') {
            this.table.grid.multipleSelectRow(row);
            allSelected = allSelected && true;
          } else {
            allSelected = allSelected && false;
          }
          // if(row.getData())
          // this.table.grid.multipleSelectRow(row)
        });
        this.table.isAllSelected = allSelected;
      }
    }, 300);
  }

  getTableData(byPage = false) {
    let params = this.getFilterParams(byPage);
    this.dataRows = [];
    this.localdata.load(this.dataRows);
    this.localdata.refresh();
    console.log('PARAMS', params);
    if (!params) {
      this.loading = false;
      this.loader.load = false;
      return;
    }
    //Provisional data
    //this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    // if (this.classifGood) {
    //   data.addFilter('goodClassNumber', this.classifGood);
    // }
    // if (params.text != undefined && params.text != '') {
    //   data.addFilter('description', params.text, SearchFilter.ILIKE);
    // }
    console.log('CLASIFICADOR DEL BEINE ES: ', data);
    this.loading = true;
    this.paymentService.getBusquedaPag(params.getParams()).subscribe({
      next: res => {
        console.log('getBusquedaPag -> ', res);
        const params = new ListParams();
        this.loader.load = false;
        if (res.count === 0) {
          this.loading = false;
          return;
        }
        this.loading = false;
        this.dataRows = res.data;
        this.localdata.load(this.dataRows);
        console.log('this dataRows: ', this.dataRows);
        console.log('this localData: ', this.localdata);
        this.fillSelectedRows();
        this.totalItems = res.count;
        // for (let i = 0; i < res.count; i++) {
        //   console.log('Entra al FOR', res.data);
        //   if (res.data[i] != undefined) {
        //     console.log('Res.Data-> ', res.data);
        //     const _params: any = params;
        //     _params['filter.idType'] = `$eq:${res.data[i].idGuySat}`;
        //     console.log('Filter-> ', _params);
        //     this.accountMovementService.getPaymentTypeSat(_params).subscribe(
        //       response => {
        //         console.log('GetPaymentTypeSat->', response);
        //         if (response != null && response != undefined) {
        //           if (res.data[i].validSystem) {
        //             console.log(
        //               'Resp PaymentSat',
        //               response.data[0].description
        //             );
        //             this.paymentService
        //               .getValidSystem(res.data[i].validSystem)
        //               .subscribe(resp => {
        //                 let item = {
        //                   movement: res.data[i].numbermovement,
        //                   date: res.data[i].date,
        //                   referenceori: res.data[i].referenceori,
        //                   reference: res.data[i].reference,
        //                   amount: res.data[i].amount,
        //                   cve: res.data[i].cveBank,
        //                   code: res.data[i].code,
        //                   publicBatch: res.data[i].batchPublic,
        //                   event: res.data[i].idEvent,
        //                   systemValidity: resp.data[0].valsisDescription,
        //                   result: res.data[i].result,
        //                   paymentId: res.data[i].payId,
        //                   batchId: res.data[i].batchId,
        //                   entryOrderId: res.data[i].numbermovement,
        //                   satDescription: response.data[0].description,
        //                   type: res.data[i].guy,
        //                   inconsistencies: res.data[i].idinconsis,
        //                   id_select: res.data[i].idselect,
        //                 };

        //                 // console.log(
        //                 //   'Descripcion Pag Sat-> ',
        //                 //   this.getPaymentSat(params, res.data[i].idGuySat) // <- Undefine
        //                 // );
        //                 this.loading = false;
        //                 this.dataRows.push(item);
        //                 this.localdata.load(this.dataRows);
        //                 console.log('this dataRows: ', this.dataRows);
        //                 console.log('this localData: ', this.localdata);
        //                 this.totalItems = res.count;
        //               });
        //           } else {
        //             let item = {
        //               movement: res.data[i].numbermovement,
        //               date: res.data[i].date,
        //               referenceori: res.data[i].referenceori,
        //               reference: res.data[i].reference,
        //               amount: res.data[i].amount,
        //               cve: res.data[i].cveBank,
        //               code: res.data[i].code,
        //               publicBatch: res.data[i].batchPublic,
        //               event: res.data[i].idEvent,
        //               systemValidity: res.data.valsisDescription,
        //               result: res.data[i].result,
        //               paymentId: res.data[i].payId,
        //               batchId: res.data[i].batchId,
        //               entryOrderId: res.data[i].numbermovement,
        //               satDescription: response.data[0].description,
        //               type: res.data[i].guy,
        //               inconsistencies: res.data[i].idinconsis,
        //               id_select: res.data[i].idselect,
        //             };

        //             // console.log(
        //             //   'Descripcion Pag Sat-> ',
        //             //   this.getPaymentSat(params, res.data[i].idGuySat) // <- Undefine
        //             // );
        //             this.loading = false;
        //             this.dataRows.push(item);
        //             this.localdata.load(this.dataRows);
        //             console.log('this dataRows: ', this.dataRows);
        //             console.log('this localData: ', this.localdata);
        //             this.totalItems = res.count;
        //           }
        //         }
        //       },
        //       error => {
        //         return null;
        //         this.loading = true;
        //       }
        //     );
        //   }
        // }
      },
      error: err => {
        this.loading = false;
        // this.alert(
        //   'warning',
        //   'Información',
        //   'No hay bienes que mostrar con los filtros seleccionado'
        // );
      },
    });
  }

  // getBusquedaPagMae(params: number | string) {
  //   const elemC = document.getElementById('typeId') as HTMLInputElement;
  //   elemC.value = '';
  //   this.searchForm.get('type').setValue('');
  //   this.loading = true;
  //   this.paymentService.getBusquedaMae(params).subscribe(
  //     resp => {
  //       if (resp != null && resp != undefined) {
  //         this.LV_WHERE = resp.data[0].desTsearch;
  //         //this.searchForm.get('type').setValue(resp.data[0].desTsearch);
  //         this.searchForm.patchValue({
  //           type: resp.data[0].desTsearch,
  //         });
  //         elemC.value = resp.data[0].tsearchId;
  //         console.log('Resp PagosMae-> ', resp);
  //         this.getTableData();
  //       } else {
  //         this.loader.load = false;
  //         this.loading = false;
  //         this.alert(
  //           'error',
  //           'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
  //           'No se encontraron datos'
  //         );
  //       }
  //     },
  //     err => {
  //       this.loader.load = false;
  //       this.loading = false;
  //       this.alert(
  //         'error',
  //         'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
  //         err.error.message
  //       );
  //     }
  //   );
  // }

  // getBusquedaPagDet(params?: number) {
  //   this.paymentService.getBusquedaPag(params).subscribe(resp => {
  //     if (resp != null && resp != undefined) {
  //       console.log('Resp BusquedaPagDet', resp);
  //       this.processId = resp.data[0].processId;
  //       this.idCustomer = resp.data[0].idCustomer;
  //       this.idGuySat = resp.data[0].idGuySat;
  //       this.idselect = resp.data[0].idselect;
  //       this.incomeid = resp.data[0].incomeid;
  //       this.account = resp.data[0].account;
  //     }
  //   });
  // }

  // getPaymentSat(params: _Params, id: number): any {
  //   const _params: any = params;
  //   _params['filter.idType'] = `$eq:${id}`;
  //   this.accountMovementService.getPaymentTypeSat(_params).subscribe(
  //     resp => {
  //       if (resp != null && resp != undefined) {
  //         console.log('Resp PaymentSat', resp.data[0].description);
  //         return resp.data[0].description;
  //       }
  //     },
  //     error => {
  //       return null;
  //     }
  //   );
  // }

  searchID(id: number | string) {
    console.log('Resp Search Id-> ', id);
    this.paymentService.getSearchId(id).subscribe(resp => {
      console.log('Resp Search Id-> ', resp);
      if (resp != null && resp != undefined) {
        this.LV_TOTREG = resp.count;

        console.log('Resp BusquedaId-> ', resp.count);
      }
    });
  }

  searchPayment(params: any) {
    console.log('Busqueda Pago->', params);
    return firstValueFrom(
      this.msDepositaryService.postSearchPay(params).pipe(
        take(1),
        catchError(x =>
          of({
            statusProcess: 0,
            messageProcess: x.error.message,
          })
        ),
        map(resp => {
          console.log(resp);
          if (resp != null && resp != undefined) {
            this.LV_MSG_PROCESO = resp.messageProcess;
            this.LV_EST_PROCESO = resp.statusProcess;
            console.log('Resp SearchPay-> ', resp);
            console.log('LV_MSG_PROCESO-> ', resp.messageProcess);
            console.log('LV_EST_PROCESO-> ', resp.statusProcess);
            return true;
          } else {
            this.LV_EST_PROCESO = 1;
            return false;
          }
        })
      )
    );
  }

  getParametercomer(params?: any) {
    this.n_CONT = 0;
    const { preferred_username } = this.authService.decodeToken();
    let username = preferred_username;
    //username = 'NMORENO';
    this.bankMovementType
      .getParameterMod(params, username.toUpperCase())
      .subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            this.n_CONT = resp.count;
            console.log('RespCount-> ', this.n_CONT);
          }
        },
        err => {
          //num = err.count;
        }
      );
  }

  private async pupProcesa() {
    const processType = this.processTypes.find(
      x => x.value == this.searchForm.get('processType').value
    );
    console.log(processType, this.searchForm.get('processType').value);
    const action = this.actions.find(
      x => x.value == this.searchForm.get('action').value
    );
    console.log(action, this.searchForm.get('action').value);

    let LV_TIPO_PROC: string = processType.description;

    let LV_ACCION: string = action.description;
    let LV_PROCESA: number;
    debugger;
    LV_PROCESA = 0;
    const elemC = this.searchForm.get('type');

    if (
      this.searchForm.get('processType').value == 0 &&
      this.searchForm.get('action').value == 2
    ) {
      if (elemC.value == '0') {
        //integrar PA_PAGOS_CAMBIOS}
        await this.pagosCambio(
          this.searchForm.get('processType').value,
          this.searchForm.get('action').value
        );
      } else {
        LV_PROCESA = 1;
      }
    } else if (
      ['1', '2', '3', '4'].includes(
        this.searchForm.get('processType').value + ''
      ) &&
      ['1', '2', '3'].includes(this.searchForm.get('action').value + '')
    ) {
      if (['1', '2', '3', '4'].includes(elemC.value)) {
        //servicio PA_PAGOS_EFE_DUP_NREF
        await this.paPagosEfeDup(
          this.searchForm.get('processType').value &&
            this.searchForm.get('action').value
        );
      } else {
        LV_PROCESA = 1;
      }
    } else if (
      this.searchForm.get('processType').value + '' == '5' &&
      this.searchForm.get('action').value == 3
    ) {
      if (elemC.value == '6') {
        //Servicio PA_PAGOS_ARCHIVOS
        await this.pagosArchivos(
          elemC.value,
          this.searchForm.get('action').value
        );
      } else {
        LV_PROCESA = 1;
      }
    }
    if (LV_PROCESA == 1) {
      this.msgPaymentChange =
        'El Tipo de Proceso ' +
        LV_TIPO_PROC +
        ' , para la Acción ' +
        LV_ACCION +
        ' no Existe ...';
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        this.msgPaymentChange
      );
      this.loader.load = false;
    } else {
      if (this.statusPaymentChange == 1) {
        this.alert(
          'warning',
          'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
          this.msgPaymentChange && this.msgPaymentChange.length > 0
            ? this.msgPaymentChange
            : 'No se encontraron datos'
        );
        this.getTableData();
      } else {
        this.loader.load = false;
        this.alert(
          'warning',
          'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
          this.msgPaymentChange && this.msgPaymentChange.length > 0
            ? this.msgPaymentChange
            : 'No se encontraron datos'
        );
      }
    }
  }

  validateLoadCSV() {
    if (!this.searchForm.get('bank').value) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Debe Elegir un Banco'
      );
      return;
    }
    this.loadCSV.nativeElement.click();
  }

  procesa(event: Event) {
    if (!this.searchForm.get('bank').value) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Debe Elegir un Banco'
      );
    } else {
      debugger;
      const files = (event.target as HTMLInputElement).files;
      if (files.length != 1) throw 'No files selected, or more than of allowed';
      const file = files[0];
      if (file.name.toLowerCase().includes('csv')) {
        this.loading = true;
        this.massiveGoodService
          .pupLoadCsvPaymentSearchList(file, this.searchForm.get('bank').value)
          .pipe(take(1))
          .subscribe(
            (event: any) => {
              console.log(event);
              this.loadCSV.nativeElement.value = '';
              if (typeof event === 'object') {
                this.searchForm.get('type').setValue('6');
                this.system.setValue('1');
                this.searchType.setValue('6');
                this.searchForm.updateValueAndValidity();
                this.getTableData();
                // this.getTableData();
                // if (event.CONT > 0) {
                //   let dataCSV: IComerDetExpense[] =
                //     this.getComerDetExpenseArray(event.messages);
                //   if (dataCSV.length > 0) {
                //     this.insertMassive(dataCSV);
                //   } else {
                //     this.alert('error', 'Bienes no válidos', '');
                //   }
                // }
              } else {
                this.loading = false;
                this.alert(
                  'error',
                  'No se pudo realizar la carga de datos',
                  ''
                );
              }
            },
            error => {
              this.loading = false;
              this.loadCSV.nativeElement.value = '';
              this.alert('error', 'No se pudo realizar la carga de datos', '');
            }
          );
      } else {
        this.alert('warning', 'Solo se permite formato csv', '');
      }
    }
  }

  private deleteMassive(id: number | string) {
    this.loader.load = true;
    this.paymentService.deleteMassive(id).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          this.alert(
            'error',
            'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
            'Registro Eliminado Correctamente.'
          );
          this.searchForm.patchValue({
            type: id,
          });
          this.getTableData();
        }
        this.loader.load = false;
      },
      error => {
        this.loader.load = false;
        this.alert(
          'error',
          'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
          'Ocurrió un Error al Eliminar.'
        );
      }
    );
  }

  systemAplicado() {
    //this.pagosMasivosVps('A', 0);
    const elemC = this.searchForm.get('type');
    if (!elemC.value) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Debe seleccionar un tipo de búsqueda mae'
      );
      return;
    }
    this.alertQuestion(
      'question',
      'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
      '¿Esta seguro de actualizar el valor de todos los registros del atributo valido para sistema ?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.LV_VAL_SISTEMA = 'B';
        this.pagosMasivosVps(this.LV_VAL_SISTEMA, Number(elemC.value)); // add PA_PAGOS_MASIVO_VPS;
      }
    });
  }

  pagosCambio(process: number, action: number) {
    return firstValueFrom(
      this.msDepositaryService.getPaymentChange(process, action).pipe(
        catchError(x =>
          of({
            P_EST_PROCESO: 0,
            P_MSG_PROCESO: x.error.message,
          })
        ),
        map(resp => {
          if (resp != null && resp != undefined) {
            console.log('Resp pagosCambios-> ', resp);
            this.statusPaymentChange = resp.P_EST_PROCESO;
            this.msgPaymentChange = resp.P_MSG_PROCESO;
          }
          return true;
        })
      )
    );
  }

  updateRecord(params: any) {
    console.log('Update ParamsFinal-> ', params);
    this.paymentService.UpdateRecord(params).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          this.alert(
            'success',
            'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
            'Registro Actualizado'
          );
          console.log('Resp ActualizarReg', resp);
          //this.getTableData();
          this.getTableData();
          this.localdata.refresh();
        }
      },
      error => {
        this.alert('error', 'Error', error);
        this.loading = false;
      }
    );
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  paPagosEfeDup(params: any) {
    return firstValueFrom(
      this.msDepositaryService.postPaymentEfeDup(params).pipe(
        catchError(x =>
          of({
            P_EST_PROCESO: 0,
            P_MSG_PROCESO: x.error.message,
          })
        ),
        map(resp => {
          if (resp != null && resp != undefined) {
            console.log('Resp paPagosEfeDup-> ', resp);
            this.statusPaymentChange = resp.P_EST_PROCESO;
            this.msgPaymentChange = resp.P_MSG_PROCESO;
          }
          return true;
        })
      )
    );
  }

  pagosArchivos(searchId: any, action: number) {
    return firstValueFrom(
      this.msDepositaryService.getPaymentFile(searchId, action).pipe(
        catchError(x =>
          of({
            P_EST_PROCESO: 0,
            P_MSG_PROCESO: x.error.message,
          })
        ),
        map(resp => {
          if (resp != null && resp != undefined) {
            console.log('Resp pagosArchivos-> ', resp);
            this.statusPaymentChange = resp.P_EST_PROCESO;
            this.msgPaymentChange = resp.P_MSG_PROCESO;
          }
          return true;
        })
      )
    );
  }

  pagosMasivosVps(process: string, action: number) {
    console.log('Proceso accion-> ', process, action);
    this.loader.load = true;
    this.msDepositaryService.getPaymentBulk(process, action).subscribe({
      next: resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp -> ', resp);
          this.APLICADO_EST = resp.P_EST_PROCESO;
          this.APLICADO_MSG = resp.P_MSG_PROCESO;
          if (this.APLICADO_EST == 1) {
            this.alert(
              'warning',
              'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
              this.APLICADO_MSG
            );
            this.getTableData();
          } else {
            this.alert(
              'warning',
              'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
              this.APLICADO_MSG
            );
          }
          this.loader.load = false;
        } else {
          this.alert(
            'error',
            'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
            'No se pudo realizar el proceso'
          );
          this.loader.load = false;
        }
      },
      error: err => {
        this.loader.load = false;
        this.alert(
          'error',
          'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
          err.error.message
        );
      },
    });
  }

  getSegAccessAreas(params: string) {
    this.indUserService.getSegAccessAreas(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        let count = resp.count;
        console.log('Resp GetSegAcces->', resp);
        console.log('Resp.count-> ', resp.count);
      }
    });
  }

  private confirm() {
    if (!this.searchForm.get('type').value) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Requiere tipo de búsqueda de pagos mae'
      );
      return;
    }
    this.loader.load = true;
    const { preferred_username } = this.authService.decodeToken();
    let username = preferred_username;
    this.userAutxCancService
      .getCantUsusAutxCanc(username)
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response > 0) {
            this.pupProcesa();
          } else {
            this.loader.load = false;
            this.alert(
              'error',
              'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
              'Usuario no Autorizado'
            );
          }
        },
      });

    // this.getSegAccessAreas(username);
    // if (this.LV_VALUSER == 0) {
    //   this.alert(
    //     'error',
    //     'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
    //     'Usuario no Autorizado'
    //   );
    // }
    // if (this.LV_USR_CON != 1) {
    //   this.alert(
    //     'error',
    //     'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
    //     'El Usuario no Puede Autorizar Procesar Pagos.'
    //   );
    // } else {
    //   this.pupProcesa();
    // }
  }

  getValidSystem() {
    this.paymentService.getValidSystem().subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('valid system ', resp);
          this.validSystem = resp.data;
        }
        console.log('valid system 2 ', this.validSystem);
      },
      err => {
        console.log('error', err);
      }
    );
  }

  getValidSystemFilter(filter: string): string {
    let aux = '';
    if (filter != null) {
      console.log('system valid filter-> ', filter);
      this.paymentService.getValidSystem(filter).subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            console.log(
              'valid getValidSystemFilter ',
              resp.data[0].valsisDescription
            );
            aux = resp.data[0].valsisDescription;
          }
        },
        err => {
          console.log('error', err);
        }
      );
    }
    console.log('salida aux ', aux);
    return aux;
  }

  CreateAddRow(params: any) {
    console.log('params post ->>', params);
    this.paymentService.postCreateRecord(params).subscribe({
      next: resp => {
        console.log('Resp CreateAddRow', resp);
        if (resp != null && resp != undefined) {
          console.log('CreateAddRow-> ', resp);
          this.alert('success', '', 'Registro Guardado Correctamente.');
        }
        this.getTableData();
        this.localdata.refresh();
      },
      error: err => {
        this.alert('error', '', 'El Registro ya Existe');
        this.loading = false;
      },
    });
  }

  PupBusqueda(params: any) {
    return firstValueFrom(
      this.interfacesirsaeService.postPubBusqueda(params).pipe(
        take(1),
        catchError(x => of(null))
      )
    );
    // resp => {
    //   if (resp != null && resp != undefined) {
    //     console.log('PupBúsqueda', resp);
    //   }
    // };
  }
  getValidSystemKey(filter: string, param: any) {
    if (filter != null) {
      console.log('Params ValidSystem->', param);
      console.log('system valid filter-> ', filter);
      this.paymentService.getValidSystemDesc(filter).subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            console.log('valid valsisKey ', resp.data[0].valsisKey);
            param.validSystem = resp.data[0].valsisKey;
            this.updateRecord(param);
          }
        },
        err => {
          console.log('error', err);
          this.loading = false;
        }
      );
    }
  }

  getCreateValidSys(filter: string, param: any) {
    if (filter != null) {
      console.log('Params ValidSystem->', param);
      console.log('system valid filter-> ', filter);
      this.paymentService.getValidSystemDesc(filter).subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            console.log('valid valsisKey ', resp.data[0].valsisKey);
            param.validSystem = resp.data[0].valsisKey;
            this.CreateAddRow(param);
          }
        },
        err => {
          console.log('error', err);
          this.loading = false;
        }
      );
    }
  }

  PupCambioMasivo(params: any) {
    this.lotService.postCambioMasivo(params).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('PupCambioMasivo->', resp);
          this.alert(
            'success',
            'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
            resp.message
          );
        }
      },
      error => {
        console.log('error ', error);
        this.alert(
          'error',
          'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
          error.error.message
        );
      }
    );
  }

  SelectPago() {
    this.loader.load = true;
    this.msDepositaryService
      .getComerPaymentSelect(
        1,
        this.selectedRows.map(x => {
          return {
            processId: +x.processId,
            movtoNumber: +x.numbermovement,
            monto: +x.amount,
            referenceori: x.referenceori,
          };
        })
      )
      .subscribe(
        resp => {
          this.loader.load = false;
          if (resp != null && resp != undefined) {
            this.alert('success', '', 'Se Procesaron los Registros');
          } else {
            this.alert('error', '', 'No Se Procesaron los Registros');
          }
        },
        err => {
          this.loader.load = false;
          this.alert('error', '', 'No Se Procesaron los Registros');
        }
      );
  }

  onUpload(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('onUpload -> ', this.selectedFile);
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      // formData.forEach((value, key) => {
      //   console.log(key, value);
      // });
      this.PupCambioMasivo(this.selectedFile);
    }
  }
}
