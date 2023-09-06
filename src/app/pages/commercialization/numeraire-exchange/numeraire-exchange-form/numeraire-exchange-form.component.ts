import { animate, style, transition, trigger } from '@angular/animations';
import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  take,
} from 'rxjs';
import { HasMoreResultsComponent } from 'src/app/@standalone/has-more-results/has-more-results.component';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import {
  generateUrlOrPath,
  getUser,
  readFile,
} from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IPupValidMassive } from 'src/app/core/models/ms-massivegood/massive-good-goods-tracker.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsGenerateDialogComponent } from '../components/goods-generate-dialog/goods-generate-dialog.component';
import { TableExpensesComponent } from '../components/table-expenses/table-expenses.component';
import { NUMERAIRE_COLUMNS } from './numeraire-exchange-columns';

interface IFormNumeraire {
  screenKey: FormControl<string>;
  spentPlus: FormControl<string>;
  description: FormControl<string>;
  amountevta: FormControl<string>;
  typeConv: FormControl<string>;
  spentId: FormControl<string>;
  // totalAmount: FormControl<number>;
  status: FormControl<string>;
  identificator: FormControl<string>;
  processExt: FormControl<string>;
  ivavta: FormControl<string>;
  commission: FormControl<string>;
  ivacom: FormControl<string>;
  goodId: FormControl<string>;
  delegationNumber: FormControl<string>;
  subDelegationNumber: FormControl<string>;
  flier: FormControl<string>;
  fileNumber: FormControl<string>;
  user: FormControl<string>;
  bankNew: FormControl<string>;
  moneyNew: FormControl<string>;
  accountNew: FormControl<string>;
  comment: FormControl<string>;
  expAssociated: FormControl<string>;
  dateNew: FormControl<string>;

