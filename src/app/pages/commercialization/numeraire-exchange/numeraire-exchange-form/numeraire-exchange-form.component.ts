import { animate, style, transition, trigger } from '@angular/animations';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, catchError, firstValueFrom, map, of } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import {
  generateUrlOrPath,
  getUser,
  readFile,
  showToast,
} from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
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
  styles: ['::ng-deep .ws-pre{white-space: pre-wrap;}'],
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

  sourcesMassive = new LocalDataSource();
  fileName: string = 'Seleccionar archivo';

  // formHelpivavtaPercent = new FormControl(null);
  // formHelpcommissionPercent = new FormControl(null);
  // formHelpcommissionTaxPercent = new FormControl(null);

  pathGoods = generateUrlOrPath(GoodEndpoints.Good, GoodEndpoints.Good, true);

  conversionTypes = [
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
    {
      text: 'Bien cambiado a numerario por responsabilidad',
      value: 'CNR',
    },
    {
      text: 'Bien cambiado a numerario por enajenación de valores y divisas',
      value: 'CNE',
    },  
  ];

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
    private goodProcessService: GoodProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.infoToken = this.authService.decodeToken();
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

  isLoadingGood: boolean = false;
  searchGood() {
    const goodId = this.formGood.get('id').value;
    if (!goodId) {
      showToast({
        icon: 'warning',
        text: 'Debe ingresar un identificador de bien',
      });
      return;
    }
    const params = new ListParams();
    params['filter.id'] = goodId;
    params.limit = 1;
    params.page = 1;
    this.isLoadingGood = true;
    this.goodService.getAll(params).subscribe({
      next: response => {
        this.isLoadingGood = false;
        this.formGood.patchValue(response.data[0]);
        this.validateGood(this.formGood.value.id);
      },
      error: () => {
        this.isLoadingGood = false;
        this.onLoadToast('warning', '', 'No se encontró el bien');
      },
    });
  }

  getDataForTableExpenses(): { spentId: any[]; spentImport: any[] } {
    const expense = this.tableExpense.getExpense();
    let convertExpense: { spentId: any[]; spentImport: any[] } = {
      spentId: [],
      spentImport: [],
    };
    expense.forEach(element => {
      convertExpense.spentId.push({
        element: element.id,
      });
      convertExpense.spentImport.push({
        element: element.import,
      });
    });
    return convertExpense;
  }

  // changeGood(event: any) {
  //   if (!event?.goodId) {
  //     showToast({
  //       icon: 'warning',
  //       text: 'Este bien no posee identificador (goodId)',
  //     });
  //     event = null;
  //   }

  //   this.form.patchValue({
  //     status: event?.status || null,
  //     identificator: event?.identifier || null,
  //     processExt: event?.extDomProcess || null,
  //     delegationNumber: event?.delegationNumber?.id || null,
  //     subDelegationNumber: event?.subDelegationNumber?.id || null,
  //     flier: event?.flyerNumber || null,
  //     fileNumber: event?.expediente?.id || null,
  //     expAssociated: event?.associatedFileNumber || null,
  //   });
  //   this.selectedGood = event;

  //   if (event) this.validateGood(event.goodId);
  // }

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

    const availableGood = await firstValueFrom(
      this.goodProcessService.postExistsGoodxStatus(body).pipe(
        map(res => (res.count > 0 ? true : false)),
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
        'Advertencia',
        'El bien consultado también puede ser convertido a numerario por valores y divisas. \n Verifique su tipo de conversión antes de continuar con el proceso'
      );
    }
    if (!validateNumerary && !availableGood) {
      this.onLoadToast(
        'warning',
        'Advertencia',
        'Estatus, identificador o clasificador inválido para cambio a numerario/valores y divisas'
      );
    }
  }

  getFile(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1)
      throw 'No seleccionó ningún archivo o seleccionó más de la cantidad permitida (1)';

    readFile(files[0], 'BinaryString').then(data => {
      this.readCsv(data.result);
    });

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readCsv(fileReader.result);
  }

  readCsv(binaryExcel: string | ArrayBuffer) {
    try {
      this.loading = true;
      const dataCvs = this.excelService.getData(binaryExcel);
      this.sourcesMassive.load(dataCvs);
      console.log(dataCvs);
      this.totalItems = dataCvs.length;
      this.loading = false;
    } catch (error) {
      this.loading = false;
      showToast({ icon: 'error', text: 'Ocurrió un error al leer el archivo' });
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
        map(res => (res.count > 0 ? true : false)),
        catchError(() => of(false))
      )
    );
    return numeraryAvailable;
  }

  selectAccount(account: {
    cve_banco: string;
    nombre: string;
    no_cuenta: string;
    cve_moneda: string;
    cve_cuenta: string;
  }) {
    console.log(account);
    this.selectedBank = account;
    this.formBlkControl.get('tiNewBank').setValue(account?.cve_banco);
    this.formBlkControl.get('diNewBank').setValue(account?.nombre);
    this.formBlkControl
      .get('diNumberAccountDeposit')
      .setValue(account?.no_cuenta);
    this.formBlkControl.get('diNewAccount').setValue(account?.cve_cuenta);
    this.formBlkControl.get('diNewCurrency').setValue(account?.cve_moneda);

    // account = account || {};
    // this.selectedBank = account;
    // this.form.get('moneyNew').setValue(account?.cveCurrency || null);
    // this.form.get('accountNew').setValue(account?.cveAccount || null);
    // this.form.get('bankNew').setValue(account?.cveBank || null);
  }

  async saveInServer(): Promise<void> {
    // this.validateForm().then(isValid => {
    //   console.log(isValid);
    //   console.log(this.form.value);
    //   if (isValid) {
    //     this.goodService.changeGoodToNumerary(this.form.value).subscribe({
    //       next: (res: any) => {
    //         console.log(res);
    //       },
    //       error: (error: any) => {},
    //     });
    //   }
    // });
    // const isWhite = this.infoToken.;

    /*TODO: hace cuando se sepa de donde traer IF :blk_toolbar.toolbar_escritura != 'S' THEN
	    LIP_MENSAJE('No tiene permiso de escritura para ejecutar el cambio de numerario','C');
	    RAISE FORM_TRIGGER_FAILURE;
      END IF;
    */
    console.log(this.formBlkControl.value);
    if (!this.formGood.value.id) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe especificar el bien que se quiere cambiar a numerario'
      );
      return;
    }

    if (this.formBlkControl.value.checkMovementBank) {
      if (!this.formBlkControl.value.tiNewBank) {
        this.alert('warning', 'Advertencia', 'Debe especificar el banco');
        return;
      }
      if (!this.formBlkControl.value.diNumberMovement) {
        this.alert(
          'warning',
          'Advertencia',
          'No ha seleccionado debidamente del deposito que ampara el cambio a numerario'
        );
        return;
      }
    }

    if (!this.formBlkControl.value.typeConversion) {
      this.alert(
        'warning',
        'Advertencia',
        'No ha seleccionado el tipo de conversión'
      );
      return;
    }
    const validNumerary = await this.pupValidNumerary();
    if (!this.formBlkControl.value.diNewCurrency && validNumerary) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe especificar el tipo de moneda'
      );
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
        'El tipo de conversión seleccionado no es permitido para este bien.'
      );
      return;
    }

    if (!this.formGood.value.importSell) {
      const questionResponse1 = await this.alertQuestion(
        'question',
        'Advertencia',
        'El nuevo bien se generara con un precio de venta de 1. ¿Desea continuar?'
      );
      if (!questionResponse1.isConfirmed) {
        return;
      }
      const questionResponse2 = await this.alertQuestion(
        'question',
        'Advertencia',
        '¿Seguro que desea cambiar el bien a numerario?'
      );
      if (questionResponse2.isConfirmed) {
        await this.pupCreateGood();
      }
    } else {
      const questionResponse = await this.alertQuestion(
        'question',
        'Advertencia',
        '¿Seguro que desea cambiar el bien a numerario?'
      );
      if (questionResponse.isConfirmed) {
        await this.pupCreateGood();
      }
    }
  }

  async pupCreateGood(): Promise<any> {
    const spent = this.getDataForTableExpenses();

    const body: any = {
      screenKey: this.NAME_CURRENT_FORM,
      clasifGoodNumber: null,
      spentPlus: null,
      amounten: null,
      description: this.form.value.description,
      amountevta: this.formGood.value.importSell,
      typeConv: this.formBlkControl.value.typeConversion,
      spentId: spent?.spentId,
      totalAmount: null,
      status: this.formGood.value.status,
      identificator: this.formGood.value.identifier,
      processExt: this.formGood.value.extDomProcess,
      ivavta: this.formGood.value.taxSell,
      commission: this.formGood.value.commission,
      ivacom: this.formGood.value.taxCommission,
      goodId: this.formGood.value.id,
      delegationNumber: this.formGood.value.delegationNumber,
      subDelegationNumber: this.formGood.value.subDelegationNumber,
      fileNumber: this.formGood.value.fileNumber,
      user: this.infoToken.preferred_username.toUpperCase(),
      bankNew: this.formBlkControl.value.tiNewBank,
      moneyNew: this.formBlkControl.value.diNewCurrency,
      accountNew: this.formBlkControl.value.diNewAccount,
      comment: this.formBlkControl.value.comment,
      expAssociated: this.formGood.value.associatedFileNumber,
      dateNew: this.formBlkControl.value.tiNewDate,
      token: this.formBlkControl.value.tiNewFile,
    };
    await firstValueFrom(
      this.goodService.changeGoodToNumerary(body).pipe(
        catchError(err => {
          this.alert(
            'error',
            'Error',
            'Ocurrió un error al cambiar el bien a numerario'
          );
          throw err;
        })
      )
    );
  }

  saveInSerServerMassive(): void {}

  checkedMovBan = false;
  // validateForm(): Promise<boolean> {
  //   if (this.validNumerary === 'error') {
  //     showToast({ icon: 'error', text: 'Ocurrió un error al validar el bien' });
  //     return Promise.resolve(false);
  //   }
  //   if (this.validNumerary === 'loading') {
  //     showToast({ icon: 'warning', text: 'Validando bien, espere un momento' });
  //     return Promise.resolve(false);
  //   }

  //   const {
  //     typeConv,
  //     goodId,
  //     bankNew,
  //     amountevta,
  //     moneyNew,
  //     ivavta,
  //     commission,
  //     ivacom,
  //   } = this.form.value;
  //   const message: string[] = [];
  //   if (!goodId) {
  //     message.push(
  //       'Debe especificar el bien que se quiere cambiar a numerario'
  //     );
  //   }

  //   if (!ivavta) {
  //     message.push('Debe especificar el IVA en los datos de venta');
  //   }

  //   if (!commission) {
  //     message.push('Debe especificar la comisión en los datos de venta');
  //   }

  //   if (!ivacom) {
  //     message.push(
  //       'Debe especificar el IVA de la comisión en los datos de venta'
  //     );
  //   }

  //   if (this.checkedMovBan && !bankNew) {
  //     message.push('Debe especificar el banco');
  //   }

  //   if (!typeConv) {
  //     message.push('No ha seleccionado el tipo de conversión');
  //   }

  //   if (!moneyNew && this.validNumerary === 'valid') {
  //     message.push('Debe especificar el tipo de moneda');
  //   }

  //   if (
  //     (this.validNumerary === 'valid' && ['CNE', 'BBB'].includes(typeConv)) ||
  //     (this.validNumerary === 'notValid' && typeConv === 'CNE')
  //   ) {
  //     showToast({
  //       icon: 'warning',
  //       text: 'El tipo de conversión seleccionado no es permitido para este bien.',
  //     });
  //     return Promise.resolve(false);
  //   }

  //   if (message.length > 0) {
  //     showToast({
  //       html: message.join('\n'),
  //       customClass: 'ws-pre',
  //       icon: 'warning',
  //       text: '',
  //     });
  //     return Promise.resolve(false);
  //   }

  //   if (!amountevta) {
  //     return showQuestion({
  //       title: 'Confirmación',
  //       text: 'El nuevo bien se generara con un precio de venta de 1.\n ¿Seguro que desea cambiar el bien a numerario?',
  //       confirmButtonText: 'Si, continuar',
  //       cancelButtonText: 'No, cancelar',
  //     }).then(result => {
  //       if (result.isConfirmed) {
  //         this.form.controls['amountevta'].setValue(1);
  //         return Promise.resolve(true);
  //       }
  //       return Promise.resolve(false);
  //     });
  //   }

  //   return showQuestion({
  //     title: 'Confirmación',
  //     text: '¿Seguro que desea cambiar el bien a numerario?',
  //     confirmButtonText: 'Si, continuar',
  //     cancelButtonText: 'No, cancelar',
  //   }).then(result => {
  //     if (result.isConfirmed) {
  //       return Promise.resolve(true);
  //     }
  //     return Promise.resolve(false);
  //   });
  // }

  changeDeposit(event: IAccountMovement): void {
    // this.form.controls['invoiceFile'].setValue(event?.InvoiceFile || null);
    // this.form.controls['deposit'].setValue(event?.deposit || null);
    console.log(event);
    this.formBlkControl.get('tiNewDate').setValue(event?.dateMotion || null);
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
    const value = event.target.value;
    if (value !== 'BBB') {
      this.formBlkControl.get('comment').setValue(null);
    }
  }
}
