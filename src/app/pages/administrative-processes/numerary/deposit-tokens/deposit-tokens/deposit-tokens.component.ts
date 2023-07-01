import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ICuentaDelete } from 'src/app/core/models/catalogs/bank-modelo-type-cuentas';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AddMovementComponent } from '../add-movement/add-movement.component';
import { CustomdbclickComponent } from '../customdbclick/customdbclick.component';
import { CustomdbclickdepositComponent } from '../customdbclickdeposit/customdbclickdeposit.component';
import { DepositTokensModalComponent } from '../deposit-tokens-modal/deposit-tokens-modal.component';
import { CustomDateFilterComponent_ } from './searchDate';
@Component({
  selector: 'app-deposit-tokens',
  templateUrl: './deposit-tokens.component.html',
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
export class DepositTokensComponent extends BasePage implements OnInit {
  form: FormGroup;

  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  dataMovements: any = null;
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  jsonToCsv: any[] = [];
  showPagination: boolean = true;
  dateMovemInicio: Date;
  dateMovemFin: Date;
  loadingBtn: boolean = false;
  valorDate1: string = 'Fecha Transferencia';
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private accountMovementService: AccountMovementService,
    private datePipe: DatePipe,
    private readonly goodServices: GoodService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private excelService: ExcelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        delete: true,
        edit: false,
        add: false,
      },
      delete: {
        deleteButtonContent:
          '<i class="pl-4 fa fa-trash text-danger mx-2"></i>',
        confirmDelete: true,
      },
      hideSubHeader: false,
      columns: {
        bank: {
          title: 'Banco',
          type: 'string',
          sort: false,
        },
        cveAccount: {
          title: 'Cuenta',
          type: 'string',
          sort: false,
        },
        motionDate: {
          title: 'Fecha Depósito',
          // type: 'string',
          sort: false,
          // width: '13%',
          type: 'html',
          valuePrepareFunction: (text: string) => {
            return `${
              text ? text.split('T')[0].split('-').reverse().join('-') : ''
            }`;
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent_,
          },
        },
        folio_ficha: {
          title: 'Folio',
          type: 'string',
          sort: false,
        },
        calculationInterestsDate: {
          title: 'Fecha Transferencia',
          // type: 'string',
          sort: false,
          // width: '13%',
          type: 'html',
          valuePrepareFunction: (text: string) => {
            return `${
              text ? text.split('T')[0].split('-').reverse().join('-') : ''
            }`;
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent_,
          },
        },
        currency: {
          title: 'Moneda',
          type: 'string',
          sort: false,
        },
        deposito: {
          title: 'Depósito',
          type: 'custom',
          sort: false,
          renderComponent: CustomdbclickdepositComponent,
          onComponentInitFunction: (instance: any) => {
            instance.funcionEjecutada.subscribe(() => {
              this.miFuncion();
            });
          },
        },
        no_expediente: {
          title: 'Expediente',
          type: 'string',
          sort: false,
        },
        no_bien: {
          title: 'Bien',
          type: 'custom',
          sort: false,
          renderComponent: CustomdbclickComponent,
          onComponentInitFunction: (instance: any) => {
            instance.funcionEjecutada.subscribe(() => {
              this.miFuncion();
            });
          },
        },
        categoria: {
          title: 'Categoria',
          type: 'string',
          sort: false,
        },
        es_parcializacion: {
          title: 'Parcial',
          type: 'string',
          sort: false,
        },
      },
      rowClassFunction: (row: any) => {
        if (row.data.no_bien != null) {
          return 'bg-warning text-black';
        } else {
          return '';
        }
      },
    };
    // this.settings.delete = true;

    // this.settings.rowClassFunction = async (row: any) => {

    // };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              bank: () => (searchFilter = SearchFilter.ILIKE),
              cveAccount: () => (searchFilter = SearchFilter.EQ),
              motionDate: () => (searchFilter = SearchFilter.ILIKE),
              folio_ficha: () => (searchFilter = SearchFilter.ILIKE),
              calculationInterestsDate: () =>
                (searchFilter = SearchFilter.ILIKE),
              currency: () => (searchFilter = SearchFilter.ILIKE),
              deposito: () => (searchFilter = SearchFilter.EQ),
              no_expediente: () => (searchFilter = SearchFilter.EQ),
              no_bien: () => (searchFilter = SearchFilter.EQ),
              categoria: () => (searchFilter = SearchFilter.ILIKE),
              es_parcializacion: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              console.log('filter.search', filter.search);
              if (filter.search == 'motionDate') {
              }
              this.columnFilters[field] = `${filter.search}`;
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              console.log(
                'this.columnFilters[field]',
                this.columnFilters[field]
              );
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getAccount();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getAccount();
    });
  }

  getAccount() {
    this.loading = true;
    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    console.log('params1', params);
    if (params['filter.motionDate']) {
      var fecha = new Date(params['filter.motionDate']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['motionDate'] = fechaFormateada;
      delete params['filter.motionDate'];
    }
    if (params['filter.deposito']) {
      params['deposit'] = params['filter.deposito'];
      delete params['filter.deposito'];
    }
    if (params['filter.calculationInterestsDate']) {
      var fecha = new Date(params['filter.calculationInterestsDate']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['calculationInterestsDate'] = fechaFormateada;
      delete params['filter.calculationInterestsDate'];
    }
    if (params['filter.no_bien']) {
      params['goodNumber'] = params['filter.no_bien'];
      delete params['filter.no_bien'];
    }
    if (params['filter.no_expediente']) {
      params['proceedingsNumber'] = params['filter.no_expediente'];
      delete params['filter.no_expediente'];
    }
    if (params['filter.categoria']) {
      params['category'] = params['filter.categoria'];
      delete params['filter.categoria'];
    }
    if (params['filter.es_parcializacion']) {
      params['ispartialization'] = params['filter.es_parcializacion'];
      delete params['filter.es_parcializacion'];
    }

    console.log('params2', params);
    this.accountMovementService.getAccount2(params).subscribe({
      next: async (response: any) => {
        let result = response.data.map(async (item: any) => {
          const detailsBank: any = await this.returnDataBank(item.no_cuenta);

          item['currency'] = detailsBank ? detailsBank.cveCurrency : null;
          item['bank'] = detailsBank ? detailsBank.cveBank : null;
          item['cveAccount'] = detailsBank ? detailsBank.cveAccount : null;
          item['motionDate'] = item.fec_movimiento
            ? this.datePipe.transform(item.fec_movimiento, 'dd/MM/yyyy')
            : null;
          item['calculationInterestsDate'] = item.fec_calculo_intereses
            ? this.datePipe.transform(item.fec_calculo_intereses, 'dd/MM/yyyy')
            : null;
          item['bancoDetails'] = detailsBank ? detailsBank : null;
        });

        Promise.all(result).then((resp: any) => {
          this.showPagination = true;
          this.totalItems = response.count;
          this.data1.load(response.data);
          this.data1.refresh();
          console.log(response);
          this.loading = false;
        });
      },
      error: err => {
        this.loading = false;
        this.totalItems = 0;
        this.data1.load([]);
        this.data1.refresh();
      },
    });
  }

  async returnDataBank(id: any) {
    const params = new ListParams();
    params['filter.accountNumber'] = `$eq:${id}`;

    return new Promise((resolve, reject) => {
      this.accountMovementService.getAccountBank(params).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          console.log(err);
        },
      });
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      descriptionGood: [null, Validators.nullValidator],
      bank: [null, Validators.nullValidator],
      account: [null, Validators.nullValidator],
      accountType: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      square: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      branch: [null, Validators.nullValidator],
      di_saldo: [null, Validators.nullValidator],
      balanceOf: [null, Validators.nullValidator],
      balanceAt: [null, Validators.nullValidator],
    });
  }

  async onCustomAction(event: any) {
    this.dataMovements = event.data;
    console.log('data', event);
    // DESCRIPCIÓN DEL BIEN
    if (event.data.no_bien) {
      this.getDetailsGood(event.data.no_bien);
    } else {
      this.form.get('descriptionGood').setValue('');
    }

    // DETALLES DE LA CUENTA
    if (event.data.bancoDetails) {
      await this.insertDataBank(event.data.bancoDetails);

      if (event.data.bancoDetails.cveCurrency) {
        await this.getTvalTable5(event.data.bancoDetails.cveCurrency);
      }
    }
  }

  async insertDataBank(bank: any) {
    this.form.get('bank').setValue(bank.banco.name);
    this.form.get('account').setValue(bank.cveAccount);
    this.form.get('accountType').setValue(bank.accountType);
    this.form.get('currency').setValue(bank.cveCurrency);
    this.form.get('square').setValue(bank.square);
    this.form.get('branch').setValue(bank.branch);
    this.form.get('balanceOf').setValue('');
    this.form.get('balanceAt').setValue('');
  }

  async cleanDataBank() {
    this.form.get('bank').setValue('');
    this.form.get('account').setValue('');
    this.form.get('accountType').setValue('');
    this.form.get('currency').setValue('');
    this.form.get('square').setValue('');
    this.form.get('branch').setValue('');
    this.form.get('balanceOf').setValue('');
    this.form.get('description').setValue('');
    this.form.get('balanceAt').setValue('');
    this.form.get('di_saldo').setValue('');
  }

  // BUTTONS FUNCTIONS //

  async desconciliarFunc() {
    // this.loading = true;
    if (this.dataMovements) {
      if (this.dataMovements.no_bien == null) {
        this.alert(
          'warning',
          'No existe un bien asociado a este depósito.',
          ''
        );
      } else {
        let obj: any = {
          numberMotion: this.dataMovements.no_movimiento,
          numberAccount: this.dataMovements.no_cuenta,
          numberGood: null,
          numberProceedings: null,
        };
        this.accountMovementService.update(obj).subscribe({
          next: async (response: any) => {
            this.getAccount();
            this.alert(
              'success',
              `El bien ${this.dataMovements.no_bien} ha sido desconciliado`,
              ''
            );
            this.form.get('descriptionGood').setValue('');
          },
          error: err => {
            this.alert('error', `Error al desconciliar`, err.error.message);
            this.loading = false;
          },
        });
      }
    }
  }

  async actualizarFunc() {
    this.showPagination = true;
    this.paramsList.getValue().limit = 10;
    this.paramsList.getValue().page = 1;
    this.form.get('descriptionGood').setValue('');
    this.getAccount();
    if (this.dataMovements) {
      if (this.dataMovements.bank) {
        this.cleanDataBank();
        this.dataMovements = null;
      }
    }
  }

  async importar() {}

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      const excelImport = this.excelService.getData<any>(binaryExcel);
      this.data1.load(excelImport);
      this.showPagination = false;
      this.totalItems = this.data1.count();
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  async exportar() {
    const filename: string = 'Deposit Tokens';
    const jsonToCsv = await this.returnJsonToCsv();
    console.log('jsonToCsv', jsonToCsv);
    this.jsonToCsv = jsonToCsv;
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  async returnJsonToCsv() {
    return this.data1.getAll();
  }
  // GET DETAILS CURRENCY //
  async getTvalTable5(currency: any) {
    const params = new ListParams();
    params['filter.nmtable'] = `$eq:3`;
    params['filter.otkey1'] = `$eq:${currency}`;
    this.dynamicCatalogsService.getTvalTable5(params).subscribe({
      next: response => {
        this.form.get('description').setValue(response.data[0].otvalor01);
        this.loading = false;
      },
      error: err => {
        console.log(err);
        this.form.get('description').setValue('');
        this.loading = false;
      },
    });
  }

  getAttributes() {
    // this.loading = true;
    // this.attributesInfoFinancialService
    //   .getAll(this.params.getValue())
    //   .subscribe({
    //     next: response => {
    //       this.attributes = response.data;
    //       this.totalItems = response.count;
    //       this.loading = false;
    //     },
    //     error: error => (this.loading = false),
    //   });
  }

  getDetailsGood(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: async (response: any) => {
        this.form.get('descriptionGood').setValue(response.data[0].description);
      },
      error: err => {
        this.form.get('descriptionGood').setValue('');
      },
    });
  }

  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    let noCuenta = null;
    if (this.dataMovements) {
      noCuenta = this.dataMovements.bancoDetails.accountNumber;
    }
    modalConfig.initialState = {
      noCuenta,
      data,
      callback: (next: boolean) => {
        if (next) this.getAttributes();
      },
    };
    this.modalService.show(DepositTokensModalComponent, modalConfig);
  }

  miFuncion() {
    this.getAccount();
    // console.log('Función ejecutada desde el componente hijo');
  }

  addMovement() {
    let data = 1;
    this.openFormAdd(data);
  }

  openFormAdd(data?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {
        this.getAccount();
        console.log('AQUI', next);
      },
    };
    this.modalService.show(AddMovementComponent, modalConfig);
  }

  async showDeleteAlert(data: any) {
    console.log(data);
    let vb_hay_hijos: boolean = false;

    if (data.no_bien != null) {
      this.alert(
        'warning',
        'No puede eliminar un movimiento que ya está asociado a un expediente-bien',
        ''
      );
    } else {
      // VERIFICAR CHEQUES
      const val: any = await this.getChecksReturn(data.no_movimiento);
      vb_hay_hijos = val;

      if (vb_hay_hijos) {
        this.alert(
          'warning',
          'No se puede eliminar una ficha mientras tenga devoluciones registradas',
          ''
        );
      } else {
        this.alertQuestion(
          'question',
          'Se eliminará el movimiento',
          '¿Desea Continuar?'
        ).then(async question => {
          if (question.isConfirmed) {
            let obj: ICuentaDelete = {
              numberAccount: Number(data.no_cuenta),
              numberMotion: Number(data.no_movimiento),
            };
            this.accountMovementService.eliminarMovementAccount(obj).subscribe({
              next: response => {
                this.getAccount();
                this.alert('success', 'Movimiento Eliminado Correctamente', '');
                console.log('res', response);
              },
              error: err => {
                this.alert('error', 'Error al eliminar el movimiento', '');
              },
            });
          }
        });
      }
    }
  }

  async getChecksReturn(id: any) {
    return new Promise((resolve, reject) => {
      this.accountMovementService.getReturnCheck(id).subscribe({
        next: response => {
          console.log('res', response);
          resolve(true);
        },
        error: err => {
          resolve(false);
        },
      });
    });
  }

  dateMovementInicio(event: any) {
    console.log('ev', event);
    console.log('dateMovem', this.dateMovemInicio);
    this.form.get('balanceAt').setValue('');
    // this.dateMovem = event.target.value;
  }

  dateMovementFin(event: any) {
    console.log('ev', event);
    console.log('dateMovem', this.dateMovemInicio);
    // this.calcularSaldo()
    // this.dateMovem = event.target.value;
  }

  calcularSaldo() {
    if (this.dataMovements) {
      let obj = {
        no_cuenta: this.dataMovements.no_cuenta,
        ti_fecha_calculo: this.dateMovemInicio,
        ti_fecha_calculo_fin: this.dateMovemFin,
      };
      this.loadingBtn = true;
      this.accountMovementService.getReturnSaldo(obj).subscribe({
        next: async (response: any) => {
          this.form.get('di_saldo').setValue(response.data[0].di_saldo);
          this.loadingBtn = false;
        },
        error: err => {
          this.form.get('di_saldo').setValue('');
          this.loadingBtn = false;
        },
      });
    }
  }
}
