import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { differenceInCalendarMonths, startOfMonth } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { AccountmvmntEndpoint } from 'src/app/common/constants/endpoints/accountmvmnt-endpoint';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IAccountDetailInd } from 'src/app/core/models/ms-account-movements/account-detail-ind';
import { IUserChecks } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { IPupCalculateDevolutionResult } from 'src/app/core/models/ms-parametergood/parameters.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ChecksDevolutionService } from 'src/app/core/services/ms-account-movements/checks-devolution.service';
import { DetailsIndMovementService } from 'src/app/core/services/ms-account-movements/details-ind-movement.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { DetailInterestReturnService } from 'src/app/core/services/ms-deposit/detail-interest-return.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { PaymentServicesService } from 'src/app/core/services/ms-paymentservices/payment-services.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  firstFormatDate,
  firstFormatDateToDate,
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
  secondFormatDate,
} from 'src/app/shared/utils/date';
import { DepositAccountStatementModalComponent } from '../deposit-account-statement-modal/deposit-account-statement-modal.component';
import { DepositAccountStatementParameterComponent } from '../deposit-account-statement-parameter/deposit-account-statement-parameter.component';

@Component({
  selector: 'app-deposit-account-statement',
  templateUrl: './deposit-account-statement.component.html',
  styleUrls: ['./deposit-account-statement.component.scss'],
  animations: [
    trigger('OnShow', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DepositAccountStatementComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  readonly = true;
  goodIdSearch: string = null;
  goodSelect = new DefaultSelect();
  di_fec_programada_devolucion: string;
  accountChecksSelect = new DefaultSelect();
  anualBassis: string;
  anual: number;
  vfDate: Date;
  vb_valid: boolean = false;
  searchMode: boolean = false;
  searchConfirm: boolean = false;
  bodyDep: any;
  bodyPost: any;
  instrument: string;
  ok: boolean = false;
  instrumentAccount: string;
  scheduledFecReturn: Date;
  userChecks: IAccountDetailInd;
  rea: any;
  disabled = true;
  // accountPayReturn: number;
  updatePupReturnsByDates = false;
  transferAccount: number;
  validDetail: boolean = false;
  validCheck: boolean = false;
  validTras: boolean = false;
  setAccount: boolean = false;
  realInterest: number;
  estimatedInterest: number;
  estimatedRate: number;
  paramsActNavigate = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsNavigate: number = 0;
  newLimitparamsActNavigate = new FormControl(1);
  tasa: number;
  anio: number;
  mes: number;
  dataGoodAct = new LocalDataSource();
  dateEnd: Date;
  balance: number;
  interestaccredited: number;
  form2: FormGroup;
  dateTransfer: Date;
  transferDate: Date;
  disabledAccount = false;
  disabledMovement = false;
  checksDevolution: IUserChecks[] = [];
  ilikeFilters = [
    'nameindicated',
    'preliminaryinvestigation',
    'criminalcause',
    'bankkey',
    'accounttras',
    'checkfolio',
  ];
  dateFilters = [
    'movementdate',
    'interestcalculationdate',
    'scheduleddatebyconfiscationreturn',
  ];

  ilikeAccountFilters = ['cveBank'];
  columnsMovementType = {
    numberMotion: {
      title: 'Movimiento',
      type: 'string',
      sort: false,
    },
    deposit: {
      title: 'Importe',
      type: 'string',
      sort: false,
    },
    dateMotion: {
      title: 'Fecha Depósito',
      type: 'string',
      sort: false,
    },
    dateTransfer: {
      title: 'Fecha de Transferencia',
      type: 'string',
      sort: false,
    },
  };
  columnsAccountType = {
    cveAccount: {
      title: 'Cuenta',
      type: 'string',
      sort: false,
    },
    cveBank: {
      title: 'Banco',
      type: 'string',
      sort: false,
    },
    cveCurrency: {
      title: 'Moneda',
      type: 'string',
      sort: false,
    },
    accountNumberTransfer: {
      title: 'Cuenta Traspaso',
      type: 'string',
      sort: false,
    },
  };
  columnsType = {
    devolutionnumber: {
      title: 'Devolución',
      type: 'string',
      sort: true,
    },
    accountkey: {
      title: 'Cuenta',
      type: 'string',
      sort: true,
    },
    accountnumber: {
      title: 'Movimiento',
      type: 'string',
      sort: true,
    },
    accounttras: {
      title: 'Cuenta con Traspaso',
      type: 'string',
      sort: true,
    },
    checkfolio: {
      title: 'Cuenta con Cheque',
      type: 'string',
      sort: true,
    },
    accountnumberorigindeposit: {
      title: 'Cuenta Origen Depósito',
      type: 'string',
      sort: true,
    },
    accountnumberpayreturn: {
      title: 'Cuenta Origen Devolución',
      type: 'string',
      sort: true,
    },
    goodnumber: {
      title: 'Bien',
      type: 'string',
      sort: false,
    },
    expedientnumber: {
      title: 'Expediente',
      type: 'string',
      sort: false,
    },
    depositnumber: {
      title: 'Importe',
      type: 'string',
      sort: false,
    },
    returnamount: {
      title: 'Importe Cheque',
      type: 'string',
      sort: false,
    },
    bankkey: {
      title: 'Banco',
      type: 'string',
      sort: false,
    },
    coinkey: {
      title: 'Moneda',
      type: 'string',
      sort: false,
    },
    interestcalculationdate: {
      title: 'Fecha de transferencia',
      type: 'string',
      sort: false,
      filter: false,
      valuePrepareFunction: (value: string) => {
        return formatForIsoDate(value, 'string');
      },
    },
    scheduleddatebyconfiscationreturn: {
      title: 'Fecha de corte',
      type: 'string',
      sort: false,
      filter: false,
      valuePrepareFunction: (value: string) => {
        return formatForIsoDate(value, 'string');
      },
    },
    nameindicated: {
      title: 'Nombre indiciado',
      type: 'string',
      sort: false,
    },
    preliminaryinvestigation: {
      title: 'Averiguación Previa',
      type: 'string',
      sort: false,
    },
    criminalcause: {
      title: 'Causa penal',
      type: 'string',
      sort: false,
    },
  };
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private goodService: GoodService,
    private goodParametersService: GoodParametersService,
    private screenStatusService: ScreenStatusService,
    public accountMovementService: AccountMovementService,
    private datePipe: DatePipe,
    public bankAccountService: BankAccountService,
    private parameterService: ParametersService,
    private expedientService: ExpedientService,
    private detailInterestReturnService: DetailInterestReturnService,
    private paymentServicesService: PaymentServicesService,
    private authService: AuthService,
    public checkDevolutionService: ChecksDevolutionService,
    public detailsIndMovementService: DetailsIndMovementService
  ) {
    super();
  }

  get toReturn() {
    return this.form ? this.form.get('toReturn').value : 0;
  }

  get interestCredited() {
    return this.form ? this.form.get('interestCredited').value : 0;
  }

  get costsAdmon() {
    return this.form ? this.form.get('costsAdmon').value : 0;
  }

  get associatedCosts() {
    return this.form ? this.form.get('associatedCosts').value : 0;
  }

  ngOnInit(): void {
    this.prepareForm();

    this.form
      .get('check')
      .valueChanges.pipe(takeUntil(this.$unSubscribe), debounceTime(500))
      .subscribe({
        next: (response: any) => {
          if (this.checksDevolution.length > 0 && response) {
            if (
              this.checksDevolution.filter(x => x.InvoiceCheck === response)
                .length > 0
            ) {
              this.alert('error', 'Ese cheque ya se tiene registrado', '');
              this.form.get('check').setValue(null);
            }
          }
        },
      });
    this.form
      .get('cutoffDate')
      .valueChanges.pipe(takeUntil(this.$unSubscribe), debounceTime(500))
      .subscribe({
        next: (response: Date) => {
          this.updateCutoffDate(response);
        },
      });
    this.form
      .get('transferDate')
      .valueChanges.pipe(takeUntil(this.$unSubscribe), debounceTime(500))
      .subscribe({
        next: (response: any) => {
          this.updateTransferDate(response);
        },
      });
  }

  changeAccount(account: any) {}

  public updateCalculateData() {
    // setTimeout(() => {
    //   let subTotal = this.toReturn + this.form.get('interestCredited').value;
    //   this.form.get('subTotal').setValue(subTotal);
    //   let checkAmount = subTotal;
    //   if (this.costsAdmon) {
    //     checkAmount -= this.costsAdmon;
    //   }
    //   if (this.associatedCosts) {
    //     checkAmount -= this.associatedCosts;
    //   }
    //   this.form.get('checkAmount').setValue('checkAmount')
    // }, 500);
  }

  prepareForm() {
    this.form = this.fb.group({
      movementNumber: [null],
      account: [null, Validators.required],
      bank: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      amount: [null, Validators.nullValidator],
      depositDate: [null, Validators.nullValidator],
      transfDate: [null, Validators.nullValidator],
      devolutionnumber: [null, Validators.nullValidator],
      accountnumberpayreturn: [null, Validators.nullValidator],
      accountnumberorigindeposit: [null, Validators.nullValidator],
      expedient: [null, Validators.nullValidator],
      goodFilter: [null, Validators.nullValidator],
      goodDescription: [null],
      status: [null, Validators.nullValidator],
      indicated: [null, Validators.nullValidator],
      avPrevious: [null, Validators.nullValidator],
      criminalCase: [null, Validators.nullValidator],

      transferDate: [null, Validators.required],
      cutoffDate: [null, Validators.required],
      toReturn: [null, Validators.nullValidator],
      interestCredited: [null, Validators.nullValidator],
      subTotal: [null, Validators.nullValidator],
      costsAdmon: [null, Validators.nullValidator],
      associatedCosts: [null, Validators.nullValidator],
      checkAmount: [null, Validators.nullValidator],

      checkType: [null, Validators.nullValidator],
      bankAccount: [null, Validators.required],
      check: [null, Validators.required],
      beneficiary: [null, Validators.nullValidator],
      bankCheck: [null, Validators.nullValidator],
      expeditionDate: [null],
      collectionDate: [null],
      fileNumber: [null],
      goodId: [null],
      expedientFilter: [null],
      instrument: [],
    });
    this.returnChecks(new ListParams());
    this.getParameters();
    // this.form.controls['depositDate'].disable();
    //this.validation();
  }

  get movementNumber() {
    return this.form.get('movementNumber');
  }

  get accountNumber() {
    return this.form.get('account');
  }

  get goodFilter() {
    return this.form.get('goodFilter');
  }
  get goodId() {
    return this.form.get('goodId');
  }

  get goodDescription() {
    return this.form.get('goodDescription');
  }

  get status() {
    return this.form.get('status');
  }

  get expedient() {
    return this.form.get('expedient');
  }

  get devolutionnumber() {
    return this.form.get('devolutionnumber');
  }

  get accountnumberorigindeposit() {
    return this.form.get('accountnumberorigindeposit');
  }

  get accountnumberpayreturn() {
    return this.form.get('accountnumberpayreturn');
  }

  get expedientFilter() {
    return this.form.get('expedientFilter');
  }

  get depositDate() {
    return this.form.get('depositDate');
  }

  // changeGood(good: IGood) {
  //   console.log(good);
  //   this.goodIdSearch = null;
  //   this.goodDescription.setValue(good.description);
  //   this.status.setValue(good.status);
  //   this.di_fec_programada_devolucion = good.dateRenderDecoDev as string;
  // }

  clean() {
    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        this.form.controls[controlName].setValue(null);
        //this.form.controls[controlName].enable();
      }
    }
  }

  validation() {
    for (const controlName in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlName)) {
        if (controlName != 'account') {
          this.form.controls[controlName].disable();
          //console.log(controlName);
        }
      }
    }
  }

  getAttributes() {
    this.loading = true;
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
  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      ...data,
      callback: (next: boolean) => {
        if (next) this.getAttributes();
      },
    };
    this.modalService.show(DepositAccountStatementModalComponent, modalConfig);
  }

  openFormParameter() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (next: boolean) => {
        if (next) this.getAttributes();
      },
    };
    this.modalService.show(
      DepositAccountStatementParameterComponent,
      modalConfig
    );
  }

  getGood(params: ListParams, id: string) {
    //const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    this.goodService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          console.log(data.data);
          this.goodSelect = new DefaultSelect(data.data, data.count);
        },
        error: error => {
          this.goodSelect = new DefaultSelect();
          this.loading = false;
        },
      });
  }

  returnChecks(params: ListParams) {
    //const params = new ListParams();
    // const filterParams = new FilterParams();
    // filterParams.limit = params.limit;
    // filterParams.page = params.page;
    // filterParams.addFilter('goodNumber',)
    let body: any = {};
    if (this.goodFilter.value) {
      body = { ...body, goodNumber: this.goodFilter.value };
    }
    if (this.expedientFilter.value) {
      body = { ...body, expedientNumber: this.expedientFilter.value };
    }
    // this.detailsIndMovementService
    //   .getAll(params, body)
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe({
    //     next: data => {
    //       console.log(data.data);
    //       this.accountChecksSelect = new DefaultSelect(data.data, data.count);
    //     },
    //     error: error => {
    //       this.accountChecksSelect = new DefaultSelect();
    //     },
    //   });
  }

  changeChecks2(event: any) {
    console.log(event);
  }

  async changeChecks(event: any) {
    console.log(event);
    if (event) {
      this.validCheck = true;
      this.validDetail = true;
      this.validTras = true;
      // this.userChecks.accounttras = '';
      //this.setAccount = true;
      this.userChecks = event;
      const filterParams = new FilterParams();
      filterParams.limit = 1000000;
      if (this.userChecks.accountnumberpayreturn) {
        filterParams.addFilter(
          'accountPayReturnNumber',
          this.userChecks.accountnumberpayreturn
        );
      } else {
        filterParams.addFilter(
          'accountPayReturnNumber',
          this.userChecks.accountnumberpayreturn,
          SearchFilter.NULL
        );
      }
      this.checksDevolution = await firstValueFrom(
        this.accountMovementService
          .getAllUsersChecks(filterParams.getParams())
          .pipe(
            takeUntil(this.$unSubscribe),
            catchError(x => of({ data: [] as IUserChecks[] })),
            map(x => (x ? x.data ?? [] : []))
          )
      );
      await this.getSetReturn();
      await this.calculateReturn();
      await this.detailReturn();

      // this.getFilterAccount(
      //   event.accountOriginDepositNumber,
      //   event.motionOriginDepositNumber
      // );
      //this.getAccountMovement();
      console.log(this.instrumentAccount);

      //this.maxDate = this.form.controls['cutoffDate'].value;
      //ESTO ES UNA FECHA DE PRUEBA Y ALTERADA
      // this.form.controls['cutoffDate'].setValue(new Date());
      //this.validDate();
    } else if (event == undefined) {
      this.validCheck = false;
      this.validDetail = false;
      this.validTras = false;
      this.clean();
    }
  }

  get cutoffDate() {
    return this.form.get('cutoffDate');
  }

  get collectionDate() {
    return this.form.get('collectionDate');
  }

  get expeditionDate() {
    return this.form.get('expeditionDate');
  }

  get maxExpeditionDate() {
    return this.cutoffDate
      ? this.incognitDateToDate(this.cutoffDate.value)
      : null;
  }

  get minCollectionDate() {
    return this.expeditionDate
      ? this.incognitDateToDate(this.expeditionDate.value)
      : null;
  }

  get maxTransferDate() {
    return this.cutoffDate
      ? this.incognitDateToDate(this.cutoffDate.value)
      : null;
  }

  get minTransferDate() {
    return this.depositDate
      ? this.incognitDateToDate(this.depositDate.value)
      : null;
  }

  private incognitDateToDate(date: any) {
    if (date) {
      // console.log(date);
      if (date instanceof Date) {
        return date;
      }
      if (date.includes('/')) {
        const partesFecha = date.split('/');
        const newDate = new Date(
          Number(partesFecha[2]),
          Number(partesFecha[1]) - 1,
          Number(partesFecha[0])
        );
        // console.log(newDate);
        return newDate;
      } else {
        new Date(date);
      }
    }
    return null;
  }

  async validateCollectionDate(date: Date) {
    if (!this.updatePupReturnsByDates) return;
    const expeditionDate = this.form.get('expeditionDate').value;
  }

  async validateExpeditionCheck(date: Date) {
    if (!this.updatePupReturnsByDates) return;
    const expeditionDate = date; //this.form.get('expeditionDate').value;
    const cutoffDate = this.cutoffDate.value;
    if (!expeditionDate) {
      return;
    }
    if (!cutoffDate) {
      return;
    }
    if (expeditionDate > cutoffDate) {
    }
    const checkType = this.form.get('checkType').value;
    console.log(checkType);

    if (!checkType) {
      return;
    }
    if (checkType === 'INTERES') {
      const params = new FilterParams();
      params.addFilter(
        'motionOriginDepositNumber',
        this.userChecks.movementnumber
      );
      params.addFilter('checkType', 'NORMAL');
      const lastDevolution = await firstValueFrom(
        this.accountMovementService.getAllUsersChecks(params.getParams()).pipe(
          takeUntil(this.$unSubscribe),
          catchError(x => of({ data: [] as IUserChecks[] })),
          map(x => (x.data ? (x.data.length > 0 ? x.data.pop() : null) : null))
        )
      );
      if (!lastDevolution.expeditionCheckDate) {
        this.alert(
          'error',
          'No se tiene la fecha de expedición del cheque padre (NORMAL)',
          ''
        );
        return;
      }
      if (
        new Date(expeditionDate) < new Date(lastDevolution.expeditionCheckDate)
      ) {
        this.alert(
          'error',
          'La expedición del cheque de intereses no puede ser menor a la fecha de expedición del cheque normal',
          ''
        );
        return;
      }
    }
  }

  private async getSetReturn() {
    console.log(
      +this.userChecks.returnamount - +this.userChecks.creditedinterest
    );
    this.updatePupReturnsByDates = false;
    this.disabledAccount = true;
    this.disabledMovement = true;
    if (this.userChecks.accountnumberorigindeposit) {
      this.accountNumber.setValue(this.userChecks.accountnumberorigindeposit);
      this.accountnumberorigindeposit.setValue(
        this.userChecks.accountnumberorigindeposit
      );
    }
    if (this.userChecks.movementnumber) {
      this.movementNumber.setValue(this.userChecks.movementnumber);
    }
    // this.accountPayReturn = this.userChecks.accountnumberpayreturn;
    if (this.userChecks.scheduleddatebyconfiscationreturn) {
      const datePipeReturn = new DatePipe('en-US');
      const formatDateReturn = datePipeReturn.transform(
        new Date(this.userChecks.scheduleddatebyconfiscationreturn),
        'dd/MM/yyyy',
        'UTC'
      );
      this.scheduledFecReturn = formatForIsoDate(
        this.userChecks.scheduleddatebyconfiscationreturn + ''
      ) as Date;
      this.form.controls['cutoffDate'].setValue(formatDateReturn);
      this.form.controls['expeditionDate'].setValue(formatDateReturn);
    }

    this.form.controls['bank'].setValue(this.userChecks.bankkey);
    if (this.userChecks.accountnumberpayreturn) {
      this.form.controls['bankAccount'].setValue(this.userChecks.accountkey);
      this.form.controls['bankCheck'].setValue(this.userChecks.bankkey);
    }
    this.form.controls['currency'].setValue(this.userChecks.coinkey);
    this.goodId.setValue(this.userChecks.goodnumber);
    this.goodDescription.setValue(this.userChecks.description);
    this.status.setValue(this.userChecks.status);
    this.expedient.setValue(this.userChecks.expedientnumber);
    this.devolutionnumber.setValue(this.userChecks.devolutionnumber);

    this.accountnumberpayreturn.setValue(
      this.userChecks.accountnumberpayreturn
    );
    this.form.controls['amount'].setValue(this.userChecks.deposit);
    if (this.userChecks.returnamount) {
      this.form.controls['toReturn'].setValue(
        +this.userChecks.returnamount - +this.userChecks.creditedinterest
      );
      this.form.controls['checkAmount'].setValue(this.userChecks.returnamount);
    } else {
      this.form.controls['toReturn'].setValue(this.userChecks.depositnumber);
    }

    this.form.controls['associatedCosts'].setValue(
      this.userChecks.associatedexpenses
    );
    this.form.controls['costsAdmon'].setValue(this.userChecks.expensesadmon);

    this.form.controls['interestCredited'].setValue(
      this.userChecks.creditedinterest
    );
    const date = new Date(this.userChecks.interestcalculationdate);
    const datePipe = new DatePipe('en-US');
    const formatTrans = datePipe.transform(date, 'dd/MM/yyyy', 'UTC');
    var fechaString = formatTrans;
    const partesFecha = fechaString.split('/');
    this.transferDate = new Date(
      Number(partesFecha[2]),
      Number(partesFecha[1]) - 1,
      Number(partesFecha[0])
    );
    const date1 = new Date(this.userChecks.movementdate);
    const datePipe1 = new DatePipe('en-US');
    const formatMov = datePipe1.transform(date1, 'dd/MM/yyyy', 'UTC');
    this.form.controls['transfDate'].setValue(formatTrans);
    this.form.controls['depositDate'].setValue(formatMov);
    this.form.controls['transferDate'].setValue(formatTrans);
    const filterParams = new FilterParams();
    filterParams.addFilter(
      'accountNumber',
      this.userChecks.transferaccountnumber
    );
    const result = await firstValueFrom(
      this.accountMovementService.getAccountBank(filterParams.getParams()).pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => of({ data: [] })),
        map(x => (x ? x.data : []))
      )
    );
    if (result.length > 0) {
      this.form.controls['instrument'].setValue(result[0].cveInterestCalcRate);
    }
    this.form.controls['checkType'].setValue(this.userChecks.checktype);
    this.form.controls['check'].setValue(this.userChecks.checkfolio);
    this.form.controls['beneficiary'].setValue(this.userChecks.checkpayee);
    this.form.controls['expeditionDate'].setValue(
      this.formatDate(this.userChecks.expeditioncheckdate)
    );
    this.form.controls['collectionDate'].setValue(
      this.formatDate(this.userChecks.checkcashingdate)
    );
    this.form.controls['indicated'].setValue(this.userChecks.nameindicated);
    this.form.controls['avPrevious'].setValue(
      this.userChecks.preliminaryinvestigation
    );
    this.form.controls['criminalCase'].setValue(this.userChecks.criminalcause);
    // let subTotal: number =
    //   Number(this.form.controls['toReturn'].value) +
    //   (Number(this.form.controls['interestCredited'].value) ?? 0);
    // this.form.controls['subTotal'].setValue(subTotal);
    this.preRecord();
    setTimeout(() => {
      this.updatePupReturnsByDates = true;
    }, 500);
  }

  formatDate(date: string) {
    const formatFecTrans = date;
    const formatTrans = this.datePipe.transform(formatFecTrans, 'yyyy/MM/dd');
    return formatTrans;
  }

  enableSearchMode() {
    this.searchMode = true;
    //this.onSearchStart.emit(true);
  }

  private confirmSearch() {
    console.log('confirmSearch');
    //this.getAccountMovement();
    this.searchMode = false;
    this.searchConfirm = true;
    this.calculateReturn();
    //this.onConfirmSearch.emit(true);
  }

  cancelSearch() {
    this.searchMode = false;
    this.searchConfirm = false;
    //this.onSearchStart.emit(false);
  }

  // changeGood(event: any) {
  //   console.log(event.scheduledDateDecoDev, event.status);
  // }

  getParameters() {
    this.goodParametersService
      .getById('DIASCALINT')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((data: { initialValue: string }) => {
        this.anualBassis = data.initialValue;
        this.anual = Number(this.anualBassis);
        if (this.anual === null) {
          //NO SE PUEDE OPERAR LA PANTALLA
          this.alert(
            'warning',
            'No se tiene definido el parametro de dias x año',
            'No es posible operar la pantalla'
          );
        } else if (this.anual === 0) {
          //NO SE PUEDE OPERAR LA PANTALLA
          this.alert(
            'warning',
            'El parametro de dias x año',
            'para calculo de intereses estimados no puede ser cero'
          );
        }
      });
  }

  async preInsert() {
    const statusBien = this.status.value;
    if (!statusBien) {
      this.alert(
        'warning',
        'No tiene definido un Bien Estatus',
        'El cual es necesario para registrar la Devolución'
      );
      return false;
    }
    const params = { estatus: statusBien, vc_pantalla: 'FCONADBEDOCTAXIND' };
    const results = await firstValueFrom(
      this.screenStatusService
        .getAllFiltro(params)
        .pipe(catchError(x => of(null)))
    );
    if (!results || results.count === 0) {
      this.alert(
        'warning',
        'El Bien se encuentra en un Estatus',
        'En el cual no se permite registrar la Devolución'
      );
      return false;
    }
    // VERIFICAR SI VA no-devolucion

    if (this.form.controls['transfDate'].value === null) {
      if (this.form.controls['transferDate'].value != null) {
        if (
          this.userChecks.accountnumberorigindeposit &&
          this.userChecks.accountnumberpayreturn
        ) {
          await firstValueFrom(
            this.accountMovementService.update({
              dateCalculationInterests:
                this.form.controls['transferDate'].value,
              accountNumber: this.userChecks.accountnumber,
            })
          );
        }
        //actualizar movimiento de cuentas

        //vf_fecha_interses:= : blk_dev.ti_fec_inicio_interes ;
      }
    } else {
      if (
        this.form.controls['transfDate'].value !=
        this.form.controls['transferDate'].value
      ) {
        if (
          this.userChecks.accountnumberorigindeposit &&
          this.userChecks.accountnumberpayreturn
        ) {
          await firstValueFrom(
            this.accountMovementService.update({
              dateCalculationInterests:
                this.form.controls['transferDate'].value,
              accountNumber: this.userChecks.accountnumber,
            })
          );
        }
      } else {
        //vf_fecha_interses:= : blk_dev.di_fec_transferencia_deposito;
      }
    }
    return true;
  }

  preRecord() {
    if (
      (this.userChecks.accounttras &&
        this.userChecks.accounttras === 'TRASPASADO') ||
      (this.form.get('bankAccount').value &&
        this.form.get('check').value &&
        this.form.get('expeditionDate').value &&
        this.form.get('collectionDate').value)
    ) {
      this.disabled = true;
    } else {
      this.disabled = false;
      this.form.controls['transferDate'].enable({
        onlySelf: true,
        emitEvent: false,
      });
      this.form.controls['cutoffDate'].enable({
        onlySelf: true,
        emitEvent: false,
      });
      this.form.controls['beneficiary'].enable({
        onlySelf: true,
        emitEvent: false,
      });
    }
  }

  search(event: any) {
    console.log(event);
  }

  keyCommit() {
    /*const no_move_origin_dep = ;
    if(no_move_origin_dep === null){
      this.alert(
          'warning',
          'Debe registrar primero un movimiento',
          ''
        );
    }

    if(this.form.controls['cutoffDate'].value ){

    }
    */
  }

  setInstrument() {
    this.getInstrument(this.bodyPost[0].no_cuenta_traspaso);
    console.log(this.instrument);
  }

  // private getAccountMovement(good: string, exp: string) {
  //   let accont = {
  //     tiExpQuery: this.form.controls['fileNumber'].value,
  //     tiQueryGood: this.form.controls['good'].value,
  //   };
  //   this.accountMovementService
  //     .createAccount(accont)
  //     .pipe(takeUntil(this.$unSubscribe))
  //     .subscribe({
  //       next: data => {
  //         this.bodyDep = data.data;
  //         console.log(this.bodyDep);
  //         let body = {
  //           depOriginAccNumber: this.bodyDep[0].no_cuenta,
  //           depOriginMovNumber: this.bodyDep[0].no_movimiento,
  //         };
  //         this.accountMovementService
  //           .createPostQuery(body)
  //           .pipe(takeUntil(this.$unSubscribe))
  //           .subscribe({
  //             next: resp => {
  //               this.bodyPost = resp.data;
  //               this.fillOut();
  //             },
  //           });
  //       },
  //     });
  // }

  async updateTransferDate(date: any) {
    if (!this.updatePupReturnsByDates) return;
    if (date) {
      this.loader.load = true;
      if (date instanceof Date) {
        this.transferDate = date;
      } else {
        this.transferDate = firstFormatDateToDate(date);
      }
      console.log(date);
      // debugger;
      if (
        this.form.controls['toReturn'].value &&
        this.form.controls['depositDate'].value &&
        this.form.controls['cutoffDate'].value
      ) {
        let depositDate = this.form.controls['depositDate'].value;
        if (depositDate instanceof Date) {
          // depositDate = depositDate;
        } else {
          depositDate = firstFormatDateToDate(depositDate);
        }
        if (this.transferDate < depositDate) {
          this.loader.load = false;
          this.alert(
            'error',
            'La fecha de Inicio no puede ser menor a la fecha del depósito',
            ''
          );
          return;
        }

        let cutoffDate = this.form.controls['cutoffDate'].value;
        if (cutoffDate instanceof Date) {
          // cutoffDate = cutoffDate;
        } else {
          cutoffDate = firstFormatDateToDate(cutoffDate);
        }
        if (this.transferDate > cutoffDate) {
          this.loader.load = false;
          this.alert(
            'error',
            'La fecha de inicio NO puede ser mayor a la fecha de corte',
            ''
          );
          return;
        }
        await this.calculateReturn();
        await this.detailReturn();
        this.loader.load = false;
      }

      /*var fechaString = data;
      const partesFecha = fechaString.split("/");
      this.transferDate = new Date(Number(partesFecha[2]), Number(partesFecha[1]) - 1, Number(partesFecha[0]));
      console.log(this.transferDate);*/
    }
  }

  private async updateCutoffDate(date: Date) {
    if (!this.updatePupReturnsByDates) return;
    if (date) {
      this.loader.load = true;
      // debugger;
      this.form.controls['expeditionDate'].setValue(date);
      // this.form
      if (
        this.form.controls['toReturn'].value &&
        this.form.controls['depositDate'].value &&
        this.form.controls['transferDate'].value
      ) {
        let transferDate = this.form.controls['transferDate'].value;
        if (transferDate instanceof Date) {
          // transferDate = transferDate;
        } else {
          transferDate = firstFormatDateToDate(transferDate);
        }
        let newDate = date;
        if (newDate instanceof Date) {
          // this.transferDate = date;
        } else {
          newDate = firstFormatDateToDate(newDate);
        }

        if (newDate < transferDate) {
          this.loader.load = false;
          this.alert(
            'error',
            'La fecha de corte no puede ser menor a la fecha de inicio',
            ''
          );
          return;
        }
        console.log(date, this.scheduledFecReturn);
        if (
          this.scheduledFecReturn &&
          firstFormatDate(date) !== firstFormatDate(this.scheduledFecReturn)
        ) {
          this.loader.load = false;
          this.alert(
            'error',
            'Especifico una fecha de corte diferente a la que se tiene programada (' +
              firstFormatDate(this.scheduledFecReturn) +
              ') por lo que esto será solo una simulación',
            ''
          );
          return;
        }
        await this.calculateReturn();
        await this.detailReturn();
        this.loader.load = false;
      }
    }
  }

  getInstrument(accountNum: number | string) {
    let instru: string;
    const params = new ListParams();
    params['filter.accountNumber'] = `$eq:${accountNum}`;
    this.bankAccountService
      .getCveBank(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.instrument = resp.data[0].cveInterestCalcRate;
          this.form.controls['instrument'].setValue(this.instrument);
        },
      });
  }

  get pathBankAccount() {
    return (
      AccountmvmntEndpoint.BasePath +
      '/api/v1/' +
      AccountmvmntEndpoint.getAccount +
      '?filter.cveCurrency=' +
      (this.form.get('currency').value ?? 'MN')
    );
  }

  get pathBeneficiary() {
    return (
      AccountmvmntEndpoint.BasePath +
      '/api/v1/' +
      AccountmvmntEndpoint.getBeneficiarios
    );
  }

  changeCveCuenta(event: any) {
    if (event) {
      this.form.get('bankCheck').setValue(event.cveBank);
    }
  }

  async validComplementary() {
    this.ok = true;
    if (this.userChecks.movementnumber === null) {
      this.alert(
        'warning',
        'Debe Registrar Primero un Movimiento Normal',
        'Para hacer un Cheque Complementario'
      );
      return false;
    }
    if (this.form.controls['transferDate'].value == null) {
      this.alert('warning', 'Debe Especificar', 'La Fecha de Transferencia');
      return false;
    }
    if (this.form.controls['cutoffDate'].value == null) {
      this.alert('warning', 'Debe Especificar', 'La Fecha de Corte');
      return false;
    }
    if ((this.form.controls['checkAmount'].value ?? 0) == 0) {
      this.alert('warning', 'Debe haber algún Importe para el Cheque', '');
      return false;
    }
    if (this.form.controls['bankAccount'].value == null) {
      this.alert(
        'warning',
        'Debe Especificar la Cuenta',
        'De donde se hace la Salida del Cheque'
      );
      return false;
    }
    if (this.form.controls['check'].value == null) {
      this.alert(
        'warning',
        'Debe Especificar',
        'El Folio del Cheque a Devolver'
      );
      return false;
    }
    if (this.form.controls['expeditionDate'].value == null) {
      this.alert(
        'warning',
        'Debe Especificar',
        'La Fecha de Expedición del Cheque'
      );
      return false;
    }
    if (this.form.controls['beneficiary'].value == null) {
      this.alert('warning', 'Debe Especificar', 'El Beneficiario del Cheque');
      return false;
    }

    console.log(
      this.form.controls['cutoffDate'].value,
      firstFormatDate(this.scheduledFecReturn)
    );
    let cutoffDate: any;
    if (this.form.controls['cutoffDate'].value instanceof Date) {
      cutoffDate = firstFormatDate(this.form.controls['cutoffDate'].value);
    } else {
      cutoffDate = this.form.controls['cutoffDate'].value;
    }
    if (
      this.scheduledFecReturn &&
      cutoffDate !== firstFormatDate(this.scheduledFecReturn)
    ) {
      this.alert(
        'warning',
        'Especifico una Fecha de Corte',
        'Diferente a la Programada'
      );
      return false;
    }
    if (this.form.controls['checkType'].value == 'INTERES') {
      this.alert(
        'warning',
        'Se encuentra en un Cheque Complementario',
        'El Beneficiario del Cheque'
      );
      return false;
    } else {
      //GO_BLOCK('blk_dev')
      const params = new ListParams();
      params[
        'filter.motionOriginDepositNumber'
      ] = `$eq:${this.userChecks.movementnumber}`;
      params['filter.checkType'] = `$eq:INTERES`;
      let count: number = await firstValueFrom(
        this.accountMovementService.getAllUsersChecks(params).pipe(
          takeUntil(this.$unSubscribe),
          catchError(x => of({ count: 0 })),
          map((x: any) => (x ? x.count ?? 0 : 0))
        )
      );
      if (count > 0) {
        this.ok = false;
      }
      if (!this.ok) {
        this.alert(
          'warning',
          'Ya se tiene registrado un Cheque',
          'Complementario a ese Movimiento'
        );
        return false;
      }
      return true;
    }
  }

  private async calculateReturn() {
    console.log('Calculate return');
    // debugger;
    if (!this.updatePupReturnsByDates) {
      return;
    }
    let fecCorteDevolucion: any = this.form.controls['cutoffDate'].value;
    if (!fecCorteDevolucion) {
      this.alert('error', 'Calculo de Devolución', 'Falta Fecha de Corte');
      return;
    }
    if (fecCorteDevolucion instanceof Date) {
      fecCorteDevolucion = secondFormatDate(fecCorteDevolucion);
    } else {
      fecCorteDevolucion =
        firstFormatDateToSecondFormatDate(fecCorteDevolucion);
    }
    let tiFecInicioInteres: any = this.form.controls['transfDate'].value;
    if (!tiFecInicioInteres) {
      this.alert(
        'error',
        'Calculo de Devolución',
        'Falta Fecha de Inicio de Interés'
      );
      return;
    }
    if (tiFecInicioInteres instanceof Date) {
      tiFecInicioInteres = secondFormatDate(tiFecInicioInteres);
    } else {
      tiFecInicioInteres =
        firstFormatDateToSecondFormatDate(tiFecInicioInteres);
    }
    let importeSinInteres = this.form.controls['toReturn'].value;
    if (!importeSinInteres) {
      this.alert('error', 'Calculo de Devolución', 'Falta Monto a Devolver');
      return;
    }
    let diMonedaDeposito = this.form.controls['currency'].value;
    if (!diMonedaDeposito) {
      this.alert('error', 'Calculo de Devolución', 'Falta Moneda');
      return;
    }
    let diInstrumento = this.form.controls['instrument'].value;
    // if (!diInstrumento) {
    //   return;
    // }
    let diBienDeposito = this.goodId.value;
    if (!diBienDeposito) {
      return;
    }
    let body = {
      fecCorteDevolucion,
      tiFecInicioInteres,
      importeSinInteres: +importeSinInteres,
      diMonedaDeposito,
      diInstrumento,
      diBienDeposito,
    };
    console.log(body);
    // return null;
    const results = await firstValueFrom(
      this.parameterService.pupCalculateDevolution(body).pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => of(null as IPupCalculateDevolutionResult))
      )
    );
    if (results) {
      this.estimatedRate = results.tasa_estimada;
      this.realInterest = results.interes_real;
      this.estimatedInterest = results.interes_estimado;
      this.form.controls['interestCredited'].setValue(
        results.interes_acreditado
      );
      this.form.controls['subTotal'].setValue(+results.di_subtotal);
      this.form.controls['checkAmount'].setValue(+results.importe_devolucion);
      this.form.controls['costsAdmon'].setValue(results.gastos_admon ?? 0);
      this.form.controls['associatedCosts'].setValue(
        results.gastos_asociados ?? 0
      );
    }
  }

  getPayment(good: string | number) {
    this.paymentServicesService
      .getById(good)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (resp: { spent: any; cost: any }) => {
          //: blk_dev.gastos_admon, : blk_dev.gastos_asociados
          this.form.controls['costsAdmon'].setValue(resp ? resp.spent ?? 0 : 0);
          this.form.controls['associatedCosts'].setValue(
            resp ? resp.cost ?? 0 : 0
          );
        },
      });
  }

  obtenerCantidadMeses(vf_hoy: Date, ti_fec_inicio_interes: Date): number {
    const fechaInicioInteres = startOfMonth(ti_fec_inicio_interes);
    const cantidadMeses =
      differenceInCalendarMonths(vf_hoy, fechaInicioInteres) + 1;
    console.log(cantidadMeses);
    return cantidadMeses;
  }

  dateStartInterest(date: string) {
    const fechaInicio = new Date(date);
    const ultimoDia = new Date(
      fechaInicio.getFullYear(),
      fechaInicio.getMonth() + 1,
      0
    );
    const diferencia = ultimoDia.getDate() - fechaInicio.getDate();
    return diferencia;
  }

  monthReview(anio: number, mes: number) {
    const fechaInicio = new Date(anio, mes - 1, 1);
    const ultimoDia = new Date(anio, mes, 0);
    const diferencia = ultimoDia.getDate() - fechaInicio.getDate() + 1;
    return diferencia;
  }

  private async detailReturn() {
    // debugger;
    if (!this.updatePupReturnsByDates) {
      return null;
    }
    let no_devolucion: any = this.userChecks.devolutionnumber;
    if (no_devolucion) {
      no_devolucion = +(this.userChecks.devolutionnumber + '');
    } else {
      no_devolucion = null;
    }
    console.log('DETAIL RETURN');
    let fec_corte_devolucion: any = this.form.controls['cutoffDate'].value;
    if (!fec_corte_devolucion) {
      this.alert('error', 'Detalle de Devolución', 'Falta Fecha de Corte');
      return null;
    }

    if (fec_corte_devolucion instanceof Date) {
      fec_corte_devolucion = secondFormatDate(fec_corte_devolucion);
    } else {
      fec_corte_devolucion =
        firstFormatDateToSecondFormatDate(fec_corte_devolucion);
    }

    let ti_fec_inicio_interes: any = this.form.controls['transfDate'].value;
    if (!ti_fec_inicio_interes) {
      this.alert(
        'error',
        'Detalle de Devolución',
        'Falta Fecha de Transferencia'
      );
      return null;
    }

    if (ti_fec_inicio_interes instanceof Date) {
      ti_fec_inicio_interes = secondFormatDate(ti_fec_inicio_interes);
    } else {
      ti_fec_inicio_interes = firstFormatDateToSecondFormatDate(
        ti_fec_inicio_interes
      );
    }

    let importe_sin_interes = this.form.controls['toReturn'].value;
    if (!importe_sin_interes) {
      this.alert('error', 'Detalle de Devolución', 'Falta a Devolver');
      return null;
    }
    let di_moneda_deposito = this.form.controls['currency'].value;
    if (!di_moneda_deposito) {
      this.alert('error', 'Detalle de Devolución', 'Falta Moneda');
      return null;
    }
    let di_instrumento = this.form.controls['instrument'].value;
    let tipo_cheque = this.form.controls['checkType'].value;
    let body = {
      fec_corte_devolucion,
      no_devolucion,
      ti_fec_inicio_interes,
      tipo_cheque,
      importe_sin_interes,
      di_moneda_deposito,
      di_instrumento,
      no_movimiento_origen_deposito: this.userChecks.accountnumberorigindeposit
        ? +this.userChecks.accountnumberorigindeposit
        : null,
    };
    console.log(body);
    // return null
    const results = await firstValueFrom(
      this.detailInterestReturnService.pupDetailDevolution(body).pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => of(x))
      )
    );
    if (results && results.no_devolucion) {
      this.userChecks.devolutionnumber = results.no_devolucion;
    }
    return results;
  }

  createDetailInterestReturn(body: any) {
    this.detailInterestReturnService.create(body).subscribe({
      next: data => {
        //this.alert('success', 'Detalle de Interes de Devolucion', `Guardado Correctamente`);
      },
      error: err => {},
    });
  }

  getCheck(noOriginMov: number | string) {
    this.detailInterestReturnService
      .getDepOriginMov(noOriginMov)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (resp: { data: { saldo: number; fec_fin: any }[] }) => {
          this.dateEnd = resp.data[0].fec_fin;
          this.balance = resp.data[0].saldo;
        },
      });
    //endpoint http://sigebimsdev.indep.gob.mx/deposit/api/v1/detail-interest-return/pubReturnDetail/{depOriginMovNumber}
    //return data;
  }

  async insert() {
    const preInsert = await this.preInsert();
    if (preInsert) {
      // this.accountMovementService.createUserChecks({
      //   accountOriginDepositNumber:+this.userChecks.accountnumberorigindeposit,
      // });
    }
  }

  async interestCheck() {
    this.loader.load = true;
    if (!this.userChecks.devolutionnumber) {
      this.alert(
        'error',
        'Detalle de Devolución',
        'Falta Número de Devolución'
      );
      this.loader.load = false;
      return;
    }
    let priorInterest: number;
    const valid = await this.validComplementary();
    if (!valid) {
      this.loader.load = false;
      return;
    }
    await this.insert();
    return;
    priorInterest = this.form.controls['interestCredited'].value;

    this.form.controls['check'].setValue(null);
    this.form.controls['expeditionDate'].setValue(null);
    this.form.controls['collectionDate'].setValue(null);
    this.userChecks.accounttras = null;
    await this.calculateReturn();
    if ((priorInterest = this.form.controls['interestCredited'].value)) {
      this.alert(
        'warning',
        'El interes calculado es igual al que ya se ha pagado',
        'Por lo que no es necesario generar ningun cheque complementario'
      );
      this.loader.load = false;
      return;
    } else {
      /*SELECT seq_num_devolucion.nextval
      INTO: blk_dev.no_devolucion
      FROM dual;*/
      const seqNextVal = await firstValueFrom(
        this.detailInterestReturnService
          .getSeqNextVal()
          .pipe(takeUntil(this.$unSubscribe))
      );
      if (seqNextVal) {
        this.userChecks.devolutionnumber = seqNextVal.nextval;
      }
      this.form.get('checkType').setValue('INTERES');
      const results = await this.detailReturn();
      console.log(results);
      // return;
      if (results.error) {
        this.alert('error', 'Detalle Devolución', results.error.message);
        this.loader.load = false;
        return;
      }
      const resp = await firstValueFrom(
        this.detailInterestReturnService
          .getById(this.userChecks.devolutionnumber)
          .pipe(
            takeUntil(this.$unSubscribe),
            catchError(x => of({ data: [] })),
            map(x => (x ? (x.data ? x.data : []) : []))
          )
      );
      for (let i = 0; i < resp.length; i++) {
        this.interestaccredited = resp[i].interest;
      }
      if (resp.length > 0) {
        this.form.controls['interestCredited'].setValue(
          this.interestaccredited
        );
      }
      this.form.controls['toReturn'].setValue(0);
      this.form.controls['subTotal'].setValue(
        this.form.controls['interestCredited'].value
      );
      this.form.controls['costsAdmon'].setValue(0);
      this.form.controls['associatedCosts'].setValue(0);
      this.form.controls['checkAmount'].setValue(
        this.form.controls['interestCredited'].value
      );
      this.form.controls['transferDate'].disable({
        onlySelf: true,
        emitEvent: false,
      });
      this.form.controls['cutoffDate'].disable({
        onlySelf: true,
        emitEvent: false,
      });
      this.form.controls['beneficiary'].disable({
        onlySelf: true,
        emitEvent: false,
      });
      this.loader.load = false;
      this.alert('success', 'Cheque Complementario', 'Creado correctamente');
    }
    // llamar al servicio de deposit
  }

  detailCalculation() {
    const cuenta_origen_deposito = this.userChecks.accountnumber;
    if (cuenta_origen_deposito === null) {
      this.alert('warning', 'Debe seleccionar un deposito primero', '');
    } else {
      //this.getReturnNumber(this.userChecks.returnNumber);
      this.detailInterestReturnService
        .getById(this.userChecks.devolutionnumber)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: (resp: { data: any }) => {
            this.rea = { data: resp.data };
            this.rea = {
              ...this.rea,
              devolutionnumber: this.userChecks.devolutionnumber,
            };
            this.openForm(this.rea);
          },
        });
    }
  }

  async transferMov() {
    let concept: string = null;
    // crear en HTML etiqueta accounttras;
    if (this.userChecks.accounttras == 'TRASPASADO') {
      this.alert('warning', 'Ya ha sido traspasado', '');
      return;
    }
    if (!this.userChecks.devolutionnumber) {
      this.alert('warning', 'No cuenta con Número de Devolución', '');
      return;
    }
    if (!this.userChecks.accountnumberpayreturn) {
      this.alert(
        'warning',
        'No cuenta con Número Cuenta Origen Devolución',
        ''
      );
      return;
    }
    if ((this.form.controls['checkAmount'].value ?? 0) === 0) {
      this.alert('warning', 'Debe haber algun importe para el Cheque', '');
      return;
    }
    if (this.form.controls['bankAccount'].value == null) {
      this.alert(
        'warning',
        'Debe especificar la cuenta',
        'De donde se hace la salida del Cheque'
      );
      return;
    }
    if (this.form.controls['check'].value == null) {
      this.alert('warning', 'Debe ingresar el Folio del Cheque a Devolver', '');
      return;
    }
    if (this.form.controls['expeditionDate'].value == null) {
      this.alert(
        'warning',
        'Debe especificar la Fecha de Cobro del Cheque',
        ''
      );
      return;
    }
    if (this.form.controls['beneficiary'].value == null) {
      this.alert('warning', 'Debe especificar el Beneficiario del Cheque', '');
      return;
    }

    concept = await firstValueFrom(
      this.goodParametersService.getById('CONCPTRASP').pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => of({ initialValue: null })),
        map(x => (x ? x.initialValue : null))
      )
    );
    console.log(concept);

    if (concept === null) {
      this.alert(
        'warning',
        'No se tiene definido el concepto',
        'Con el que se hara la afectación en la Cuenta Bancaria Correspondiente'
      );
      return;
    }
    this.alertQuestion(
      'warning',
      'Traspasar',
      '¿Seguro que desea traspasar el Movimiento?'
    ).then(question => {
      if (question.isConfirmed) {
        const user = this.authService.decodeToken() as any;
        console.log(user);
        let bodyMov = {
          dateMotion: this.form.controls['collectionDate'].value,
          userinsert: user.name,
          numberAccount: this.userChecks.accountnumberpayreturn,
          postDiverse: this.form.controls['checkAmount'].value,
          numberReturnPayCheck: this.userChecks.devolutionnumber,
          dateInsertion: new Date(),
          cveConcept: concept,
        };
        this.createMovementsAccounts(bodyMov);
      }
    });
    // el valor de la etiqueta que se va a crear cambia a un estado de TRASPASADO
  }

  createMovementsAccounts(body: any) {
    //this.accountMovementService.create
    this.accountMovementService
      .create(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.userChecks.accounttras = 'TRASPASADO';
          this.accountMovementService
            .updateUserChecks(+this.userChecks.devolutionnumber, {
              accounttras: 'TRASPASADO',
            })
            .subscribe({
              next: response => {
                this.alert('success', 'Traspaso', 'Realizado correctamente');
                this.validTras = false;
              },
              error: err => {
                this.userChecks.accounttras = null;
              },
            });
        },
        error: (error: any) => {},
      });
  }
}
