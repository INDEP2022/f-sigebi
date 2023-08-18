import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { _Params } from 'src/app/common/services/http-wcontet.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
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
  searchForm: FormGroup = new FormGroup({ bank: new FormControl(null) });
  params = new BehaviorSubject<ListParams>(new ListParams());
  addRows: any[] = [];
  editRows: any[] = [];
  selectedRows: any[] = [];
  paymentColumns: any[] = [];
  dataRows: any[] = [];
  totalItems: number = 0;
  eventItems = new DefaultSelect();
  bankItems = new DefaultSelect();
  localdata: LocalDataSource = new LocalDataSource();
  banks = new DefaultSelect();
  columnFilters: any = [];

  //params = new BehaviorSubject<FilterParams>(new FilterParams());
  paymentSettings = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    rowClassFunction: (row: { data: { available: any } }) =>
      row.data.available ? 'available' : 'not-available',
    selectMode: 'multi',
    actions: {
      columnTitle: 'Acciones',
      edit: true,
      add: false,
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
    private accountMovementService: AccountMovementService
  ) {
    super();
    this.paymentSettings.columns = PAYMENT_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log('antes servicio');
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
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'movement':
                field = 'filter.numbermovement';
                searchFilter = SearchFilter.EQ;
                break;
              case 'date':
                searchFilter = SearchFilter.EQ;
                break;
              case 'originalReference':
                searchFilter = SearchFilter.EQ;
                break;
              case 'reference':
                searchFilter = SearchFilter.EQ;
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
      processType: [null, [Validators.required]],
      system: [null, [Validators.required]],
      action: [null, [Validators.required]],
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
    let LV_MSG_PROCESO: string;
    let LV_EST_PROCESO: number = 1;
    let LV_TOTREG: number;

    if (this.searchForm.get('system').value == 1) {
      if (this.searchForm.get('searchType').value == 5) {
        this.searchForm.get('bank');
      } else {
        //Cod pasado back
        //
        if (LV_EST_PROCESO == 1) {
          console.log('Tipo búsqueda', this.searchForm.get('searchType').value);
          this.getBusquedaPagMae(this.searchForm.get('searchType').value);
        }
      }
    } else {
      //Cod PUP_BUSQUEDA
    }

    this.getTableData();
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

  addRow(rows: any[]) {
    this.paymentColumns = [...this.paymentColumns, ...rows];
    this.totalItems = this.paymentColumns.length;
    this.addRows.push(...rows);
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

  getTableData() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.dataRows = [];
    this.localdata.load(this.dataRows);
    this.localdata.refresh();
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
        console.log('Res -> ', res);
        const params = new ListParams();
        for (let i = 0; i < res.count; i++) {
          if (res.data[i] != undefined) {
            const _params: any = params;
            _params['filter.idType'] = `$eq:${res.data[i].idGuySat}`;
            this.accountMovementService.getPaymentTypeSat(_params).subscribe(
              response => {
                if (response != null && response != undefined) {
                  console.log('Resp PaymentSat', response.data[0].description);

                  let item = {
                    movement: res.data[i].numbermovement,
                    date: res.data[i].date,
                    originalReference: res.data[i].referenceori,
                    reference: res.data[i].reference,
                    amount: res.data[i].amount,
                    cve: res.data[i].cveBank,
                    code: res.data[i].code,
                    publicBatch: res.data[i].batchPublic,
                    event: res.data[i].idEvent,
                    systemValidity: res.data[i].validSystem,
                    result: res.data[i].result,
                    paymentId: res.data[i].payId,
                    batchId: res.data[i].batchId,
                    entryOrderId: res.data[i].numbermovement,
                    satDescription: response.data[0].description,
                    type: res.data[i].guy,
                    inconsistencies: res.data[i].idinconsis,
                  };
                  console.log(
                    'Descripcion Pag Sat-> ',
                    this.getPaymentSat(params, res.data[i].idGuySat)
                  );
                  this.dataRows.push(item);
                  this.localdata.load(this.dataRows);
                  console.log('this dataRows: ', this.dataRows);
                  console.log('this localData: ', this.localdata);
                  this.totalItems = res.count;
                }
              },
              error => {
                return null;
              }
            );
          }
        }
        this.addRow(this.dataRows);
      },
      error: err => {
        this.alert(
          'warning',
          'Información',
          'No hay bienes que mostrar con los filtros seleccionado'
        );
      },
    });
  }

  getBusquedaPagMae(lparams: string) {
    this.paymentService.getBusquedaMae(lparams).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp PagosMae-> ', resp);
      }
    });
  }

  getBusquedaPagDet(params?: string) {
    this.paymentService.getBusquedaPag(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp BusquedaPagDet', resp);
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
}
