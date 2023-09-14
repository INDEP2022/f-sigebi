import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  of,
  take,
  takeUntil,
} from 'rxjs';
import { AccountmvmntEndpoint } from 'src/app/common/constants/endpoints/accountmvmnt-endpoint';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IAccountDetailInd,
  IAccountDetailIndNotCheck,
} from 'src/app/core/models/ms-account-movements/account-detail-ind';
import { IUserChecks } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { IPupCalculateDevolutionResult } from 'src/app/core/models/ms-parametergood/parameters.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ChecksDevolutionService } from 'src/app/core/services/ms-account-movements/checks-devolution.service';
import { DetailsIndMovementService } from 'src/app/core/services/ms-account-movements/details-ind-movement.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { DetailInterestReturnService } from 'src/app/core/services/ms-deposit/detail-interest-return.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  firstFormatDate,
  firstFormatDateToDate,
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
  secondFormatDate,
} from 'src/app/shared/utils/date';
import { DepositAccountStatementModalComponent } from '../deposit-account-statement-modal/deposit-account-statement-modal.component';
import { DepositAccountStatementParameterComponent } from '../deposit-account-statement-parameter/deposit-account-statement-parameter.component';
import {
  columnsAccounts,
  columnsAccountsNotCheck,
  columnsMovements,
} from './columns';

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
  scheduledFecReturn: Date;
  check: IAccountDetailInd;
  account: IAccountDetailIndNotCheck;
  disabled = true;
  // accountPayReturn: number;
  updatePupReturnsByDates = false;
  validDetail: boolean = false;
  validCheck: boolean = false;
  validTras: boolean = false;
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
  columnsMovementType = columnsMovements;
  columnsAccounts = columnsAccountsNotCheck;
  columnsDevolution = columnsAccounts;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private screenStatusService: ScreenStatusService,
    private goodParametersService: GoodParametersService,
    public accountMovementService: AccountMovementService,
    private datePipe: DatePipe,
    public bankAccountService: BankAccountService,
    private parameterService: ParametersService,
    private detailInterestReturnService: DetailInterestReturnService,
    private authService: AuthService,
    public checkDevolutionService: ChecksDevolutionService,
    public detailsIndMovementService: DetailsIndMovementService
  ) {
    super();
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

  async changeAccount(account: IAccountDetailIndNotCheck) {
    console.log(account);
    if (account) {
      this.validCheck = true;
      this.validDetail = true;
      this.validTras = true;
      this.account = account;
      await this.getSetReturn();
      await this.calculateReturn();
      await this.detailReturn();
    } else if (account == undefined) {
      this.clean();
    }
  }

  async changeChecks(event: IAccountDetailInd) {
    console.log(event);
    this.form.reset();
    if (event) {
      this.validCheck = true;
      this.validDetail = true;
      this.validTras = true;
      //this.setAccount = true;
      this.check = event;
      const filterParams = new FilterParams();
      filterParams.limit = 1000000;
      if (this.check.accountnumberpayreturn) {
        filterParams.addFilter(
          'accountPayReturnNumber',
          this.check.accountnumberpayreturn
        );
      } else {
        filterParams.addFilter(
          'accountPayReturnNumber',
          this.check.accountnumberpayreturn,
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
      this.devolutionnumber.setValue(event.devolutionnumber);
      await this.getSetReturn();
      await this.calculateReturn();
      await this.detailReturn();

      // this.getFilterAccount(
      //   event.accountOriginDepositNumber,
      //   event.motionOriginDepositNumber
      // );
      //this.getAccountMovement();

      //this.maxDate = this.form.controls['cutoffDate'].value;
      //ESTO ES UNA FECHA DE PRUEBA Y ALTERADA
      // this.form.controls['cutoffDate'].setValue(new Date());
      //this.validDate();
    } else if (event == undefined) {
      this.clean();
    }
  }

  public updateCalculateData() {
    setTimeout(() => {
      let subTotal = +this.toReturn + +this.form.get('interestCredited').value;
      this.form.get('subTotal').setValue(subTotal);
      let checkAmount = subTotal;
      if (this.costsAdmon.value) {
        checkAmount -= +(this.costsAdmon.value + '');
      }
      if (this.associatedCosts.value) {
        checkAmount -= +(this.associatedCosts.value + '');
      }
      this.form.get('checkAmount').setValue('checkAmount');
    }, 500);
  }

  prepareForm() {
    this.form = this.fb.group({
      movementNumber: [null],
      accountTras: [null],
      account: [null, Validators.required],
      accountKey: [null, Validators.required],
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
      accountNumberTransfer: [null],
      transferDate: [null, Validators.required],
      cutoffDate: [null, Validators.required],
      toReturn: [null, Validators.nullValidator],
      interestCredited: [null, Validators.nullValidator],
      subTotal: [null, Validators.nullValidator],
      costsAdmon: [null, Validators.nullValidator],
      associatedCosts: [null, Validators.nullValidator],
      checkAmount: [null, Validators.nullValidator],
      registerNumber: [null],
      checkType: ['NORMAL', Validators.nullValidator],
      bankAccount: [null, Validators.required],
      check: [null, Validators.required],
      beneficiary: [null, Validators.nullValidator],
      bankCheck: [null, Validators.nullValidator],
      expeditionDate: [null, Validators.required],
      collectionDate: [null, Validators.required],
      fileNumber: [null],
      goodId: [null],
      expedientFilter: [null],
      instrument: [],
      interestReal: [null],
      rateDear: [null],
      estimatedInterest: [null],
    });
    this.returnChecks(new ListParams());
    this.getParameters();
    // this.form.controls['depositDate'].disable();
    //this.validation();
  }

  get registerNumber() {
    return this.form.get('registerNumber');
  }

  get accountNumberTransfer() {
    return this.form.get('accountNumberTransfer');
  }

  get accountKey() {
    return this.form.get('accountKey');
  }

  get beneficiary() {
    return this.form.get('beneficiary');
  }

  get checkAmount() {
    return this.form.get('checkAmount');
  }

  get checkType() {
    return this.form.get('checkType');
  }

  get toReturn() {
    return this.form.get('toReturn');
  }

  get rateDear() {
    return this.form.get('rateDear');
  }

  get interestReal() {
    return this.form.get('interestReal');
  }

  get estimatedInterest() {
    return this.form.get('estimatedInterest');
  }

  get interestCredited() {
    return this.form.get('interestCredited');
  }

  get costsAdmon() {
    return this.form.get('costsAdmon');
  }

  get associatedCosts() {
    return this.form.get('associatedCosts');
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

  get accountTras() {
    return this.form.get('accountTras');
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
    this.validCheck = false;
    this.validDetail = false;
    this.validTras = false;
    this.check = null;
    this.account = null;
    this.scheduledFecReturn = null;
    this.disabled = true;
    this.checksDevolution = [];
    this.form.reset();
    this.checkType.setValue('NORMAL');
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
  }

  changeChecks2(event: any) {
    console.log(event);
  }

  get userChecks(): any {
    return this.check ? this.check : this.account ? this.account : null;
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
    const checkType = this.checkType.value;
    console.log(checkType);

    if (!checkType) {
      return;
    }
    if (checkType === 'INTERES') {
      const params = new FilterParams();
      params.addFilter('motionOriginDepositNumber', this.movementNumber.value);
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
    // console.log(
    //   +this.userChecks.returnamount - +this.userChecks.creditedinterest
    // );
    this.updatePupReturnsByDates = false;
    // this.disabledAccount = true;
    // this.disabledMovement = true;
    // debugger;
    console.log(this.userChecks);
    if (this.userChecks.bankkey) {
      this.form.controls['bank'].setValue(this.userChecks.bankkey);
    }
    if (this.userChecks.accountnumberorigindeposit) {
      this.accountnumberorigindeposit.setValue(
        this.userChecks.accountnumberorigindeposit
      );
    }
    if (this.userChecks.accountnumber) {
      this.accountNumber.setValue(this.userChecks.accountnumber);
    }
    if (this.userChecks.accountkey) {
      this.accountKey.setValue(this.userChecks.accountkey);
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
      this.expeditionDate.setValue(formatDateReturn);
    }

    if (this.userChecks.accountnumberpayreturn) {
      this.form.controls['bankAccount'].setValue(this.userChecks.accountkey);
      this.form.controls['bankCheck'].setValue(this.userChecks.bankkey);
      this.accountnumberpayreturn.setValue(
        this.userChecks.accountnumberpayreturn
      );
    }
    if (this.userChecks.accountTras)
      this.accountTras.setValue(this.userChecks.accountTras);

    if (this.userChecks.coinkey)
      this.form.controls['currency'].setValue(this.userChecks.coinkey);
    if (this.userChecks.goodnumber)
      this.goodId.setValue(this.userChecks.goodnumber);
    if (this.userChecks.description)
      this.goodDescription.setValue(this.userChecks.description);
    if (this.userChecks.status) this.status.setValue(this.userChecks.status);
    if (this.userChecks.expedientnumber)
      this.expedient.setValue(this.userChecks.expedientnumber);
    if (this.userChecks.devolutionnumber)
      this.devolutionnumber.setValue(this.userChecks.devolutionnumber);
    if (this.userChecks.deposit)
      this.form.controls['amount'].setValue(this.userChecks.deposit);
    if (this.userChecks.returnamount) {
      let subTotal: number =
        +this.userChecks.returnamount -
        +this.userChecks.expensesadmon -
        +this.userChecks.associatedexpenses;
      this.toReturn.setValue(+subTotal - +this.userChecks.creditedinterest);
      this.checkAmount.setValue(this.userChecks.returnamount);
      this.form.get('subTotal').setValue(subTotal);
    } else {
      if (this.userChecks.depositnumber)
        this.toReturn.setValue(this.userChecks.depositnumber);
    }
    if (this.userChecks.associatedexpenses)
      this.associatedCosts.setValue(this.userChecks.associatedexpenses);
    if (this.userChecks.expensesadmon)
      this.costsAdmon.setValue(this.userChecks.expensesadmon);
    if (this.userChecks.creditedinterest)
      this.interestCredited.setValue(this.userChecks.creditedinterest);
    if (this.userChecks.interestcalculationdate) {
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
      this.form.controls['transfDate'].setValue(formatTrans);
      this.form.controls['transferDate'].setValue(formatTrans);
    }
    if (this.userChecks.interestcalculationdate) {
      const date1 = new Date(this.userChecks.movementdate);
      const datePipe1 = new DatePipe('en-US');
      const formatMov = datePipe1.transform(date1, 'dd/MM/yyyy', 'UTC');
      this.form.controls['depositDate'].setValue(formatMov);
    }

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
    if (this.userChecks.checktype)
      this.checkType.setValue(this.userChecks.checktype);
    if (this.userChecks.checkfolio)
      this.form.controls['check'].setValue(this.userChecks.checkfolio);
    if (this.userChecks.checkpayee)
      this.beneficiary.setValue(this.userChecks.checkpayee);
    if (this.userChecks.expeditioncheckdate)
      this.expeditionDate.setValue(
        this.formatDate(this.userChecks.expeditioncheckdate)
      );
    if (this.userChecks.checkcashingdate)
      this.collectionDate.setValue(
        this.formatDate(this.userChecks.checkcashingdate)
      );
    if (this.userChecks.nameindicated)
      this.form.controls['indicated'].setValue(this.userChecks.nameindicated);
    if (this.userChecks.preliminaryinvestigation)
      this.form.controls['avPrevious'].setValue(
        this.userChecks.preliminaryinvestigation
      );
    if (this.userChecks.criminalcause)
      this.form.controls['criminalCase'].setValue(
        this.userChecks.criminalcause
      );
    // let subTotal: number =
    //   Number(this.toReturn.value) +
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

  getParameters() {
    this.goodParametersService
      .getById('DIASCALINT')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((data: { initialValue: string }) => {
        let anual = Number(data.initialValue);
        if (anual === null) {
          //NO SE PUEDE OPERAR LA PANTALLA
          this.alert(
            'warning',
            'No se tiene definido el parametro de dias x año',
            'No es posible operar la pantalla'
          );
        } else if (anual === 0) {
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
          this.accountnumberorigindeposit.value &&
          this.accountnumberpayreturn.value
        ) {
          await firstValueFrom(
            this.accountMovementService.update({
              dateCalculationInterests:
                this.form.controls['transferDate'].value,
              accountNumber: this.accountNumber.value,
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
          this.accountnumberorigindeposit.value &&
          this.accountnumberpayreturn.value
        ) {
          await firstValueFrom(
            this.accountMovementService.update({
              dateCalculationInterests:
                this.form.controls['transferDate'].value,
              accountNumber: this.accountNumber.value,
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
      (this.accountTras.value && this.accountTras.value === 'TRASPASADO') ||
      (this.form.get('bankAccount').value &&
        this.form.get('check').value &&
        this.expeditionDate.value &&
        this.collectionDate.value)
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
      this.beneficiary.enable({
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
        this.toReturn.value &&
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
      this.expeditionDate.setValue(date);
      // this.form
      if (
        this.toReturn.value &&
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

  get pathBankAccount() {
    return (
      AccountmvmntEndpoint.BasePath +
      '/api/v1/' +
      AccountmvmntEndpoint.getAccount +
      '?filter.accountType=$eq:DEVOLUCIONES' +
      '&filter.cveCurrency=' +
      (this.form.get('currency').value ?? 'MN') +
      (this.accountnumberpayreturn
        ? this.accountnumberpayreturn.value
          ? '&filter.accountNumber=$eq:' + this.accountnumberpayreturn.value
          : ''
        : '')
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
    console.log(event);
    if (event) {
      this.form.get('bankCheck').setValue(event.cveBank);
      this.accountnumberpayreturn.setValue(event.accountNumber);
      this.registerNumber.setValue(event.registerNumber);
      this.accountNumberTransfer.setValue(event.accountNumberTransfer);
    } else {
      this.form.get('bankCheck').setValue(null);
      this.accountnumberpayreturn.setValue(null);
      this.registerNumber.setValue(null);
      this.accountNumberTransfer.setValue(null);
    }
  }

  async validComplementary() {
    let ok = true;
    if (this.movementNumber.value === null) {
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
    if ((this.checkAmount.value ?? 0) == 0) {
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
    if (this.expeditionDate.value == null) {
      this.alert(
        'warning',
        'Debe Especificar',
        'La Fecha de Expedición del Cheque'
      );
      return false;
    }
    if (this.beneficiary.value == null) {
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
    if (this.checkType.value == 'INTERES') {
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
      ] = `$eq:${this.movementNumber.value}`;
      params['filter.checkType'] = `$eq:INTERES`;
      let count: number = await firstValueFrom(
        this.accountMovementService.getAllUsersChecks(params).pipe(
          takeUntil(this.$unSubscribe),
          catchError(x => of({ count: 0 })),
          map((x: any) => (x ? x.count ?? 0 : 0))
        )
      );
      if (count > 0) {
        ok = false;
      }
      if (!ok) {
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
    let importeSinInteres = this.toReturn.value;
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
      this.rateDear.setValue(results.tasa_estimada);
      this.interestReal.setValue(results.interes_real);
      this.estimatedInterest.setValue(results.interes_estimado);
      this.interestCredited.setValue(results.interes_acreditado);
      this.form.controls['subTotal'].setValue(+results.di_subtotal);
      this.checkAmount.setValue(+results.importe_devolucion);
      this.costsAdmon.setValue(results.gastos_admon ?? 0);
      this.associatedCosts.setValue(results.gastos_asociados ?? 0);
    }
  }

  private async detailReturn() {
    // debugger;
    if (!this.updatePupReturnsByDates) {
      return null;
    }
    let no_devolucion: any = this.devolutionnumber.value;
    if (no_devolucion) {
      no_devolucion = +(this.devolutionnumber.value + '');
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

    let importe_sin_interes = this.toReturn.value;
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
    let tipo_cheque = this.checkType.value;
    let body = {
      fec_corte_devolucion,
      no_devolucion,
      ti_fec_inicio_interes,
      tipo_cheque,
      importe_sin_interes,
      di_moneda_deposito,
      di_instrumento,
      no_movimiento_origen_deposito: this.accountnumberorigindeposit.value,
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

  private async insert() {
    const preInsert = await this.preInsert();
    if (preInsert) {
      let returnNumber = await firstValueFrom(
        this.accountMovementService.getNextReturnNumber().pipe(
          take(1),
          catchError(x => {
            console.log(x);
            this.alert('error', 'Cheque complementario', x);
            return of(null);
          }),
          map(x => {
            return x ? x.max : null;
          })
        )
      );
      return returnNumber;
      // return await firstValueFrom(
      //   this.accountMovementService
      //     .createUserChecks({
      //       returnNumber,
      //       accountOriginDepositNumber: this.accountNumber.value,
      //       motionOriginDepositNumber: this.movementNumber.value,
      //       courtReturnDate: this.cutoffDate.value,
      //       amountWithoutInterest: this.toReturn.value,
      //       rateDear: this.rateDear.value,
      //       interestReal: this.interestReal.value,
      //       interestDear: this.estimatedInterest.value,
      //       billsadmin: this.costsAdmon.value,
      //       interestaccredited: this.interestCredited.value,
      //       billsAssociates: this.associatedCosts.value,
      //       amountReturn: this.checkAmount.value,
      //       accountPayReturnNumber: this.accountnumberpayreturn.value,
      //       expeditionCheckDate: this.expeditionDate.value,
      //       InvoiceCheck: this.checkAmount.value,
      //       paymentCheckDate: this.collectionDate.value,
      //       piercedTOAccount: this.accountNumberTransfer.value,
      //       beneficiaryCheck: this.beneficiary.value,
      //       checkType: this.checkType.value,
      //       registerNumber: this.registerNumber.value,
      //       nbOrigin: null,
      //     })
      //     .pipe(
      //       take(1),
      //       catchError(x => of({ data: null, message: x }))
      //     )
      // );
    } else {
      return null;
    }
  }

  async interestCheck() {
    this.loader.load = true;
    // if (!this.userChecks.devolutionnumber) {
    //   this.alert(
    //     'error',
    //     'Detalle de Devolución',
    //     'Falta Número de Devolución'
    //   );
    //   this.loader.load = false;
    //   return;
    // }
    let priorInterest: number;
    const valid = await this.validComplementary();
    if (!valid) {
      this.loader.load = false;
      return;
    }
    const newDevolution = await this.insert();
    console.log(newDevolution);
    if (newDevolution === null) {
      // this.alert('error', 'Cheque complementario', newDevolution.message);
      this.loader.load = false;
      return;
    }
    // return;
    priorInterest = this.interestCredited.value;

    this.form.controls['check'].setValue(null);
    this.expeditionDate.setValue(null);
    this.collectionDate.setValue(null);
    this.accountTras.setValue(null);
    await this.calculateReturn();
    if ((priorInterest = this.interestCredited.value)) {
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
        this.devolutionnumber.setValue(seqNextVal.nextval);
      }
      this.checkType.setValue('INTERES');
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
          .getById(this.devolutionnumber.value)
          .pipe(
            takeUntil(this.$unSubscribe),
            catchError(x => of({ data: [] })),
            map(x => (x ? (x.data ? x.data : []) : []))
          )
      );
      let interestaccredited = 0;
      for (let i = 0; i < resp.length; i++) {
        console.log(resp);
        interestaccredited += resp[i].interest;
      }
      if (resp.length > 0) {
        this.interestCredited.setValue(interestaccredited);
      }
      this.toReturn.setValue(0);
      this.form.controls['subTotal'].setValue(this.interestCredited.value);
      this.costsAdmon.setValue(0);
      this.associatedCosts.setValue(0);
      this.checkAmount.setValue(this.interestCredited.value);
      this.form.controls['transferDate'].disable({
        onlySelf: true,
        emitEvent: false,
      });
      this.form.controls['cutoffDate'].disable({
        onlySelf: true,
        emitEvent: false,
      });
      this.beneficiary.disable({
        onlySelf: true,
        emitEvent: false,
      });
      this.loader.load = false;
      this.alert('success', 'Cheque Complementario', 'Creado correctamente');
    }
    // llamar al servicio de deposit
  }

  detailCalculation() {
    const cuenta_origen_deposito = this.accountNumber.value;
    if (cuenta_origen_deposito === null) {
      this.alert('warning', 'Debe seleccionar un deposito primero', '');
    } else {
      //this.getReturnNumber(this.userChecks.returnNumber);
      this.detailInterestReturnService
        .getById(this.devolutionnumber.value)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: (resp: { data: any }) => {
            let rea = {
              data: resp.data,
              devolutionnumber: this.devolutionnumber.value,
            };
            this.openForm(rea);
          },
        });
    }
  }

  async transferMov() {
    let concept: string = null;
    // crear en HTML etiqueta accounttras;
    if (this.accountTras.value == 'TRASPASADO') {
      this.alert('warning', 'Ya ha sido traspasado', '');
      return;
    }
    if (!this.devolutionnumber.value) {
      this.alert('warning', 'No cuenta con Número de Devolución', '');
      return;
    }
    if (!this.accountnumberpayreturn.value) {
      this.alert(
        'warning',
        'No cuenta con Número Cuenta Origen Devolución',
        ''
      );
      return;
    }
    if ((this.checkAmount.value ?? 0) === 0) {
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
    if (this.expeditionDate.value == null) {
      this.alert(
        'warning',
        'Debe especificar la Fecha de Cobro del Cheque',
        ''
      );
      return;
    }
    if (this.beneficiary.value == null) {
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
          dateMotion: this.collectionDate.value,
          userinsert: user.name,
          numberAccount: this.accountnumberpayreturn.value,
          postDiverse: this.checkAmount.value,
          numberReturnPayCheck: this.devolutionnumber.value,
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
          this.accountTras.setValue('TRASPASADO');
          this.accountMovementService
            .updateUserChecks(+this.devolutionnumber.value, {
              accounttras: 'TRASPASADO',
            })
            .subscribe({
              next: response => {
                this.alert('success', 'Traspaso', 'Realizado correctamente');
                this.validTras = false;
              },
              error: err => {
                this.accountTras.setValue(null);
              },
            });
        },
        error: (error: any) => {},
      });
  }
}
