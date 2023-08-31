import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { _Params } from 'src/app/common/services/http-wcontet.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  searchForm: FormGroup = new FormGroup({ bank: new FormControl(null) });
  params = new BehaviorSubject<ListParams>(new ListParams());
  addRows: any[] = [];
  editRows: any[] = [];
  selectedRows: any = [];
  paymentColumns: any[] = [];
  dataRows: any[] = [];
  totalItems: number = 0;
  eventItems = new DefaultSelect();
  bankItems = new DefaultSelect();
  localdata: LocalDataSource = new LocalDataSource();
  banks = new DefaultSelect();
  columnFilters: any = [];
  sssubtypes = new DefaultSelect<any>();
  flag: boolean = false;
  selectedFile: File | null = null;

  LV_MSG_PROCESO: string;
  LV_EST_PROCESO: number = 1;
  LV_TOTREG: number;
  LV_WHERE: number;
  n_CONT: number = 0;

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
    private http: HttpClient
  ) {
    super();
    this.paymentSettings.columns = PAYMENT_COLUMNS;
  }

  ngOnInit(): void {
    this.getValidSystem();
    this.prepareForm();
    this.getParametercomer('SUPUSUCOMER');
    this.getBusquedaPagDet(5);
    this.searchID(5);
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
      .subscribe(() => this.getTableData());
    //this.pagosArchivos(5, 2);
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

  search() {
    // console.log(
    //   'valido sistema key -> ',
    //   this.searchForm.get('validity').value
    // );
    let LV_TOTREG: number;

    this.searchID(5);

    if (this.searchForm.get('system').value == 1) {
      if (this.searchForm.get('searchType').value == 5) {
        this.searchForm.get('bank');
      } else {
        let param = {
          typeSearch: this.searchForm.get('searchType').value,
          event: this.searchForm.get('event').value,
          lot: this.searchForm.get('batch').value,
          bankKey: this.searchForm.get('bank').value,
          amount: this.searchForm.get('amount').value,
          preference: this.searchForm.get('reference').value,
          sistemValue: this.searchForm.get('system').value,
        };
        this.searchPayment(param);

        if (this.LV_EST_PROCESO == 1) {
          console.log('Tipo búsqueda', this.searchForm.get('searchType').value);
          this.getBusquedaPagMae(this.searchForm.get('searchType').value);
        } else {
          this.alert('warning', 'Información', this.LV_MSG_PROCESO);
        }
      }
    } else {
      //Servicio PUP_BUSQUEDA
      let params = {
        keyBank: this.searchForm.get('bank').value,
        amount: this.searchForm.get('amount').value,
        ref: this.searchForm.get('reference').value,
      };
      this.PupBusqueda(params);

      this.searchID(this.LV_TOTREG);
      if (this.LV_TOTREG == 0) {
        this.alert(
          'warning',
          'Información',
          'No se Generaron Registros de la Consulta'
        );
      } else {
        this.getBusquedaPagMae(5);
      }
    }

    this.getTableData();
  }

  formClean() {
    this.searchForm.reset();
    this.paymentColumns = [];
    this.totalItems = 0;
  }

  cleanSearch() {
    const elemC = document.getElementById('typeId') as HTMLInputElement;

    //elemC.value = '';

    this.searchID(elemC.value);
    this.alertQuestion(
      'question',
      'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
      '¿Está Seguro de Eliminar los Registros de la Búsqueda o Cargados por Archivo Tipo CSV ?'
    ).then(async question => {
      if (question.isConfirmed) {
        /*this.searchForm.reset();
        this.paymentColumns = [];
        this.totalItems = 0;*/

        if (this.LV_TOTREG == 0) {
          this.alert(
            'warning',
            'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
            'No Hay Registros para Borrar ...'
          );
        } else {
          this.deleteId(elemC.value);
          this.getBusquedaPagMae(elemC.value);
        }
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
    modalRef.content.onAdd.subscribe(data => {
      if (data) {
        console.log('Data Recibida ADD', data);
        let param = {
          payId: data.paymentId,
          processId: Number(this.processId),
          batchId: data.batchId,
          idEvent: data.event,
          // idCustomer: Number(this.idCustomer),
          idGuySat: Number(2),
          // idselect: Number(this.idselect),
          // incomeid: Number(this.incomeid),
          // idinconsis: Number(data.newData.inconsistencies),
          tsearchId: Number(5),
          numbermovement: Number(0),
          date: data.date != null ? new Date(data.date) : null,
          reference: data.reference,
          referenceori: data.referenceori,
          amount: data.amount,
          cveBank: data.cve,
          code: data.code,
          batchPublic: data.publicBatch,
          validSystem: data.systemValidity,
          result: data.result,
          account: this.account,
          guy: data.type,
        };
        this.getCreateValidSys(data.systemValidity, param);
        //this.CreateAddRow(param);
        //this.getTableData();
      }
    });
    modalRef.content.onEdit.subscribe(data => {
      const elemC = document.getElementById('typeId') as HTMLInputElement;
      if (data) {
        //this.editRow(data);
        console.log('Data Editar', data);
        console.log('fecha a editar -> ', data.newData.date);
        let param = {
          tsearchId: Number(5),
          payId: data.newData.paymentId,
          processId: Number(this.processId),
          batchId: Number(data.newData.batchId),
          idEvent: Number(data.newData.event),
          idCustomer: Number(this.idCustomer),
          idGuySat: Number(this.idGuySat),
          idselect: Number(this.idselect),
          incomeid: Number(this.incomeid),
          idinconsis: Number(data.newData.inconsistencies),
          numbermovement: Number(data.newData.entryOrderId),
          date: data.newData.date != null ? new Date(data.newData.date) : null,
          reference: data.newData.reference,
          referenceori: data.newData.referenceori,
          amount: data.newData.amount,
          cveBank: data.newData.cve,
          code: Number(data.newData.code),
          batchPublic: Number(data.newData.publicBatch),
          validSystem: this.keyValidEdit,
          result: data.newData.result,
          account: this.account,
          guy: data.newData.type,
        };
        this.getValidSystemKey(data.newData.systemValidity, param);
        console.log('ParamsUpdate->', param);
        // this.updateRecord(param);
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
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PaymentSearchProcessComponent, config);
  }

  changeProcess2() {
    const elemC = document.getElementById('typeId') as HTMLInputElement;
    console.log('Data elemC-> ', elemC.value);
    this.openModal2(elemC.value);
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
      console.log('SelectRows', this.selectedRows[0].id_select);
      this.flag = true;
    } else {
      this.flag = false;
      this.selectedRows = [];
    }
  }

  changeCheckBox() {
    console.log('this.selectedRows-> ', this.selectedRows);
    const elemC = document.getElementById('typeId') as HTMLInputElement;
    console.log('SearchId-> ', elemC.value);

    if (elemC.value == null || elemC.value == '') {
      this.alert(
        'warning',
        '',
        'No se Ha Seleccionado el Campo Tipo de Búsqueda'
      );
    } else {
      this.SelectPago(this.selectedRows[0].id_select, elemC.value);
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

  getTableData() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.dataRows = [];
    this.localdata.load(this.dataRows);
    this.localdata.refresh();
    console.log('PARAMS', params);
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

    this.paymentService.getBusquedaPag(params).subscribe({
      next: res => {
        console.log('getBusquedaPag -> ', res);
        const params = new ListParams();
        for (let i = 0; i < res.count; i++) {
          console.log('Entra al FOR', res.data);
          if (res.data[i] != undefined) {
            console.log('Res.Data-> ', res.data);
            const _params: any = params;
            _params['filter.idType'] = `$eq:${res.data[i].idGuySat}`;
            console.log('Filter-> ', _params);
            this.accountMovementService.getPaymentTypeSat(_params).subscribe(
              response => {
                console.log('GetPaymentTypeSat->', response);
                if (response != null && response != undefined) {
                  if (res.data[i].validSystem) {
                    console.log(
                      'Resp PaymentSat',
                      response.data[0].description
                    );
                    this.paymentService
                      .getValidSystem(res.data[i].validSystem)
                      .subscribe(resp => {
                        let item = {
                          movement: res.data[i].numbermovement,
                          date: res.data[i].date,
                          referenceori: res.data[i].referenceori,
                          reference: res.data[i].reference,
                          amount: res.data[i].amount,
                          cve: res.data[i].cveBank,
                          code: res.data[i].code,
                          publicBatch: res.data[i].batchPublic,
                          event: res.data[i].idEvent,
                          systemValidity: resp.data[0].valsisDescription,
                          result: res.data[i].result,
                          paymentId: res.data[i].payId,
                          batchId: res.data[i].batchId,
                          entryOrderId: res.data[i].numbermovement,
                          satDescription: response.data[0].description,
                          type: res.data[i].guy,
                          inconsistencies: res.data[i].idinconsis,
                          id_select: res.data[i].idselect,
                        };

                        console.log(
                          'Descripcion Pag Sat-> ',
                          this.getPaymentSat(params, res.data[i].idGuySat) // <- Undefine
                        );
                        this.dataRows.push(item);
                        this.localdata.load(this.dataRows);
                        console.log('this dataRows: ', this.dataRows);
                        console.log('this localData: ', this.localdata);
                        this.totalItems = res.count;
                      });
                  } else {
                    let item = {
                      movement: res.data[i].numbermovement,
                      date: res.data[i].date,
                      referenceori: res.data[i].referenceori,
                      reference: res.data[i].reference,
                      amount: res.data[i].amount,
                      cve: res.data[i].cveBank,
                      code: res.data[i].code,
                      publicBatch: res.data[i].batchPublic,
                      event: res.data[i].idEvent,
                      systemValidity: res.data.valsisDescription,
                      result: res.data[i].result,
                      paymentId: res.data[i].payId,
                      batchId: res.data[i].batchId,
                      entryOrderId: res.data[i].numbermovement,
                      satDescription: response.data[0].description,
                      type: res.data[i].guy,
                      inconsistencies: res.data[i].idinconsis,
                      id_select: res.data[i].idselect,
                    };

                    console.log(
                      'Descripcion Pag Sat-> ',
                      this.getPaymentSat(params, res.data[i].idGuySat) // <- Undefine
                    );
                    this.dataRows.push(item);
                    this.localdata.load(this.dataRows);
                    console.log('this dataRows: ', this.dataRows);
                    console.log('this localData: ', this.localdata);
                    this.totalItems = res.count;
                  }
                }
              },
              error => {
                return null;
              }
            );
          }
        }
      },
      error: err => {
        // this.alert(
        //   'warning',
        //   'Información',
        //   'No hay bienes que mostrar con los filtros seleccionado'
        // );
      },
    });
  }

  getBusquedaPagMae(params: number | string) {
    const elemC = document.getElementById('typeId') as HTMLInputElement;
    elemC.value = '';
    this.searchForm.get('type').setValue('');

    this.paymentService.getBusquedaMae(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        this.LV_WHERE = resp.data[0].desTsearch;
        //this.searchForm.get('type').setValue(resp.data[0].desTsearch);
        this.searchForm.patchValue({
          type: resp.data[0].desTsearch,
        });
        elemC.value = resp.data[0].tsearchId;
        console.log('Resp PagosMae-> ', resp);
      }
    });
  }

  getBusquedaPagDet(params?: number) {
    this.paymentService.getBusquedaPag(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp BusquedaPagDet', resp);
        this.processId = resp.data[0].processId;
        this.idCustomer = resp.data[0].idCustomer;
        this.idGuySat = resp.data[0].idGuySat;
        this.idselect = resp.data[0].idselect;
        this.incomeid = resp.data[0].incomeid;
        this.account = resp.data[0].account;
      }
    });
  }

  getPaymentSat(params: _Params, id: number): any {
    const _params: any = params;
    _params['filter.idType'] = `$eq:${id}`;
    this.accountMovementService.getPaymentTypeSat(_params).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp PaymentSat', resp.data[0].description);
          return resp.data[0].description;
        }
      },
      error => {
        return null;
      }
    );
  }

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
    this.msDepositaryService.postSearchPay(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        this.LV_MSG_PROCESO = resp.messageProcess;
        this.LV_EST_PROCESO = resp.statusProcess;
        console.log('Resp SearchPay-> ', resp);
        console.log('LV_MSG_PROCESO-> ', resp.messageProcess);
        console.log('LV_EST_PROCESO-> ', resp.statusProcess);
      }
    });
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

  pupProcesa() {
    let LV_TIPO_PROC: string;
    let LV_ACCION: string;
    let LV_PROCESA: number;

    LV_PROCESA == 0;
    const elemC = document.getElementById('typeId') as HTMLInputElement;

    if (
      this.searchForm.get('processType').value == 0 &&
      this.searchForm.get('action').value == 2
    ) {
      if (this.searchForm.get('typeId').value == 0) {
        //integrar PA_PAGOS_CAMBIOS}
        this.pagosCambio(
          this.searchForm.get('processType').value,
          this.searchForm.get('action').value
        );
      } else {
        LV_PROCESA = 1;
      }
    } else if (
      this.searchForm.get('processType').value &&
      this.searchForm.get('action').value
    ) {
      if (this.searchForm.get('typeId').value) {
        //servicio PA_PAGOS_EFE_DUP_NREF
        this.paPagosEfeDup(
          this.searchForm.get('processType').value &&
            this.searchForm.get('action').value
        );
      } else {
        LV_PROCESA = 1;
      }
    } else if (
      this.searchForm.get('typeId').value == 5 &&
      this.searchForm.get('action').value == 3
    ) {
      if (this.searchForm.get('typeId').value == 6) {
        //Servicio PA_PAGOS_ARCHIVOS
        this.pagosArchivos(elemC.value, this.searchForm.get('action').value);
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
    } else {
      if (this.statusPaymentChange == 1) {
        this.alert(
          'warning',
          'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
          this.msgPaymentChange
        );
      } else {
        this.alert(
          'warning',
          'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
          this.msgPaymentChange
        );
      }
    }
  }

  procesa() {
    if (this.searchForm.get('bank').value == 0) {
      this.alert(
        'warning',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Debe Elegir un Banco'
      );
    } else {
      //Por Implementar PUP_CARGA_CSV
    }
  }

  deleteId(id: number | string) {
    this.paymentService.deleteId(id).subscribe(
      resp => {
        if (resp != null && resp != undefined) {
          this.alert(
            'error',
            'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
            'Registro Eliminado Correctamente.'
          );
        }
      },
      error => {
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
    const elemC = document.getElementById('typeId') as HTMLInputElement;
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
    this.msDepositaryService
      .getPaymentChange(process, action)
      .subscribe(resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp pagosCambios-> ', resp);
          this.statusPaymentChange = resp.data.P_EST_PROCESO;
          this.msgPaymentChange = resp.data.P_MSG_PROCESO;
        }
      });
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
    this.msDepositaryService.postPaymentEfeDup(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp paPagosEfeDup-> ', resp);
        this.statusPaymentChange = resp.data.P_EST_PROCESO;
        this.msgPaymentChange = resp.data.P_MSG_PROCESO;
      }
    });
  }

  pagosArchivos(searchId: any, action: number) {
    this.msDepositaryService
      .getPaymentFile(searchId, action)
      .subscribe(resp => {
        if (resp != null && resp != undefined) {
          console.log('Resp pagosArchivos-> ', resp);
          this.statusPaymentChange = resp.data.P_EST_PROCESO;
          this.msgPaymentChange = resp.data.P_MSG_PROCESO;
        }
      });
  }

  pagosMasivosVps(process: string, action: number) {
    console.log('Proceso accion-> ', process, action);
    this.msDepositaryService.getPaymentBulk(process, action).subscribe(resp => {
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
        } else {
          this.alert(
            'warning',
            'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
            this.APLICADO_MSG
          );
        }
      }
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

  confirm() {
    const { preferred_username } = this.authService.decodeToken();
    let username = preferred_username;
    this.getSegAccessAreas(username);
    if (this.LV_VALUSER == 0) {
      this.alert(
        'error',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'Usuario no Autorizado'
      );
    }
    if (this.LV_USR_CON != 1) {
      this.alert(
        'error',
        'BÚSQUEDA Y PROCESAMIENTO DE PAGOS',
        'El Usuario no Puede Autorizar Procesar Pagos.'
      );
    } else {
      this.pupProcesa();
    }
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
      },
    });
  }

  PupBusqueda(params: any) {
    this.interfacesirsaeService.postPubBusqueda(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('PupBúsqueda', resp);
      }
    });
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

  SelectPago(multiple: number, idSearch: any) {
    this.msDepositaryService
      .getComerPaymentSelect(multiple, idSearch)
      .subscribe(
        resp => {
          if (resp != null && resp != undefined) {
            this.alert('success', '', 'Se Procesaron los Registros');
          }
        },
        err => {
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
