import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ICuentaDelete } from 'src/app/core/models/catalogs/bank-modelo-type-cuentas';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MsMassiveAccountmvmntlineService } from 'src/app/core/services/ms-massiveaccountmvmnt/ms-massiveaccountmvmnt.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AddMovementComponent } from '../add-movement/add-movement.component';
import { CustomdbclickComponent } from '../customdbclick/customdbclick.component';
import { CustomdbclickdepositComponent } from '../customdbclickdeposit/customdbclickdeposit.component';
import { DepositTokensModalComponent } from '../deposit-tokens-modal/deposit-tokens-modal.component';

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
export class DepositTokensComponent
  extends BasePage
  implements OnInit, OnChanges
{
  form: FormGroup;

  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItems2: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  dataMovements: any = null;
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  paramsList2 = new BehaviorSubject<ListParams>(new ListParams());
  jsonToCsv: any[] = [];
  showPagination: boolean = true;
  dateMovemInicio: Date;
  dateMovemFin: Date;
  loadingBtn: boolean = false;
  valorDate1: string = 'Fecha Transferencia';
  @ViewChild('file', { static: false }) myInput: ElementRef;

  testCompare: any;
  validExcel: boolean = true;
  settings2 = { ...this.settings };
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private accountMovementService: AccountMovementService,
    private datePipe: DatePipe,
    private readonly goodServices: GoodService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private excelService: ExcelService,
    private msMassiveAccountmvmntlineService: MsMassiveAccountmvmntlineService,
    private token: AuthService
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
        motionDate_: {
          title: 'Fecha Depósito',
          // type: 'string',
          sort: false,
          // width: '13%',
          type: 'html',
          valuePrepareFunction: (text: string) => {
            console.log('text', text);
            if (typeof text === 'number') {
              let date = new Date((Number(text) - 25569) * 86400 * 1000);
              let fechaString = date.toString();

              let fecha = new Date(fechaString);

              let dia = fecha.getDate();
              let mes = fecha.getMonth() + 1; // Se suma 1 porque los meses se indexan desde 0
              let año = fecha.getFullYear();

              // Asegurarse de que el día y el mes tengan dos dígitos
              let diaString = dia < 10 ? '0' + dia : dia;
              let mesString = mes < 10 ? '0' + mes : mes;

              let fechaFormateada = `${diaString}/${mesString}/${año}`;

              return `${fechaFormateada}`;
            } else {
              return `${
                text ? text.split('T')[0].split('-').reverse().join('/') : ''
              }`;
            }
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
        },
        invoicefile: {
          title: 'Folio',
          type: 'string',
          sort: false,
        },
        calculationInterestsDate_: {
          title: 'Fecha Transferencia',
          // type: 'string',
          sort: false,
          // width: '13%',
          type: 'html',
          valuePrepareFunction: (text: string) => {
            console.log('text', text);
            if (typeof text === 'number') {
              let date = new Date((Number(text) - 25569) * 86400 * 1000);
              let fechaString = date.toString();

              let fecha = new Date(fechaString);

              let dia = fecha.getDate();
              let mes = fecha.getMonth() + 1; // Se suma 1 porque los meses se indexan desde 0
              let año = fecha.getFullYear();

              // Asegurarse de que el día y el mes tengan dos dígitos
              let diaString = dia < 10 ? '0' + dia : dia;
              let mesString = mes < 10 ? '0' + mes : mes;

              let fechaFormateada = `${diaString}/${mesString}/${año}`;

              return `${fechaFormateada}`;
            } else {
              return `${
                text ? text.split('T')[0].split('-').reverse().join('/') : ''
              }`;
            }
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
        },
        currency: {
          title: 'Moneda',
          type: 'string',
          sort: false,
          valuePrepareFunction: (_cell: any, row: any) => {
            return row.currency == "'M'" ? 'M' : row.currency;
          },
        },
        deposit: {
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
        proceedingsnumber: {
          title: 'Expediente',
          type: 'string',
          sort: false,
        },
        goodnumber: {
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
        category: {
          title: 'Categoría',
          type: 'string',
          sort: false,
        },
        ispartialization: {
          title: 'Parcial',
          type: 'string',
          sort: false,
        },
        motionnumber: {
          title: 'No. Movimiento',
          type: 'string',
          sort: false,
        },
      },
      rowClassFunction: (row: any) => {
        if (row.data.goodnumber != null) {
          return 'bg-warning text-black';
        } else {
          return '';
        }
      },
    };

    this.settings2 = {
      ...this.settings,
      // actions: {
      //   columnTitle: 'Acciones',
      //   delete: true,
      //   edit: false,
      //   add: false,
      // },
      // delete: {
      //   deleteButtonContent:
      //     '<i class="pl-4 fa fa-trash text-danger mx-2"></i>',
      //   confirmDelete: true,
      // },
      // hideSubHeader: false,
      columns: {
        // TI_BANCO: {
        //   title: 'No. Movimiento',
        //   type: 'string',
        //   sort: false,
        // },
        TI_BANCO: {
          title: 'Banco',
          type: 'string',
          sort: false,
        },
        DI_CUENTA: {
          title: 'Cuenta',
          type: 'string',
          sort: false,
        },
        FEC_MOVIMIENTO: {
          title: 'Fecha Depósito',
          // type: 'string',
          sort: false,
          // width: '13%',
          type: 'html',
          valuePrepareFunction: (text: string) => {
            console.log('text', text);
            if (typeof text === 'number') {
              let date = new Date((Number(text) - 25569) * 86400 * 1000);
              let fechaString = date.toString();

              let fecha = new Date(fechaString);

              let dia = fecha.getDate();
              let mes = fecha.getMonth() + 1; // Se suma 1 porque los meses se indexan desde 0
              let año = fecha.getFullYear();

              // Asegurarse de que el día y el mes tengan dos dígitos
              let diaString = dia < 10 ? '0' + dia : dia;
              let mesString = mes < 10 ? '0' + mes : mes;

              let fechaFormateada = `${diaString}/${mesString}/${año}`;

              return `${fechaFormateada}`;
            } else {
              return `${
                text ? text.split('T')[0].split('-').reverse().join('/') : ''
              }`;
            }
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
        },
        FOLIO_FICHA: {
          title: 'Folio',
          type: 'string',
          sort: false,
        },
        FEC_CALCULO_INTERESES: {
          title: 'Fecha Transferencia',
          // type: 'string',
          sort: false,
          // width: '13%',
          type: 'html',
          valuePrepareFunction: (text: string) => {
            console.log('text', text);
            if (typeof text === 'number') {
              let date = new Date((Number(text) - 25569) * 86400 * 1000);
              let fechaString = date.toString();

              let fecha = new Date(fechaString);

              let dia = fecha.getDate();
              let mes = fecha.getMonth() + 1; // Se suma 1 porque los meses se indexan desde 0
              let año = fecha.getFullYear();

              // Asegurarse de que el día y el mes tengan dos dígitos
              let diaString = dia < 10 ? '0' + dia : dia;
              let mesString = mes < 10 ? '0' + mes : mes;

              let fechaFormateada = `${diaString}/${mesString}/${año}`;

              return `${fechaFormateada}`;
            } else {
              return `${
                text ? text.split('T')[0].split('-').reverse().join('/') : ''
              }`;
            }
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
        },
        DI_MONEDA: {
          title: 'Moneda',
          type: 'string',
          sort: false,
          valuePrepareFunction: (_cell: any, row: any) => {
            return row.currency == "'M'" ? 'M' : row.currency;
          },
        },
        DEPOSITO: {
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
        di_expediente2: {
          title: 'Expediente',
          type: 'string',
          sort: false,
        },
        no_bien: {
          title: 'Bien',
          type: 'string',
          sort: false,
          // renderComponent: CustomdbclickComponent,
          // onComponentInitFunction: (instance: any) => {
          //   instance.funcionEjecutada.subscribe(() => {
          //     this.miFuncion();
          //   });
          // },
        },
      },
      rowClassFunction: (row: any) => {
        if (row.data.goodnumber != null) {
          return 'bg-warning text-black';
        } else {
          return '';
        }
      },
    };
    this.settings2.actions = false;
  }

  ngOnInit(): void {
    console.log(screen.width);
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
              motionnumber: () => (searchFilter = SearchFilter.EQ),
              bank: () => (searchFilter = SearchFilter.ILIKE),
              cveAccount: () => (searchFilter = SearchFilter.EQ),
              motionDate_: () => (searchFilter = SearchFilter.ILIKE),
              invoicefile: () => (searchFilter = SearchFilter.ILIKE),
              calculationInterestsDate_: () =>
                (searchFilter = SearchFilter.ILIKE),
              currency: () => (searchFilter = SearchFilter.ILIKE),
              deposit: () => (searchFilter = SearchFilter.EQ),
              proceedingsnumber: () => (searchFilter = SearchFilter.EQ),
              goodnumber: () => (searchFilter = SearchFilter.EQ),
              category: () => (searchFilter = SearchFilter.ILIKE),
              ispartialization: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${filter.search}`;
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;

              // console.log(
              //   'this.columnFilters[field]',
              //   this.columnFilters[field]
              // );
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

    this.paramsList2
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          // this.getPupPreviewDatosCsv2(this.cargarDataStorage(this.excelFile), 'no');
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {
        this.readExcel(this.excelFile, false);
        // this.getPupPreviewDatosCsv2(this.cargarDataStorage());
      });
  }
  ngOnChanges() {}
  getAccount() {
    this.loading = true;
    let params: any = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };

    console.log('params1', params);
    if (params['filter.motionDate_']) {
      var fecha = new Date(params['filter.motionDate_']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['motionDate'] = fechaFormateada;
      delete params['filter.motionDate_'];
    }
    if (params['filter.deposit']) {
      params['deposit'] = params['filter.deposit'];
      delete params['filter.deposit'];
    }
    if (params['filter.calculationInterestsDate_']) {
      var fecha = new Date(params['filter.calculationInterestsDate_']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['calculationInterestsDate'] = fechaFormateada;
      delete params['filter.calculationInterestsDate_'];
    }
    if (params['filter.goodnumber']) {
      params['goodNumber'] = params['filter.goodnumber'];
      delete params['filter.goodnumber'];
    }
    if (params['filter.proceedingsnumber']) {
      params['proceedingsNumber'] = params['filter.proceedingsnumber'];
      delete params['filter.proceedingsnumber'];
    }
    if (params['filter.category']) {
      params['category'] = params['filter.category'];
      delete params['filter.category'];
    }
    if (params['filter.ispartialization']) {
      params['ispartialization'] = params['filter.ispartialization'];
      delete params['filter.ispartialization'];
    }
    if (params['filter.currency']) {
      params['currencykey'] = params['filter.currency'];
      delete params['filter.currency'];
    }
    if (params['filter.bank']) {
      params['bankkey'] = params['filter.bank'];
      delete params['filter.bank'];
    }

    if (params['filter.cveAccount']) {
      params['accountkey'] = params['filter.cveAccount'];
      delete params['filter.cveAccount'];
    }

    if (params['filter.motionnumber']) {
      params['motionNumber'] = params['filter.motionnumber'];
      delete params['filter.motionnumber'];
    }

    params['&sortBy=motionNumber:DESC&'];
    console.log('params2', params);
    this.accountMovementService
      .getMovementAccountXBankAccount(params)
      .subscribe({
        next: async (response: any) => {
          let result = response.data.map(async (item: any) => {
            const detailsBank: any = await this.returnDataBank(
              item.accountnumber
            );

            if (detailsBank.cveCurrency == "'M'") {
              item['currency'] = 'M';
            } else {
              item['currency'] = detailsBank ? detailsBank.cveCurrency : null;
            }
            item['bank'] = detailsBank ? detailsBank.cveBank : null;
            item['cveAccount'] = detailsBank ? detailsBank.cveAccount : null;
            item['motionDate_'] = item.motiondate
              ? this.datePipe.transform(item.motiondate, 'dd/MM/yyyy')
              : null;
            item['calculationInterestsDate_'] = item.calculationinterestsdate
              ? this.datePipe.transform(
                  item.calculationinterestsdate,
                  'dd/MM/yyyy'
                )
              : null;
            item['bancoDetails'] = detailsBank ? detailsBank : null;
          });

          Promise.all(result).then((resp: any) => {
            this.showPagination = true;
            this.totalItems = response.count;
            this.data1.load(response.data);
            this.data1.refresh();
            console.log('AQUI', response);
            this.validExcel = false;
            this.loading = false;
          });
        },
        error: err => {
          this.loading = false;
          this.validExcel = false;
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
    if (event.data.goodnumber) {
      this.getDetailsGood(event.data.goodnumber);
    } else {
      this.form.get('descriptionGood').setValue('');
    }

    // DETALLES DE LA CUENTA
    if (event.data.bancoDetails) {
      await this.insertDataBank(event.data.bancoDetails);

      if (event.data.bancoDetails.cveCurrency) {
        await this.getTvalTable5(event.data.bancoDetails.cveCurrency);
      }
    } else {
      const aaaa: any = await this.returnDataBank(event.data.accountnumber);
      if (aaaa != null) {
        await this.insertDataBank(aaaa);
        await this.getTvalTable5(aaaa.cveCurrency);
      }
    }
  }

  async onCustomAction2(event: any) {
    this.dataMovements = event.data;
    console.log('data', event);
    // DESCRIPCIÓN DEL BIEN
    if (event.data.goodnumber) {
      this.getDetailsGood(event.data.goodnumber);
    } else {
      this.form.get('descriptionGood').setValue('');
    }

    // DETALLES DE LA CUENTA
    if (event.data.bancoDetails) {
      await this.insertDataBank(event.data.bancoDetails);

      if (event.data.bancoDetails.cveCurrency) {
        await this.getTvalTable5(event.data.bancoDetails.cveCurrency);
      }
    } else {
      const aaaa: any = await this.returnDataBank(event.data.accountnumber);
      if (aaaa != null) {
        await this.insertDataBank(aaaa);
        await this.getTvalTable5(aaaa.cveCurrency);
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
    if (!this.validExcel)
      if (this.dataMovements) {
        if (this.dataMovements.goodnumber == null) {
          this.alert(
            'warning',
            'No existe un bien asociado a este depósito.',
            ''
          );
        } else {
          let obj: any = {
            numberMotion: this.dataMovements.motionnumber,
            numberAccount: this.dataMovements.accountnumber,
            numberGood: null,
            numberProceedings: null,
          };
          this.accountMovementService.update(obj).subscribe({
            next: async (response: any) => {
              this.getAccount();
              this.alert(
                'success',
                `El bien ${this.dataMovements.goodnumber} ha sido desconciliado`,
                ''
              );
              this.form.get('descriptionGood').setValue('');
            },
            error: err => {
              this.alert('error', `Error al desconciliar`, err.error.message);
              // this.loading = false;
            },
          });
        }
      }
  }

  async actualizarFunc() {
    this.showPagination = true;
    this.paramsList.getValue().limit = 10;
    this.paramsList.getValue().page = 1;
    this.paramsList2.getValue().limit = 10;
    this.paramsList2.getValue().page = 1;
    this.data2.load([]);
    this.data2.refresh();
    this.excelFile = null;
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
    // const fileReader = new FileReader();
    // fileReader.readAsBinaryString(files[0]);
    // fileReader.onload = () => this.readExcel(fileReader.result);
    // fileReader.onload = () =>
    this.readExcel(files[0], true);
  }

  excelFile: any = null;
  async readExcel(binaryExcel: string | ArrayBuffer | any, filter: any) {
    try {
      this.excelFile = binaryExcel;
      const formData = new FormData();
      formData.append('file', binaryExcel);
      formData.append('user', this.token.decodeToken().preferred_username);
      formData.append('paginated', filter);
      const excelImport = await this.getPupPreviewDatosCsv2(formData, filter);
      if (filter == 'si') {
        // this.alert(
        //   'info',
        //   'Se ha cargado el archivo',
        //   'Espere mientras cargan los datos'
        // );
      }
      this.clearInput();
    } catch (error) {
      this.alert('warning', 'Ocurrio un error al leer el archivo', '');
      this.clearInput();
    }
  }

  async cargarDataStorage(data64: any) {
    if (this.excelFile == null) {
      // Decodifica el archivo Base64 a un array de bytes
      const byteCharacters = atob(data64);

      // Crea un array de bytes utilizando el tamaño del archivo decodificado
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Crea un Uint8Array a partir del array de bytes
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: 'text/csv' });
      // this.readExcel(blob);
      this.excelFile = blob;
    }
    // return '';
  }

  async getPupPreviewDatosCsv2(formData: any, filter: any) {
    console.log('formData', formData);
    this.loading = true;
    let params: any = {
      ...this.paramsList2.getValue(),
      ...this.columnFilters,
    };
    console.log('params2', params);
    this.msMassiveAccountmvmntlineService
      .getPupPreviewDatosCsv2(formData, params)
      .subscribe({
        next: (response: any) => {
          // console.log("response", response)
          const data = response;
          this.validExcel = true;

          let result = data.result.map(async (item: any) => {
            // let obj1 = {
            //   TI_BANCO: item.bank,
            //   DI_CUENTA: item.accountkey,
            //   NO_CUENTA: item.accountnumber,
            //   DI_MONEDA: item.currency,
            //   FEC_MOVIMIENTO: item.motiondate,
            //   FOLIO_FICHA: item.isfiledeposit,
            //   FEC_CALCULO_INTERESES: item.calculationinterestsdate,
            //   DEPOSITO: item.deposit,
            //   no_bien: item.goodnumber,
            //   di_expediente2: item.proceedingsnumber
            // }

            item['accountnumber'] = item.NO_CUENTA ? item.NO_CUENTA : null;
            const detailsBank: any = await this.returnDataBank(
              item.accountnumber
            );
            if (detailsBank.cveCurrency == "'M'") {
              item['currency'] = 'M';
            } else {
              item['currency'] = detailsBank ? detailsBank.cveCurrency : null;
            }

            item['bank'] = detailsBank ? detailsBank.cveBank : null;
            item['cveAccount'] = detailsBank ? detailsBank.cveAccount : null;

            item['bancoDetails'] = detailsBank ? detailsBank : null;
          });

          Promise.all(result).then((resp: any) => {
            this.cleanDataBank();
            this.showPagination = true;
            this.totalItems2 = response.count;
            this.cargarDataStorage(response.base64.base64File);
            // this.excelFile =

            let str = response.msg;
            console.log('substr1', str);
            let substr = str[0].slice(0, Number(str.length) - 7);
            console.log('substr', substr);
            if (filter == true) {
              this.alert('success', substr, '');
            }
            this.data2.load(response.result);
            this.data2.refresh();
            console.log('AQUI', response);
            this.loading = false;
          });
        },
        error: err => {
          // this.data2.load([]);
          // this.data2.refresh();
          this.totalItems2 = 0;
          this.validExcel = false;
          this.loading = false;
          if (err.error.message == 'No es el excel correcto') {
            this.alert(
              'error',
              'El archivo no cumple con las condiciones de inserción',
              ''
            );
          } else {
            this.alert(
              'error',
              'Ha ocurrido un error al intentar cargar el archivo',
              err.error.message
            );
          }
        },
      });
  }

  async exportar() {
    const filename: string = 'Deposit Tokens';
    const jsonToCsv: any = await this.returnJsonToCsv();

    let arr: any = [];
    let result = jsonToCsv.map(async (item: any) => {
      if (!this.validExcel) {
        let obj1 = {
          TI_BANCO: item.bank,
          DI_CUENTA: item.accountkey,
          NO_CUENTA: item.accountnumber,
          DI_MONEDA: item.currency,
          FEC_MOVIMIENTO: item.motiondate,
          FOLIO_FICHA: item.isfiledeposit,
          FEC_CALCULO_INTERESES: item.calculationinterestsdate,
          DEPOSITO: item.deposit,
          no_bien: item.goodnumber,
          di_expediente2: item.proceedingsnumber,
        };
        arr.push(obj1);
      } else {
        let obj2 = {
          TI_BANCO: item.TI_BANCO,
          DI_CUENTA: item.DI_CUENTA,
          NO_CUENTA: item.NO_CUENTA,
          DI_MONEDA: item.DI_MONEDA,
          FEC_MOVIMIENTO: item.FEC_MOVIMIENTO,
          FOLIO_FICHA: item.FOLIO_FICHA,
          FEC_CALCULO_INTERESES: item.FEC_CALCULO_INTERESES,
          DEPOSITO: item.DEPOSITO,
          no_bien: item.no_bien,
          di_expediente2: item.di_expediente2,
        };

        arr.push(obj2);
      }
      // let obj2 = {
      //   motionnumber: item.motionnumber,
      //   motiondate: item.motiondate,
      //   deposit: item.deposit,
      //   userinsert: item.userinsert,
      //   insertiondate: item.insertiondate,
      //   isfiledeposit: item.isfiledeposit,
      //   accountnumber: item.accountnumber,
      //   calculationInterestsDate_: item.calculationinterestsdate,
      //   calculationinterestsdate: item.calculationinterestsdate,
      //   registernumber: item.registernumber,
      //   category: item.category,
      //   currency: item.currency,
      //   goodnumber: item.goodnumber,
      //   proceedingsnumber: item.proceedingsnumber,
      //   bank: item.bank,
      //   cveAccount: item.accountkey,
      //   accountkey: item.accountkey,
      //   motionDate_: item.motiondate,
      //   transferdate: item.transferdate,
      // };
    });

    Promise.all(result).then(i => {
      console.log('jsonToCsv', arr);
      this.jsonToCsv = arr;
      this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
    });
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
        // this.loading = false;
      },
      error: err => {
        console.log(err);
        this.form.get('description').setValue('');
        // this.loading = false;
      },
    });
  }

  getDetailsGood(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.goodServices.getGoodById(id).subscribe({
      next: async (response: any) => {
        this.form.get('descriptionGood').setValue(response.description);
      },
      error: err => {
        this.form
          .get('descriptionGood')
          .setValue('No se encontró la descripción del bien');
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
      callback: (next: boolean) => {},
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

    if (data.goodnumber != null) {
      this.alert(
        'warning',
        'No puede eliminar un movimiento que ya está asociado a un expediente-bien',
        ''
      );
    } else {
      // VERIFICAR CHEQUES
      const val: any = await this.getChecksReturn(data.motionnumber);
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
              numberAccount: Number(data.accountnumber),
              numberMotion: Number(data.motionnumber),
            };
            this.accountMovementService.eliminarMovementAccount(obj).subscribe({
              next: response => {
                this.getAccount();
                this.form.reset();
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

  async showDeleteAlert2(data: any) {
    console.log(data);
    let vb_hay_hijos: boolean = false;

    if (data.goodnumber != null) {
      this.alert(
        'warning',
        'No puede eliminar un movimiento que ya está asociado a un expediente-bien',
        ''
      );
    } else {
      // VERIFICAR CHEQUES
      const val: any = await this.getChecksReturn(data.motionnumber);
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
              numberAccount: Number(data.accountnumber),
              numberMotion: Number(data.motionnumber),
            };
            this.accountMovementService.eliminarMovementAccount(obj).subscribe({
              next: response => {
                this.getAccount();
                this.form.reset();
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
        no_cuenta: this.dataMovements.accountnumber,
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

  clearInput() {
    this.myInput.nativeElement.value = '';
  }
}