  invoiceFile: FormControl<string>;
  deposit: FormControl<string>;
  ivavtaPercent: FormControl<string>;
  commissionPercent: FormControl<string>;
  commissionTaxPercent: FormControl<string>;
}
@Component({
  selector: 'app-numeraire-exchange-form',
  templateUrl: './numeraire-exchange-form.component.html',
  styles: [],
  providers: [CurrencyPipe],
  animations: [
    trigger('OnGoodSelected', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class NumeraireExchangeFormComponent extends BasePage implements OnInit {
  @ViewChild(TableExpensesComponent) tableExpense: TableExpensesComponent;
  form: FormGroup = new FormGroup<IFormNumeraire>({
    screenKey: new FormControl('FACTADBCAMBIONUME', [Validators.required]),
    amountevta: new FormControl(null, [Validators.required]),
    typeConv: new FormControl(null, [Validators.required]),
    status: new FormControl(null, [Validators.required]),
    identificator: new FormControl(null, [Validators.required]),
    ivavta: new FormControl(null, [Validators.required]),
    commission: new FormControl(null, [Validators.required]),
    ivacom: new FormControl(null, [Validators.required]),
    goodId: new FormControl(null, [Validators.required]),
    user: new FormControl(getUser(), [Validators.required]),
    bankNew: new FormControl(null, [Validators.required]),
    moneyNew: new FormControl(null, [Validators.required]),
    accountNew: new FormControl(null, [Validators.required]),
    dateNew: new FormControl(null, [Validators.required]),
    spentId: new FormControl(null, [Validators.required]), //TODO: por asignar
    spentPlus: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    // totalAmount: new FormControl(0, [Validators.required]),
    processExt: new FormControl(null, [Validators.required]),
    delegationNumber: new FormControl(null, [Validators.required]),
    subDelegationNumber: new FormControl(null, [Validators.required]),
    flier: new FormControl(null, [Validators.required]),
    fileNumber: new FormControl(null, [Validators.required]),
    comment: new FormControl(null, [Validators.required]),
    expAssociated: new FormControl(null, [Validators.required]),

    invoiceFile: new FormControl(null, [Validators.required]),
    deposit: new FormControl(null, [Validators.required]),
    ivavtaPercent: new FormControl(null, [Validators.required]),
    commissionPercent: new FormControl(null, [Validators.required]),
    commissionTaxPercent: new FormControl(null, [Validators.required]),
  });

  formGood = new FormGroup({
    /** @description no_bien */
    id: new FormControl(null, [Validators.required]),
    /** @description val6 */
    val6: new FormControl(null),
    /** @description val5 */
    val5: new FormControl(null),
    /** @description valor_avaluo */
    appraisedValue: new FormControl(null),
    /** @description val4 */
    val4: new FormControl(null),
    /** @description val3 */
    val3: new FormControl(null),
    /** @description val2 */
    val2: new FormControl(null),
    /** @description val1 */
    val1: new FormControl(null),
    /** @description motivo_cambio_numerario */
    causeNumberChange: new FormControl(null),
    /** @description SOLICITO_CAMBIO_NUMERARIO */
    changeRequestNumber: new FormControl(null),
    /** @description FEC_RATIFICA_CAMBIO_NUMERARIO */
    numberChangeRatifiesDate: new FormControl(null),
    /** @description USUARIO_RATIFICA_CAMBIO_NUMERA */
    numberChangeRatifiesUser: new FormControl(null),
    /** @description ESTATUS */
    status: new FormControl(null),
    /** @description IDENTIFICADOR */
    identifier: new FormControl(null),
    /** @description DESCRIPCION */
    description: new FormControl(null),
    /** @description NO_EXPEDIENTE */
    fileNumber: new FormControl(null),
    /** @description NO_EXP_ASOCIADO */
    associatedFileNumber: new FormControl(null),
    /** @description CANTIDAD */
    quantity: new FormControl(null),
    /** @description NO_REGISTRO */
    registryNumber: new FormControl(null),
    /** @description NO_DELEGACION */
    delegationNumber: new FormControl(null),
    /** @description NO_SUBDELEGACION */
    subDelegationNumber: new FormControl(null),
    /** @description NO_ETIQUETA */
    labelNumber: new FormControl(null),
    /** @description no_volante */
    flyerNumber: new FormControl(null),
    /** @description PROCESO_EXT_DOM */
    extDomProcess: new FormControl(null),
    /** @description IMPORTEVTA */
    importSell: new FormControl(null),
    /** @description PORC1 */
    percent1: new FormControl(null),
    /** @description IVAVTA */
    taxSell: new FormControl(null),
    /** @description PORC2 */
    percent2: new FormControl(null),
    /** @description COMISION */
    commission: new FormControl(null),
    /** @description PORC3 */
    percent3: new FormControl(null),
    /** @description IVACOM */
    taxCommission: new FormControl(null),
    /** @description DI_ESTATUS_BIEN */
    diStatusGood: new FormControl(null),
    /** @description MONEDA_A */
    currency_to: new FormControl(null),
    /** @description MONEDA_DE */
  });

  formBlkControl = new FormGroup({
    /** @description TIPO_CONV */
    typeConversion: new FormControl(null),
    /** @description CHK_MOVBAN */
    checkMovementBank: new FormControl(null),
    /** @description COMENTARIO */
    comment: new FormControl(null),
    /** @description MASIVO */
    checkMassive: new FormControl(null),
    /** @description TI_BANCO_NEW */
    tiNewBank: new FormControl(null),
    /** @descripiton DI_MONEDA_NEW */
    diNewCurrency: new FormControl(null),
    /** @description DI_DEPOSITO */
    diDeposit: new FormControl(null),
    /** @description TI_FECHA_NEW */
    tiNewDate: new FormControl(null),
    /** @description TI_FICHA_NEW */
    tiNewFile: new FormControl(null),
    /** @description DI_CUENTA_NEW */
    diNewAccount: new FormControl(null),
    /** @description DI_BANCO_NEW */
    diNewBank: new FormControl(null),
    /** @description DI_FOLIO_NEW */
    diNewFile: new FormControl(null),
    /** @description DI_CATEGORIA */
    diCategory: new FormControl(null),
    /** @description DI_NO_CUENTA_DEPOSITO */
    diNumberAccountDeposit: new FormControl(null),
    /** @description DI_NO_MOVIMIENTO */
    diNumberMovement: new FormControl(null),
  });

  fileForm: FormGroup = new FormGroup({
    file: new FormArray([], [Validators.required]),
  });
  toggleExpenses: boolean = true;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedGood: IGood = null;
  selectedBank: any = null;
  numeraireSettings = {
    columns: NUMERAIRE_COLUMNS,
    selectedRowIndex: -1,
    actions: false,
    editable: false,
  };

  dataTableMassive: IPupValidMassive[] = [];
  fileName: string = 'Seleccionar archivo';

  // formHelpivavtaPercent = new FormControl(null);
  // formHelpcommissionPercent = new FormControl(null);
  // formHelpcommissionTaxPercent = new FormControl(null);

  pathGoods = generateUrlOrPath(GoodEndpoints.Good, GoodEndpoints.Good, true);

  conversionTypes = new DefaultSelect<any>();

  readonly NAME_CURRENT_FORM = 'FACTADBCAMBIONUME';
  validNumerary: 'loading' | 'error' | 'valid' | 'notValid' = 'loading';
  infoToken: TokenInfoModel;

  constructor(
    private excelService: ExcelService,
    private numeraryService: NumeraryService,
    private statusScreenService: ScreenStatusService,
    private goodService: GoodService,
    private authService: AuthService,
    private massiveGoodService: MassiveGoodService,
    private goodProcessService: GoodProcessService,
    private modalService: BsModalService,
    private accountMovementService: AccountMovementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.infoToken = this.authService.decodeToken();
    this.conversionTypes = new DefaultSelect([
      {
        value: 'CBD',
        text: 'Bien decomisado cambiado a numerario por enajenación',
      },
      {
        text: 'Bien decomisado cambiado a numerario por siniestro',
        value: 'CDS',
      },
      {
        text: 'Bien asegurado cambiado a numerario por enajenación.',
        value: 'CNE1',
      },
      {
        text: 'Bien asegurado cambiado a numerario por siniestro.',
        value: 'CNS',
      },
      {
        text: 'Bien generado por pago parcial por siniestro',
        value: 'BBB',
      },
    ]);
    this.formGood.get('importSell').valueChanges.subscribe({
      next: value => {
        // const valueSell = value || 0;
        // const valueCommission = this.formGood.get('commission').value || 0;
        console.log('value1', this.formGood.value.importSell, { value });
        const taxSell =
          (value || 0) * ((this.formGood.value?.percent1 || 0) / 100);
        this.formGood.get('taxSell').setValue(taxSell);

        const commission =
          (value || 0) * ((this.formGood.value?.percent2 || 0) / 100);
        this.formGood.get('commission').setValue(commission);
      },
    });

    this.formGood.get('percent1').valueChanges.subscribe({
      next: value => {
        const taxSell =
          (this.formGood.value.importSell || 0) * ((value || 0) / 100);
        this.formGood.get('taxSell').setValue(taxSell);
      },
    });

    this.formGood.get('percent2').valueChanges.subscribe({
      next: value => {
        const commission =
          (this.formGood.value.importSell || 0) * ((value || 0) / 100);
        this.formGood.get('commission').setValue(commission);
      },
    });

    this.formGood.get('commission').valueChanges.subscribe({
      next: value => {
        const commission =
          ((+value || 0) * (+this.formGood.value?.percent3 || 0)) / 100;
        this.formGood.get('taxCommission').setValue(commission);
      },
    });

    this.formGood.get('percent3').valueChanges.subscribe({
      next: value => {
        const commission =
          ((+this.formGood.value.commission || 0) * (+value || 0)) / 100;
        this.formGood.get('taxCommission').setValue(commission);
      },
    });
  }

  isCleaning = false;
  clear() {
    this.isCleaning = true;
    this.formGood.reset();
    this.formBlkControl.reset();
    this.dataTableMassive = [];
    this.form.reset();
    this.tableExpense.clearTable();
  }

  isLoadingGood: boolean = false;
  searchGood() {
    const goodId = this.formGood.get('id').value;
    if (!goodId) {
      this.alert('warning', 'Debe Ingresar un Identificador de Bien', '');
      // showToast({
      //   icon: 'warning',
      //   text: 'Debe Ingresar un Identificador de Bien',
      // });
      return;
    }
    const params = new ListParams();
    params['filter.id'] = goodId;
    this.formGood.reset();
    params.limit = 1;
    params.page = 1;
    this.isLoadingGood = true;
    this.goodService.getAll(params).subscribe({
      next: response => {
        this.isLoadingGood = false;
        this.formGood.patchValue(response.data[0]);
        console.log(response.data[0]);
        this.validateGood(this.formGood.value.id);
      },
      error: () => {
        this.isLoadingGood = false;
        this.onLoadToast('warning', 'No se Encontró el Bien', '');
      },
    });
  }

  generateParamsSearchDate() {
    const dateMotion = this.formBlkControl.value.tiNewDate;
    console.log({ dateMotion });
    return {
      'filter.dateMotion': formatDate(dateMotion, 'yyyy-MM-dd', 'en-US'),
      'filter.isFileDeposit': 'S',
      'filter.numberGood': '$null',
      'filter.numberAccount': this.formBlkControl.value.diNumberAccountDeposit,
    };
  }

  async hasPermissionWrite() {
    const body = {
      user: this.infoToken.preferred_username.toUpperCase(),
      screen: this.NAME_CURRENT_FORM,
    };
    return await firstValueFrom(
      this.statusScreenService.postPermissionByScreenAndUser(body).pipe(
        map(res => {
          if (res.write == 'S') {
            return true;
          } else {
            return false;
          }
        }),
        catchError(err => {
          return of(false);
        })
      )
    );
  }

  getInfoDeposit() {
    const deposit = this.formBlkControl.value.tiNewDate;
    if (this.isCleaning) {
      this.isCleaning = false;
      return;
    }
    this.changeDeposit(null);
    const params = new ListParams();
    params['filter.dateMotion'] = formatDate(deposit, 'yyyy-MM-dd', 'en-US');
    params['filter.isFileDeposit'] = 'S';
    params['filter.numberGood'] = '$null';
    params['filter.numberAccount'] =
      this.formBlkControl.value.diNumberAccountDeposit;
    params.limit = 1;
    console.log({ params });
    this.accountMovementService.getAccountMovements(params).subscribe({
      next: res => {
        if (res.count > 1) {
          this.openMoreOneResults(res);
        } else {
          this.changeDeposit(res.data[0]);
          this.onLoadToast('success', 'Depósito Encontrado', '');
        }
      },
      error: () => {
        // this.formBlkControl.get('tiNewDate').setValue(null);
        this.onLoadToast(
          'warning',
          'No se Encontró el Depósito en la Fecha Seleccionada',
          ''
        );
      },
    });
  }

  openMoreOneResults(data?: IListResponse<any>) {
    let context: Partial<HasMoreResultsComponent> = {
      queryParams: this.generateParamsSearchDate(),
      columns: {
        numberMotion: {
          title: 'Número de Movimiento',
        },
        deposit: {
          title: 'Depósito',
        },
        dateMotion: {
          title: 'Fecha de Movimiento',
        },
        InvoiceFile: {
          title: 'Folio ficha',
        },
        category: {
          title: 'Categoría',
          valuePrepareFunction: (cell: any, _row: any) => {
            return cell?.category;
          },
        },
      },
      totalItems: data ? data.count : 0,
      ms: 'accountmvmnt',
      path: 'account-movements',
    };

    console.log({ context });

    const modalRef = this.modalService.show(HasMoreResultsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onClose.pipe(take(1)).subscribe(result => {
      console.log({ result });
      if (result) {
        this.changeDeposit(result);
        // console.log({ result });
        // this.loadValuesDictation(result);
      }
    });
  }

  getDataForTableExpenses(): { spentId: any[]; spentImport: any[] } {
    const expense = this.tableExpense.getExpense();
    let convertExpense: { spentId: any[]; spentImport: any[] } = {
      spentId: [],
      spentImport: [],
    };
    expense.forEach(element => {
      convertExpense.spentId.push(element.id);
      convertExpense.spentImport.push(element.import);
    });
    return convertExpense;
  }

  async validateGood(good: number) {
    /*
    !data.goodArray &&
     !data.action &&
      data.flag != 2 && 
      data.flag != 1 && 
      !data.count && 
      !data.process && 
      !data.status && 
      data.whereIn && 
      !data.goodClassification && 
      !data.exist && 
      data.good && 
      data.screen 
    */

    /*
      !data.goodArray && 
      !data.action && 
      data.flag != 2 && 
      data.flag != 1 && 
      data.count && 
      !data.process && 
      !data.status &&
      data.whereIn && 
      !data.goodClassification && 
      !data.exist && 
      data.good && 
      data.screen ? `where bie.estatus = est.estatus and 
      unaccent(LOWER(est.cve_pantalla))  = '${data.screen.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}' and 
      bie.no_bien  = ${data.good} and 
      bie.PROCESO_EXT_DOM = est.PROCESO_EXT_DOM and 
      bie.no_clasif_bien not in (SELECT NO_CLASIF_BIEN FROM SERA.CAT_SSSUBTIPO_BIEN WHERE NO_TIPO = 7 AND NO_SUBTIPO = 1)` : ''}
      */
    // const validate1 = this.statusScreenService
    //   .getStatus({
    //     whereIn: true,
    //     screen: this.NAME_CURRENT_FORM,
    //     count: false,
    //     good,
    //   })
    //   .pipe(
    //     map((res: any) => {
    //       if (res.data && Array.isArray(res.data) && res.data.length > 0) {
    //         try {
    //           return { isAvailable: Boolean(parseInt(res.data[0].count)) };
    //         } catch (error) {
    //           return { isAvailable: false };
    //         }
    //       }
    //       return { isAvailable: false };
    //     }),
    //     catchError(() => {
    //       return of({ isAvailable: false });
    //     })
    //   );
    const body = {
      pVcScreem: this.NAME_CURRENT_FORM,
      goodNumber: good as any,
      proccesExtDom: this.formGood.value.extDomProcess,
    };

    const availableGood: any = await firstValueFrom(
      this.goodProcessService.postExistsGoodxStatus(body).pipe(
        map(res => (res.data.length > 0 ? true : false)),
        catchError(() => of(false))
      )
    );
    const validateNumerary = await this.pupValidNumerary();
    if (
      (validateNumerary && availableGood) ||
      (validateNumerary && !availableGood)
    ) {
      this.onLoadToast(
        'info',
        'Información',
        'El Bien Consultado También Puede ser Convertido a Numerario por Valores y Divisas. \n Verifique su Tipo de Conversión antes de Continuar con el Proceso'
      );
    }
    if (!validateNumerary && !availableGood) {
      this.onLoadToast(
        'warning',
        'Advertencia',
        'Estatus, Identificador o Clasificador Inválido para Cambio a Numerario/Valores y Divisas'
      );
    }
  }

  getFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1)
      throw 'No seleccionó ningún archivo o seleccionó más de la cantidad permitida (1)';

    readFile(files[0], 'BinaryString').then(data => {
      this.readCsv(data.result, files[0]);
    });
  }

  validateHeaderTableMassive(data: { [key: string]: any }) {
    const itemHeader = {
      COMENTARIO: 'Ejemplo de Conversion a numerario',
      COMISION: 222,
      IMPORTE: 3472.08,
      IVACOM: 35.52,
      IVAVTA: 710.4,
      NO_BIEN: 163719,
      PRECIO_VENTA: 4440,
    };
    const keys = Object.keys(itemHeader);
    const keysData = Object.keys(data);
    let messages: string[] = [];
    keys.forEach(key => {
      if (!keysData.includes(key)) {
        messages.push(key);
      }
    });
    if (messages.length > 0) {
      this.alert(
        'warning',
        'El Archivo es inválido',
        // `El Archivo no Contiene las Columnas ${messages.join(', ')}`
        ''
      );
      return false;
    }
    return true;
  }

  readCsv(binaryExcel: string | ArrayBuffer, file: File) {
    try {
      this.loading = true;
      const dataCvs = this.excelService.getData(binaryExcel);
      console.log(dataCvs);
      if (!this.validateHeaderTableMassive(dataCvs[0])) {
        this.loading = false;
        this.dataTableMassive = [];
        this.totalItems = 0;
        return;
      }
      // this.sourcesMassive.load(dataCvs);
      // console.log(dataCvs);
      // this.totalItems = dataCvs.length;
      // this.loading = false;
      this.pupLoadCsv(file);
    } catch (error) {
      this.loading = false;
      this.alert('error', 'Ocurrió un Error al Leer el Archivo', '');
      // showToast({ icon: 'error', text: '' });
    }
  }

  validateCvs(data: any[]): Promise<any> {
    const goodKey = 'goodId';
    const goodIds = data.map((item: any) => item[goodKey]);
    return new Promise((resolve, reject) => {
      this.numeraryService
        .validateCvs({
          goodIds,
          vcScreen: this.form.get('FACTADBCAMBIONUME').value,
        })
        .subscribe({
          next: (res: any) => {
            return resolve('error');
          },
          error: (error: any) => {
            return reject(error);
          },
        });
    });
  }

  async pupValidNumerary() {
    const body = {
      whereIn: true,
      good: this.formGood.value.id,
      count: false,
      screen: this.NAME_CURRENT_FORM,
    };
    const numeraryAvailable = await firstValueFrom(
      this.statusScreenService.getStatus(body).pipe(
        map(res => (res.data.length > 0 ? true : false)),
        catchError(() => of(false))
      )
    );
    return numeraryAvailable;
  }

  selectAccount(
    account: {
      cve_banco: string;
      nombre: string;
      no_cuenta: string;
      cve_moneda: string;
      cve_cuenta: string;
    } | null
  ) {
    this.selectedBank = account;
    this.formBlkControl.get('tiNewBank').setValue(account?.cve_banco);
    this.formBlkControl.get('diNewBank').setValue(account?.nombre);
    this.formBlkControl
      .get('diNumberAccountDeposit')
      .setValue(account?.no_cuenta);
    this.formBlkControl.get('diNewAccount').setValue(account?.cve_cuenta);
    this.formBlkControl.get('diNewCurrency').setValue(account?.cve_moneda);
    this.clearDateDeposit();
    // account = account || {};
    // this.selectedBank = account;
    // this.form.get('moneyNew').setValue(account?.cveCurrency || null);
    // this.form.get('accountNew').setValue(account?.cveAccount || null);
    // this.form.get('bankNew').setValue(account?.cveBank || null);
  }

  clearDateDeposit() {
    this.isCleaning = true;
    this.formBlkControl.get('tiNewDate').setValue(null);
    this.formBlkControl.get('diNewFile').setValue(null);
    this.formBlkControl.get('diDeposit').setValue(null);
  }

  async saveInServer(): Promise<void> {
    console.log(this.formBlkControl.value);
    this.loader.load = true;
    const permissionWrite = await this.hasPermissionWrite();
    if (!permissionWrite) {
      this.alert(
        'warning',
        'Advertencia',
        'No Tiene Permiso de Escritura para Ejecutar el Cambio de Numerario'
      );
      this.loader.load = false;
      return;
    }
    if (!this.formGood.value.id && !this.isMassive) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe Especificar el Bien que se quiere Cambiar a Numerario'
      );
      this.loader.load = false;
      return;
    } else if (this.dataTableMassive.length < 1 && this.isMassive) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe Cargar los Bienes que Desea Cambiar a Numerario'
      );
      this.loader.load = false;
      return;
    } else if (!this.formGood.value.id && this.dataTableMassive.length < 1) {
      this.alert(
        'warning',
        'Advertencia',
        'No hay Bienes para Cambiar a Numerario'
      );
      this.loader.load = false;
      return;
    }

    if (this.formBlkControl.value.checkMovementBank) {
      if (!this.formBlkControl.value.tiNewBank) {
        this.alert('warning', 'Advertencia', 'Debe Especificar el Banco');
        this.loader.load = false;
        return;
      }
      if (!this.formBlkControl.value.tiNewDate) {
        this.alert(
          'warning',
          'Advertencia',
          'Debe Especificar la Fecha del Deposito'
        );
        this.loader.load = false;
        return;
      }
      if (!this.formBlkControl.value.diNumberMovement) {
        this.alert(
          'warning',
          'Advertencia',
          'No ha Seleccionado Debidamente del Deposito que Ampara el Cambio a Numerario'
        );
        this.loader.load = false;
        return;
      }
    }

    if (!this.formBlkControl.value.typeConversion) {
      this.alert(
        'warning',
        'Advertencia',
        'No ha Seleccionado el Tipo de Conversión'
      );
      this.loader.load = false;
      return;
    }
    if (this.isMassive) {
      this.loader.load = false;
      const questionResponse3 = await this.alertQuestion(
        'question',
        'Advertencia',
        '¿Seguro que Desea Cambiar los Bienes a Numerario?'
      );
      if (questionResponse3.isConfirmed) {
        await this.pupValidateMassive();
      }
    } else {
      const validNumerary = await this.pupValidNumerary();
      if (!this.formBlkControl.value.diNewCurrency && validNumerary) {
        this.alert(
          'warning',
          'Advertencia',
          'Debe Especificar el Tipo de Moneda'
        );
        this.loader.load = false;
        return;
      }
      if (
        (validNumerary &&
          !['CNE', 'BBB'].includes(this.formBlkControl.value.typeConversion)) ||
        (!validNumerary && this.formBlkControl.value.typeConversion == 'CNE')
      ) {
        this.alert(
          'warning',
          'Advertencia',
          'El Tipo de Conversión Seleccionado no es Permitido para este Bien.'
        );
        this.loader.load = false;
        return;
      }

      if (!this.formGood.value.importSell) {
        this.loader.load = false;
        const questionResponse1 = await this.alertQuestion(
          'question',
          'Advertencia',
          'El nuevo Bien se Generara con un Precio de Venta de 1. ¿Desea Continuar?'
        );
        if (!questionResponse1.isConfirmed) {
          return;
        }
        this.loader.load = false;
        const questionResponse2 = await this.alertQuestion(
          'question',
          'Advertencia',
          '¿Seguro que Desea Cambiar el Bien a Numerario?'
        );

        if (questionResponse2.isConfirmed) {
          await this.pupCreateGood();
        }
      } else {
        this.loader.load = false;
        const questionResponse = await this.alertQuestion(
          'question',
          'Advertencia',
          '¿Seguro que desea Cambiar el Bien a Numerario?'
        );

        if (questionResponse.isConfirmed) {
          await this.pupCreateGood();
        }
      }
    }
  }

  async pupCreateGood(): Promise<any> {
    const spent = this.getDataForTableExpenses();

    const body: any = {
      screenKey: this.NAME_CURRENT_FORM,
      // clasifGoodNumber: null,
      // spentPlus: null,
      // amounten: null,
      description: this.form.value.description,
      amountevta: this.formGood.value.importSell || 1,
      typeConv: this.formBlkControl.value.typeConversion,
      spentId: spent?.spentId || [],
      amount: spent?.spentImport || [],
      spentPlus: 0,
      // totalAmount: null,
      status: this.formGood.value.status,
      identificator: this.formGood.value.identifier,
      processExt: this.formGood.value.extDomProcess,
      ivavta: this.formGood.value.taxSell || 0,
      commission: this.formGood.value.commission || 0,
      ivacom: this.formGood.value.taxCommission || 0,
      goodId: this.formGood.value.id,
      delegationNumber: this.formGood.value.delegationNumber.id,
      subDelegationNumber: this.formGood.value.subDelegationNumber.id,
      fileNumber: this.formGood.value.fileNumber,
      user: this.infoToken.preferred_username.toUpperCase(),
      bankNew: this.formBlkControl.value.tiNewBank,
      moneyNew: this.formBlkControl.value.diNewCurrency?.replaceAll("'", ''),
      accountNew: this.formBlkControl.value.diNewAccount,
      comment: this.formBlkControl.value.comment,
      expAssociated: this.formGood.value.associatedFileNumber,
      dateNew: this.formBlkControl.value.tiNewDate,
      token: this.formBlkControl.value.tiNewFile,
    };
    await firstValueFrom(
      this.goodService.changeGoodToNumerary(body).pipe(
        map((resp: { message: []; data: null }) => {
          const message =
            // resp.message.length > 0
            //   ? resp.message.join('.\n')
            //   :
            'Proceso Terminado correctamente';

          this.alert('success', message, '');
          this.clear();
          this.loader.load = false;
        }),
        catchError(err => {
          this.loader.load = false;
          console.log('error', err);
          const message = err.error.message;
          this.alert(
            'warning',
            'Atención',
            'El  No. Bien introducido es inválido'
          );
          throw err;
        })
      )
    );
  }

  pupLoadCsv(file: File): void {
    this.loading = true;
    this.massiveGoodService
      .postPupCargaCsv(file, 'FACTADBCAMBIONUME')
      .subscribe({
        next: res => {
          console.log('res', res);
          this.dataTableMassive = res.bienes;
          this.loading = false;
          if (res.errores.length > 0) {
            this.alert('warning', 'Advertencias', res.errores.join('\n'));
          }
        },
        error: err => {
          console.log('err', err);
          this.loading = false;
        },
      });
  }

  isLoadingMassive: boolean = false;
  // async saveInServerMassive(): Promise<void> {
  //   try {
  //     await this.pupValidateMassive();
  //   } catch (error) {
  //     this.alert('error', 'Error', 'Ocurrió un error al validar el masivo');
  //   }
  // }
  pGoodTrans = 0;
  getTransGood(): string | number {
    return this.pGoodTrans;
  }

  selectedTab(e: any) {
    console.log(e);
  }

  isMassive = false;

  // pupCreateGoodMassive() {
  //   const body = {
  //     goods: this.dataTableMassive.map(item => {
  //       return {
  //         status: item.estatus,
  //         comment: item.comentario,
  //         salePrice: item.precio_venta,
  //         identificador: item.identificador,
  //         description: item.descripcion,
  //         amount: item.importe,
  //         ivavta: item.ivavta,
  //         goodNumber: item.no_bien,
  //         ivacom: item.ivacom,
  //         commission: item.comision,
  //         user: this.infoToken.preferred_username.toUpperCase(),
  //       };
  //     }),
  //     token: this.formBlkControl.value.tiNewFile,
  //     dateNew: this.formBlkControl.value.tiNewDate,
  //     moneyNew: this.formBlkControl.value.diNewCurrency.replaceAll("'", ''),
  //     accountNew: this.formBlkControl.value.diNewAccount,
  //     bankNew: this.formBlkControl.value.tiNewBank,
  //     screenKey: 'FACTADBCAMBIONUME',
  //     typeConv: this.formBlkControl.value.typeConversion,
  //     pTransGood: this.getTransGood(),
  //   };
  // }

  async pupValidateMassive(): Promise<void> {
    try {
      this.loader.load = true;
      // const body = {
      //   availableMasive: this.dataTableMassive.map(item => {
      //     return {
      //       available: item.disponible,
      //       goodNumber: item.no_bien,
      //       sellPrice: item.precio_venta,
      //       screenKey: 'FACTADBCAMBIONUME',
      //       salePrice: item.precio_venta,
      //       typeConv: this.formBlkControl.value.typeConversion,
      //       // spentId,
      //       ivavta: item.ivavta,
      //       amount: item.importe,
      //       commission: item.comision,
      //       ivacom: item.ivacom,
      //       goodTransP: this.getTransGood(),
      //       identificator: item.identificador,
      //       description: item.descripcion,
      //       statusGood: item.estatus,
      //       Comment: item.comentario,
      //       bankNew: this.formBlkControl.value.tiNewBank,
      //       moneyNew: this.formBlkControl.value.diNewCurrency.replaceAll(
      //         "'",
      //         ''
      //       ),
      //       accountNew: this.formBlkControl.value.diNewAccount,
      //       user: this.infoToken.preferred_username.toUpperCase(),
      //       token: this.formBlkControl.value.tiNewFile,
      //       // amountevta,
      //       // fileNumber
      //     };
      //   }),
      //   diCoinNew: this.formBlkControl.value.diNewCurrency.replaceAll("'", ''),
      //   screenKey: 'FACTADBCAMBIONUME',
      //   convType: this.formBlkControl.value.typeConversion,
      //   pTransGood: this.getTransGood(),
      // };
      const body = {
        availableMasive: this.dataTableMassive.map(item => {
          return {
            statusGood: item.estatus,
            comment: item.comentario,
            salePrice: item.precio_venta,
            identificador: item.identificador,
            description: item.descripcion,
            amount: item.importe,
            ivavta: item.ivavta,
            goodNumber: item.no_bien,
            ivacom: item.ivacom,
            commission: item.comision,
            user: this.infoToken.preferred_username.toUpperCase(),
          };
        }),
        token: this.formBlkControl.value.tiNewFile || '',
        dateNew: this.formBlkControl.value.tiNewDate || '',
        moneyNew:
          this.formBlkControl.value.diNewCurrency?.replaceAll("'", '') || '',
        accountNew: this.formBlkControl.value.diNewAccount || '',
        bankNew: this.formBlkControl.value.tiNewBank || '',
        screenKey: 'FACTADBCAMBIONUME',
        convType: this.formBlkControl.value.typeConversion,
        pTransGood: this.getTransGood(),
      };
      await firstValueFrom(
        this.goodService.pupValidMasiv(body).pipe(
          map(res => {
            console.log(res);
            if (res.data) {
              const goodFather = res.data.map((item: any) => {
                return {
                  goodNumberF: item.goodNumberF,
                  goodStatusF: item.goodStatusF,
                };
              });
              const goodGenerate = res.data.map((item: any) => {
                return {
                  goodNumberS: item.goodNumberS,
                  goodStatusS: item.goodStatusS,
                };
              });
              this.openDialogGoodStatus(goodFather, goodGenerate);
              this.clear();
            } else {
              this.alert('warning', 'Bienes no encontrados', '');
            }
            this.loader.load = false;
          }),
          catchError(err => {
            if (err.error.message.include('insertar')) {
              this.alert(
                'error',
                'Error',
                'Ocurrió un error Insertar los Datos Asegúrese de que los Datos sean Correctos y no estén Duplicados'
              );
              this.loader.load = false;
            }
            console.log('err', err);
            throw err;
          })
        )
      );
    } catch (error) {
      this.loader.load = false;
      console.log('error', error);
      this.alert('error', 'Error', 'Ocurrió un Error al Validar el Masivo');
    }
  }

  checkedMovBan = false;
  isSearchDate = false;

  changeDeposit(event: IAccountMovement | null): void {
    console.log(event);
    this.isSearchDate = false;
    // this.formBlkControl.get('tiNewDate').setValue(event?.dateMotion || null);
    this.formBlkControl.get('diDeposit').setValue(event?.deposit || null);
    this.formBlkControl.get('tiNewFile').setValue(event?.InvoiceFile || null);
    this.formBlkControl
      .get('diNumberMovement')
      .setValue(event?.numberMotion || null);
    this.formBlkControl
      .get('diCategory')
      .setValue(event?.category.category || null);
  }

  changeGenerateMvBan(event: any): void {
    this.checkedMovBan = event.target.checked;
  }

  changeTypeConversion(event: any) {
    console.log(event);
    const value = event.value;
    if (value !== 'BBB') {
      this.formBlkControl.get('comment').setValue(null);
    }
  }

  openDialogGoodStatus(
    dataFather: { goodNumberF: string; goodStatusF: string }[],
    dataGenerate: { goodNumberS: string; goodStatusS: string }[]
  ) {
    this.modalService.show(GoodsGenerateDialogComponent, {
      initialState: {
        dataFather,
        dataGenerate,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
}
