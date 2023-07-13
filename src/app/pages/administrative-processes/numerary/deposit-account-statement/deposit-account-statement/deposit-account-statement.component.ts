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
import {
  addMonths,
  differenceInCalendarMonths,
  differenceInDays,
  differenceInMonths,
  endOfMonth,
  format,
  lastDayOfMonth,
  parse,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IAccountDetailInd } from 'src/app/core/models/ms-account-movements/account-detail-ind';
import { IGood } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { DetailInterestReturnService } from 'src/app/core/services/ms-deposit/detail-interest-return.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { PaymentServicesService } from 'src/app/core/services/ms-paymentservices/payment-services.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  transferred: string = '';
  ok: boolean = false;
  instrumentAccount: string;
  scheduledFecReturn: Date;
  userChecks: IAccountDetailInd;
  rea: any;
  accountPayReturn: number;
  transferAccount: number;
  validDetail: boolean = false;
  validCheck: boolean = false;
  validTras: boolean = false;
  setAccount: boolean = false;
  realInterest: number;
  estimatedInterest: number;
  estimatedRate: string;
  paramsActNavigate = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsNavigate: number = 0;
  newLimitparamsActNavigate = new FormControl(1);
  tasa: number;
  anio: number;
  mes: number;
  dataGoodAct = new LocalDataSource();
  noReturn: number;
  dateEnd: Date;
  balance: number;
  interestaccredited: number;
  form2: FormGroup;
  depositDate: Date;
  importe_sin_interes: number;
  fec_corte_devolucion: string | Date;
  cutoffDate: Date;
  dateTransfer: Date;
  transferDate: Date;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private goodService: GoodService,
    private goodParametersService: GoodParametersService,
    private screenStatusService: ScreenStatusService,
    private accountMovementService: AccountMovementService,
    private datePipe: DatePipe,
    private bankAccountService: BankAccountService,
    private expedientService: ExpedientService,
    private detailInterestReturnService: DetailInterestReturnService,
    private paymentServicesService: PaymentServicesService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    //this.getGood(new ListParams());
    /*this.paramsActNavigate
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        console.log(params);
        this.newLimitparamsActNavigate = new FormControl(params.limit);
        //this.getGoodsActFn();
        //console.log();
        this.returnChecks(new ListParams());
      });*/

    /////////////////////////////////////////////////////////////
    /*
    this.paramsActNavigate
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.loading = true;
        this.dataGoodAct.load([]);
        //this.clearInputs();
        const paramsF = new FilterParams();
        paramsF.page = params.page;
        paramsF.limit = 1;
        paramsF.addFilter('numFile', this.form.get('expediente').value);
        paramsF.addFilter(
          'typeProceedings',
          'ENTREGA,DECOMISO',
          SearchFilter.IN
        ); //!Un in

        this.accountMovementService.getAllUsersChecks(paramsF.getParams()).subscribe({
          next: data => {
            console.log(data.data);
            console.log(data);
            const dataRes = JSON.parse(JSON.stringify(data.data[0]));
            this.fillIncomeProceeding(dataRes, '');
            this.accountChecksSelect = new DefaultSelect(data.data, data.count);
          },
          error: error => {
            this.accountChecksSelect = new DefaultSelect();
          },
        });


        this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
          res => {
            console.log(res);
            const dataRes = JSON.parse(JSON.stringify(res.data[0]));
            this.fillIncomeProceeding(dataRes, '');
          },
          err => {
            this.loading = false;
          }
        );
      });*/
  }
  prepareForm() {
    this.form = this.fb.group({
      movementNumber: [null, Validators.required],
      account: [null, Validators.required],
      bank: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      amount: [null, Validators.nullValidator],
      depositDate: [null, Validators.nullValidator],
      transfDate: [null, Validators.nullValidator],
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
      expeditionDate: [null, Validators.required],
      collectionDate: [null, Validators.required],
      fileNumber: [null],
      goodId: [null],
      expedientFilter: [null],
      instrument: [],
    });
    this.returnChecks(new ListParams());
    this.getParameters();
    this.form.controls['depositDate'].disable();
    //this.validation();
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

  get expedientFilter() {
    return this.form.get('expedientFilter');
  }

  changeGood(good: IGood) {
    console.log(good);
    this.goodIdSearch = null;
    this.goodDescription.setValue(good.description);
    this.status.setValue(good.status);
    this.di_fec_programada_devolucion = good.dateRenderDecoDev as string;
  }

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
    this.accountMovementService
      .getDetailsInd(params, body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          console.log(data.data);
          this.accountChecksSelect = new DefaultSelect(data.data, data.count);
        },
        error: error => {
          this.accountChecksSelect = new DefaultSelect();
        },
      });
  }

  changeChecks(event: any) {
    console.log(event);
    if (event) {
      this.validCheck = true;
      this.validDetail = true;
      this.validTras = true;
      //this.setAccount = true;
      this.userChecks = event;
      this.getSetReturn();
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

  private getSetReturn() {
    console.log(
      +this.userChecks.returnamount - +this.userChecks.creditedinterest
    );

    this.accountPayReturn = this.userChecks.accountnumberpayreturn;
    const datePipeReturn = new DatePipe('en-US');
    const formatDateReturn = datePipeReturn.transform(
      new Date(this.userChecks.scheduleddatebyconfiscationreturn),
      'dd/MM/yyyy',
      'UTC'
    );
    this.scheduledFecReturn = new Date(
      this.userChecks.scheduleddatebyconfiscationreturn
    );
    this.form.controls['cutoffDate'].setValue(formatDateReturn);
    this.form.controls['bank'].setValue(this.userChecks.bankkey);
    if (this.userChecks.accountnumberpayreturn) {
      this.form.controls['bankAccount'].setValue(this.userChecks.bankkey);
      this.form.controls['bankCheck'].setValue(this.userChecks.bankkey);
    }
    this.form.controls['currency'].setValue(this.userChecks.coinkey);
    this.goodId.setValue(this.userChecks.goodnumber);
    this.goodDescription.setValue(this.userChecks.description);
    this.status.setValue(this.userChecks.status);
    this.expedient.setValue(this.userChecks.expedientnumber);
    this.form.controls['amount'].setValue(this.userChecks.deposit);
    this.form.controls['toReturn'].setValue(
      +this.userChecks.returnamount - +this.userChecks.creditedinterest
    );
    this.form.controls['associatedCosts'].setValue(
      this.userChecks.associatedexpenses
    );
    this.form.controls['costsAdmon'].setValue(this.userChecks.expensesadmon);
    this.form.controls['checkAmount'].setValue(this.userChecks.returnamount);
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
    this.form.controls['instrument'].setValue(
      this.userChecks.keyratecalculationinterest
    );

    this.form.controls['checkType'].setValue(this.userChecks.checktype);
    this.form.controls['check'].setValue(this.userChecks.checkfolio);
    this.form.controls['beneficiary'].setValue(this.userChecks.checkpayee);
    this.form.controls['expeditionDate'].setValue(
      this.formatDate(this.userChecks.expeditioncheckdate)
    );
    this.form.controls['collectionDate'].setValue(
      this.formatDate(this.userChecks.checkcashingdate)
    );
    // this.form.controls['indicated'].setValue(this.userChecks.indicatedName);
    this.form.controls['avPrevious'].setValue(
      this.userChecks.preliminaryinvestigation
    );
    this.form.controls['criminalCase'].setValue(this.userChecks.criminalcause);
    let subTotal: number =
      Number(this.form.controls['toReturn'].value) +
      (Number(this.form.controls['interestCredited'].value) ?? 0);
    this.form.controls['subTotal'].setValue(subTotal);
  }

  formatDate(date: string) {
    const formatFecTrans = date;
    const formatTrans = this.datePipe.transform(formatFecTrans, 'yyyy/MM/dd');
    return formatTrans;
  }

  accountDeposit() {
    // console.log(
    //   this.userChecks.accountOriginDepositNumber,
    //   this.userChecks.motionOriginDepositNumber
    // );
    //const noCuentaDeposito = this.userChecks.accountOriginDepositNumber;
    if (!this.userChecks.accountnumber) {
      this.alert(
        'warning',
        'Debe seleccionar los datos de la lista de valores',
        ''
      );
    }
    /* VALIDAR ESTA PARTE CON FORM
    let acount: number;
    //llamar al endpoint de cheque devolucion
    const params = new ListParams();
    params['filter.motionOriginDepositNumber'] = `$eq:${this.userChecks.motionOriginDepositNumber}`;
    this.accountMovementService.getAllUsersChecks(params).subscribe({
      next: data => {
        acount = data.count;
      },
      error: error => {},
    });
    if (acount > 0){
      this.alert(
        'warning',
        'Ya se tienen registrados cheques de devolucion',
        'para el movimiento seleccionado'
      );
      return;

    }*/

    if (this.goodId.value != null) {
      const params = new ListParams();
      params['filter.id'] = `$eq:${this.form.controls['good'].value}`;
      this.goodService
        .getAll(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            console.log(data.data);
            this.form.controls['status'].setValue(data.data[0].status);
            this.scheduledFecReturn = new Date(
              data.data[0].scheduledDateDecoDev
            );
            /*this.scheduledFecReturn =
            this.scheduledFecReturn != null
              ? this.datePipe.transform(this.scheduledFecReturn, 'yyyy/MM/dd')
              : null;
              */
            console.log(data.data[0].scheduledDateDecoDev);
          },
          error: error => {
            this.loading = false;
          },
        });
    }
    console.log(this.instrumentAccount);
    if (this.instrumentAccount == null || this.instrumentAccount == undefined) {
      this.alert(
        'warning',
        'No se tiene una cuenta asociada a los depositos en cuentas concentradoras',
        'para obtener el instrumento en el calculo de intereses'
      );
    } else {
      const params = new ListParams();
      params['filter.accountNumber'] = `$eq:${this.instrumentAccount}`;
      this.bankAccountService
        .getCveBank(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            console.log(resp.count);
            if (resp.count > 0) {
              this.instrumentAccount = resp.data[0].cveInterestCalcRate;
            } else {
              this.alert(
                'warning',
                'No se tiene una cuenta asociada a los depositos en cuentas concentradoras',
                'para obtener el instrumento en el calculo de intereses'
              );
            }
          },
        });
    }
    this.form.controls['transferDate'].setValue(
      this.form.controls['transfDate'].value
    );
    //this.form.controls['toReturn'].setValue(this.form.controls['amount'].value);
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
      .subscribe(data => {
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

  preInsert() {
    const statusBien = this.form.get('status').value;
    if (statusBien) {
      const params = { estatus: statusBien, vc_pantalla: 'FCONADBEDOCTAXIND' };
      this.screenStatusService
        .getAllFiltro(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            if (data.count > 0) {
              this.vb_valid = true;
            }
          },
          error: error => {},
        });
    } else {
      this.alert(
        'warning',
        'No tiene definido un bien estatus',
        'El cual es necesario para registrar la devolución'
      );
      // INTERRUMPIR EL FLUJO
    }
    if (this.vb_valid == false) {
      this.alert(
        'warning',
        'El bien se encuentra en un estatus',
        'En el cual no se permite registrar la devolucion'
      );
      // INTERRUMPIR EL FLUJO
    }

    // VERIFICAR SI VA no-devolucion

    if (this.form.controls['transfDate'].value === null) {
      if (this.form.controls['transferDate'].value != null) {
        //actualizar movimiento de cuentas
        //this.accountMovementService.update();
        //vf_fecha_interses:= : blk_dev.ti_fec_inicio_interes ;
      }
    } else {
      if (
        this.form.controls['transfDate'].value !=
        this.form.controls['transferDate'].value
      ) {
        // actualizar movimiento cuentas
        //this.accountMovementService.update();
        //vf_fecha_interses:= : blk_dev.ti_fec_inicio_interes;
      } else {
        //vf_fecha_interses:= : blk_dev.di_fec_transferencia_deposito;
      }
    }
  }

  preRecord() {
    const traspasadoCuenta = 'TRASPASADO';
    const tiCuentaDevolucion = 0;
    const folioCheque = 0;
    const fecExpedicionCheque = 0;
    const beneficiarioCheque = 0;
    if (
      traspasadoCuenta == 'TRASPASADO' ||
      (tiCuentaDevolucion != null &&
        folioCheque != null &&
        fecExpedicionCheque != null &&
        beneficiarioCheque != null)
    ) {
      // BLOQUEAR LOS SIGUIENTES INPUTS
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

  private getFilterAccount(account: number, mov: number) {
    let body = {
      depOriginAccNumber: account,
      depOriginMovNumber: mov,
    };
    this.accountMovementService
      .createPostQuery(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          if (resp && resp.data) {
            this.bodyPost = resp.data;
            console.log(resp.data);
            this.fillOut();
            this.importe_sin_interes = this.bodyPost[0].deposito;
            // this.accountDeposit();
            // this.setInstrument();
            //console.log(this.instrumentAccount);
          }
        },
      });
    console.log(this.instrumentAccount);
    //return
  }

  setInstrument() {
    this.getInstrument(this.bodyPost[0].no_cuenta_traspaso);
    console.log(this.instrument);
  }

  private getAccountMovement(good: string, exp: string) {
    let accont = {
      tiExpQuery: this.form.controls['fileNumber'].value,
      tiQueryGood: this.form.controls['good'].value,
    };
    this.accountMovementService
      .createAccount(accont)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.bodyDep = data.data;
          console.log(this.bodyDep);
          let body = {
            depOriginAccNumber: this.bodyDep[0].no_cuenta,
            depOriginMovNumber: this.bodyDep[0].no_movimiento,
          };
          this.accountMovementService
            .createPostQuery(body)
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe({
              next: resp => {
                this.bodyPost = resp.data;
                this.fillOut();
              },
            });
        },
      });
  }

  updateTransferDate(data: Date) {
    if (data) {
      console.log(data);
      this.transferDate = data;
      if (
        this.transferDate &&
        this.importe_sin_interes &&
        this.fec_corte_devolucion
      ) {
        this.calculateReturn();
        this.detailReturn();
      }

      /*var fechaString = data;
      const partesFecha = fechaString.split("/");
      this.transferDate = new Date(Number(partesFecha[2]), Number(partesFecha[1]) - 1, Number(partesFecha[0]));
      console.log(this.transferDate);*/
    }
  }

  updateCutoffDate(data: Date) {
    if (data) {
      const date = this.scheduledFecReturn;
      const datePipe = new DatePipe('en-US');
      const scheduledFecReturn = datePipe.transform(date, 'dd/MM/yyyy', 'UTC');

      const date1 = data;
      const datePipe1 = new DatePipe('en-US');
      const updateCutoff = datePipe1.transform(date1, 'dd/MM/yyyy', 'UTC');

      if (scheduledFecReturn != updateCutoff) {
        this.alert(
          'warning',
          `Especifico una fecha de corte diferente a la que se tiene programada ${scheduledFecReturn} por lo que esto sera solo una simulacion`,
          ''
        );
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

  fillOut() {
    console.log(this.bodyPost);

    this.form.controls['bank'].setValue(this.bodyPost[0].cve_banco);
    this.form.controls['currency'].setValue(this.bodyPost[0].cve_moneda);
    this.goodId.setValue(this.bodyPost[0].no_bien);

    this.form.controls['amount'].setValue(this.bodyPost[0].deposito);

    //const formatTrans = new Date(this.bodyPost[0].fec_calculo_intereses,'dd/MM/yyyy' ,'UTC');

    const date = new Date(this.bodyPost[0].fec_calculo_intereses);
    const datePipe = new DatePipe('en-US');
    const formatTrans = datePipe.transform(date, 'dd/MM/yyyy', 'UTC');
    var fechaString = formatTrans;
    const partesFecha = fechaString.split('/');
    this.transferDate = new Date(
      Number(partesFecha[2]),
      Number(partesFecha[1]) - 1,
      Number(partesFecha[0])
    );

    const date1 = new Date(this.bodyPost[0].fec_movimiento);
    const datePipe1 = new DatePipe('en-US');
    const formatMov = datePipe1.transform(date1, 'dd/MM/yyyy', 'UTC');

    this.form.controls['transfDate'].setValue(formatTrans);
    this.form.controls['depositDate'].setValue(formatMov);
    this.form.controls['transferDate'].setValue(formatTrans);
    // this.form.controls['account'].setValue(
    //   this.userChecks.accountOriginDepositNumber
    // );
    console.log(this.form.value);

    this.cutoffDate = new Date();

    var fechaString = formatMov;
    const partesFecha1 = fechaString.split('/');
    this.depositDate = new Date(
      Number(partesFecha1[2]),
      Number(partesFecha1[1]) - 1,
      Number(partesFecha1[0])
    );

    console.log(this.transferDate, this.cutoffDate, this.depositDate);

    this.instrumentAccount = this.bodyPost[0].no_cuenta_traspaso;

    if (this.instrumentAccount != null) {
      //this.getInstrument(this.instrumentAccount);
      const params = new ListParams();
      params['filter.accountNumber'] = `$eq:${this.instrumentAccount}`;
      this.bankAccountService
        .getCveBank(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            console.log(resp.data[0].cveInterestCalcRate);
            this.instrument = resp.data[0].cveInterestCalcRate;
            this.form.controls['instrument'].setValue(
              resp.data[0].cveInterestCalcRate
            );
          },
        });
    }
    //Averiguar no_cuenta_paga_devolucion
    console.log(this.userChecks.accountnumberpayreturn);
    if (this.userChecks.accountnumberpayreturn != null) {
      const params = new ListParams();
      params[
        'filter.accountNumber'
      ] = `$eq:${this.userChecks.accountnumberpayreturn}`;
      // this.bankAccountService
      //   .getCveBank(params)
      //   .pipe(takeUntil(this.$unSubscribe))
      //   .subscribe({
      //     next: resp => {
      //       console.log(resp);
      //       this.form.controls['bankAccount'].setValue(resp.data[0].cveAccount);
      //       this.transferAccount = resp.data[0].accountNumberTransfer;
      //       this.form.controls['bank'].setValue(resp.data[0].cveBank);
      //     },
      //     error: err => {},
      //     //SETEAR A LAS ETIQUETAS
      //     //cve_cuenta no_cuenta_traspaso cve_banco
      //   });
    }

    if (this.bodyPost[0].no_bien != null) {
      // this.goodService
      //   .getById2(this.bodyPost[0].no_bien)
      //   .pipe(takeUntil(this.$unSubscribe))
      //   .subscribe({
      //     next: resp => {
      //       console.log(resp);
      //       this.getGood(new ListParams(), this.bodyPost[0].no_bien);
      //       this.form.controls['good'].setValue(this.bodyPost[0].no_bien);
      //       this.form.controls['status'].setValue(resp.status);
      //       this.form.controls['proceedings'].setValue(resp.fileNumber);
      //       this.scheduledFecReturn = new Date(resp.scheduledDateDecoDev);
      //       /*this.scheduledFecReturn =
      //       this.scheduledFecReturn != null
      //         ? this.datePipe.transform(this.scheduledFecReturn, 'yyyy/MM/dd')
      //         : null;*/
      //       console.log(this.scheduledFecReturn);
      //       //this.form.controls['cutoffDate'].setValue(this.scheduledFecReturn);
      //     },
      //   });
    }
    // buscar el dato de expediente_deposito
    console.log(this.expedient.value);
    if (this.expedient.value != null) {
      const params = new ListParams();
      params['filter.id'] = `$eq:${this.expedient.value}`;
      // this.expedientService
      //   .getAll(params)
      //   .pipe(takeUntil(this.$unSubscribe))
      //   .subscribe({
      //     next: resp => {
      //       console.log(resp);
      //       this.form.controls['indicated'].setValue(
      //         resp.data[0].indicatedName
      //       );
      //       this.form.controls['avPrevious'].setValue(
      //         resp.data[0].preliminaryInquiry
      //       );
      //       this.form.controls['criminalCase'].setValue(
      //         resp.data[0].criminalCase
      //       );
      //       //VARIABLES A SETEARSE nombre_indiciado averiguacion_previa causa_penal
      //     },
      //   });
    }
    let subTotal: number =
      Number(this.form.controls['toReturn'].value) +
      (Number(this.form.controls['interestCredited'].value) ?? 0);
    this.form.controls['subTotal'].setValue(subTotal);
    console.log(subTotal);
    // setear a di_subtotal := :blk_dev.importe_sin_interes + NVL(:blk_dev.interes_acreditado,0);
  }

  validComplementary() {
    this.ok = true;
    if (this.userChecks.movementnumber === null) {
      this.alert(
        'warning',
        'Debe registrar primero un movimiento normal',
        'Para hacer un cheque complementario'
      );
      return;
    }
    if ((this.form.controls['checkAmount'].value ?? 0) == 0) {
      this.alert('warning', 'Debe haber algun importe para el cheque', '');
      return;
    }
    if (this.form.controls['bankAccount'].value == null) {
      this.alert(
        'warning',
        'Debe especificar la cuenta',
        'De donde se hace la salida del cheque'
      );
      return;
    }
    if (this.form.controls['check'].value == null) {
      this.alert(
        'warning',
        'Debe especificar',
        'El folio del cheque a devolver'
      );
      return;
    }
    if (this.form.controls['expeditionDate'].value == null) {
      this.alert(
        'warning',
        'Debe especificar',
        'La fecha de expedicion del cheque'
      );
      return;
    }
    if (this.form.controls['beneficiary'].value == null) {
      this.alert('warning', 'Debe especificar', 'El beneficiario del cheque');
      return;
    }

    if (this.form.controls['cutoffDate'].value != this.scheduledFecReturn) {
      this.alert(
        'warning',
        'Especifico una fecha de corte',
        'Diferente a la programada'
      );
      return;
    }
    if (this.form.controls['checkType'].value == 'INTERES') {
      this.alert(
        'warning',
        'Se encuentra en un cheque complementario',
        'El beneficiario del cheque'
      );
      return;
    } else {
      //GO_BLOCK('blk_dev')
      const params = new ListParams();
      params[
        'filter.motionOriginDepositNumber'
      ] = `$eq:${this.userChecks.movementnumber}`;
      params['filter.checkType'] = `$eq:INTERES`;
      this.accountMovementService
        .getAllUsersChecks(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: data => {
            if (data.count > 0) {
              this.ok = false;
            }
          },
          error: error => {},
        });
      if (!this.ok) {
        this.alert(
          'warning',
          'Ya se tiene registrado un cheque',
          'Complementario a ese movimiento'
        );
        return;
      }
    }
  }

  private calculateReturn() {
    let hoy: Date = this.form.controls['cutoffDate'].value;
    let months: number;
    let annual: number;
    let currentMonth: number;
    let currentYear: number;
    let calculateDays: number;
    let accruedInterest: number;
    let estimatedInterest: number;
    let periodInterest: number;
    let capitalization: number;
    let accumulatedCap: number;
    let dailyRate: number;
    let points: number;
    let anualBasis: number;
    let bills: number;
    let percentage: number;
    let realRate: boolean;
    let estimatedRate: string = '';

    console.log(this.transferDate);
    if (this.form.controls['transfDate'].value != null) {
      accruedInterest = 0;
      estimatedInterest = 0;
      capitalization = this.form.controls['toReturn'].value;
      accumulatedCap = capitalization;
      this.goodParametersService
        .getById('TASAPROYEC')
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            points = Number(resp.initialValue);
          },
        });
      this.goodParametersService
        .getById('DIASCALINT')
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            anualBasis = Number(resp.initialValue);
          },
        });
      months = this.obtenerCantidadMeses(hoy, this.transferDate);
      console.log(months);
      for (let i_mes_actual = 0; i_mes_actual < months; i_mes_actual++) {
        //const monthYear = new Date(this.form.controls['transferDate'].value);
        currentMonth = addMonths(this.transferDate, i_mes_actual).getMonth();
        currentYear = addMonths(this.transferDate, i_mes_actual).getFullYear();

        // this.setInstrument();

        let bodyFromRates = {
          diCoinDeposit: this.form.controls['currency'].value,
          vnActualYear: currentYear,
          vnMonthYear: currentMonth,
          diInstrument: this.instrument,
        };

        this.goodParametersService
          .createAccount(bodyFromRates)
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe({
            next: resp => {
              if (
                resp.data[0].anio == currentYear &&
                resp.data[0].mes == currentMonth
              ) {
                realRate = true;
                annual = resp.data[0].tasa;
              } else {
                realRate = false;
                annual = points;
                estimatedRate = annual.toString();
              }
            },
          });

        if (i_mes_actual == 0) {
          if (months > 1) {
            // Calcula la diferencia en días entre el último día del mes y ti_fec_inicio_interes
            //const lastDayMonth = endOfMonth(this.transferDate);
            //calculateDays = differenceInDays(lastDayMonth, this.transferDate);

            const lastDayOfMonth = new Date(
              this.transferDate.getFullYear(),
              this.transferDate.getMonth() + 1,
              0
            ).getDate();
            calculateDays = lastDayOfMonth - this.transferDate.getDate() + 1;
            console.log(calculateDays);
          } else {
            calculateDays =
              hoy.setHours(0, 0, 0, 0) - this.transferDate.setHours(0, 0, 0, 0);
            console.log(calculateDays);
          }
        } else if (i_mes_actual > 0 && i_mes_actual < months - 1) {
          // Obtén la fecha inicial en formato 'ddmmyyyy'
          const initialDate =
            '01' + currentMonth.toString().padStart(2, '0') + currentYear;
          // Convierte la fecha inicial en objetos de tipo Date
          const startDate = new Date(initialDate);
          // Obtén el último día del mes correspondiente a la fecha inicial
          const lastDayMonth = endOfMonth(startDate);
          // Calcula la diferencia en días entre el último día del mes y la fecha inicial
          const differencedays = differenceInDays(lastDayMonth, startDate);
          // Agrega 1 día a la diferencia para incluir el día inicial
          calculateDays = differencedays + 1;
        } else if ((i_mes_actual = months - 1)) {
          const diaActual: number = hoy.getDay(); // Obtiene el día actual como un número
          calculateDays = diaActual;
        }
        dailyRate = annual / anualBasis / 100;
        const resultado: number = capitalization * dailyRate * calculateDays;
        const resultadoRedondeado: number = +resultado.toFixed(2); // Redondea el resultado a 2 decimales
        periodInterest = resultadoRedondeado;
        capitalization = capitalization + periodInterest;
        if (realRate) {
          accruedInterest = (accruedInterest ?? 0) + (periodInterest ?? 0);
          accumulatedCap = (accumulatedCap ?? 0) + (periodInterest ?? 0);
        } else {
          estimatedInterest = estimatedInterest + (periodInterest ?? 0);
        }
      }

      this.getPayment(this.form.controls['good'].value);
      this.realInterest = Number(accruedInterest);
      this.estimatedInterest = Number(estimatedInterest);
      const sumInterest = accruedInterest + estimatedInterest;
      this.form.controls['interestCredited'].setValue(sumInterest);
      const sumSubTot =
        Number(this.form.controls['toReturn'].value) + (sumInterest ?? 0);
      this.form.controls['subTotal'].setValue(sumSubTot);
      const returnCheck =
        Number(sumSubTot) -
        Number(this.form.controls['costsAdmon'].value) -
        Number(this.form.controls['associatedCosts'].value);
      this.form.controls['checkAmount'].setValue(returnCheck);
      this.estimatedRate = estimatedRate;
    }
  }

  getPayment(good: string | number) {
    this.paymentServicesService
      .getById(good)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
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

  detailReturn() {
    let today: Date = this.form.controls['cutoffDate'].value;
    let monthsReview: number;
    let annualRate: number;
    let currentMonth: number;
    let currentYear: number;
    let daysCalculation: number;
    let interestCumulative: number;
    let interestEstimation: number;
    let periodInterest: number;
    let capitalization: number;
    let capitalizationAcum: number;
    let dailyRate: number;
    let points: number;
    let annulBasis: number;
    let expensesAdmvos: number;
    let porcExpensesAdmVos: number;
    let isActualRate: boolean;
    let refundSum: number;
    let row: number = 0;
    let start: Date;
    let end: Date;
    let daysx: number;
    let retex: number;
    let interestx: number;
    let balancex: number;
    let capitalx: number;
    let periodx: string;
    let interestTypex: string;
    let pivotStart: Date;
    let pivotAmount: number;

    if (!this.noReturn) {
      //Le da un nuevo valor
    } else {
      let bodyDelete = {
        returnNumber: this.noReturn,
        row: row,
      };
      this.detailInterestReturnService
        .remove(bodyDelete)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {},
        });
    }

    if (this.form.controls['transferDate'].value) {
      if (this.form.controls['checkType'].value == 'NORMAL') {
        pivotStart = this.form.controls['transferDate'].value;
        pivotAmount = this.form.controls[' toReturn'].value;
      } else {
        this.getCheck(this.userChecks.movementnumber);
        const sumDate = new Date(this.dateEnd);
        sumDate.setDate(this.dateEnd.getDate() + 1);
        pivotStart = sumDate;
        pivotAmount = this.balance;
      }
      interestCumulative = 0;
      interestEstimation = 0;
      capitalization = pivotAmount;
      capitalizationAcum = capitalization;

      this.goodParametersService
        .getById('TASAPROYEC')
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            points = Number(resp.initialValue);
          },
        });
      this.goodParametersService
        .getById('DIASCALINT')
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            annulBasis = Number(resp.initialValue);
          },
        });
      this.goodParametersService
        .getById('GASTOSADMV')
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            porcExpensesAdmVos = +(Number(resp.initialValue) / 100).toFixed(2);
          },
        });
      const fechaInicio = startOfMonth(
        parse(
          '01' +
            pivotStart.toLocaleString('en-US', {
              month: '2-digit',
              year: 'numeric',
            }),
          'ddMMyyyy',
          new Date()
        )
      ); // Convertir vf_pivote_inicio a formato '01mmyyyy' y obtener el primer día del mes
      monthsReview = differenceInMonths(today, fechaInicio) + 1; // Calcular la diferencia en meses y agregar 1

      for (let i_mes_actual = 0; i_mes_actual < monthsReview; i_mes_actual++) {
        currentMonth = parseInt(
          format(addMonths(pivotStart, i_mes_actual), 'MM'),
          10
        );
        currentYear = parseInt(
          format(addMonths(pivotStart, i_mes_actual), 'yyyy'),
          10
        );
        let bodyFromRates = {
          diCoinDeposit: this.form.controls['currency'].value,
          vnActualYear: currentYear,
          vnMonthYear: currentMonth,
          diInstrument: this.instrument,
        };
        //this.getTasas(bodyFromRates);

        if (this.anio == currentYear && this.mes == currentMonth) {
          isActualRate = true;
          annualRate = this.tasa;
        } else {
          isActualRate = false;
          annualRate = points;
        }

        if (i_mes_actual == 0) {
          if (monthsReview > 1) {
            const lastDayMonth = lastDayOfMonth(pivotStart); // Obtener el último día del mes de vf_pivote_inicio
            daysCalculation = differenceInDays(lastDayMonth, pivotStart);
            start = pivotStart;
            end = lastDayMonth;
          } else {
            const inicioTruncado = startOfDay(pivotStart); // Obtener el inicio del día de vf_pivote_inicio
            const hoyTruncado = startOfDay(today); // Obtener el inicio del día de vf_hoy
            daysCalculation = differenceInDays(hoyTruncado, inicioTruncado);
            start = pivotStart;
            end = today;
          }
          if (this.form.controls['checkType'].value == 'INTERES') {
            daysCalculation = daysCalculation + 1;
          }
        } else if (i_mes_actual > 0 && i_mes_actual < monthsReview - 1) {
          const startDate = startOfMonth(
            new Date(currentYear, currentMonth - 1, 1)
          ); // Crear fecha inicial con el primer día del mes
          const endDate = endOfMonth(
            new Date(currentYear, currentMonth - 1, 1)
          ); // Crear fecha final con el último día del mes
          daysCalculation = differenceInDays(endDate, startDate) + 1;
          start = startOfMonth(new Date(currentYear, currentMonth - 1, 1));
          end = endDate;
        } else if (i_mes_actual == monthsReview - 1) {
          daysCalculation = parseInt(format(today, 'dd'), 10);
          start = startOfMonth(today);
          end = today;
        }
        row = row + 1;
        dailyRate = annualRate / annulBasis / 100;
        periodInterest =
          Math.round(capitalization * dailyRate * daysCalculation * 100) / 100;
        capitalx = capitalization;
        capitalization = capitalization + periodInterest;
        periodx =
          currentYear.toString() +
          '-' +
          currentMonth.toString().padStart(2, '0');
        daysx = daysCalculation;
        retex = annualRate;
        interestx = periodInterest;
        balancex = (capitalx ?? 0) + (interestx ?? 0);
        if (isActualRate) {
          interestTypex = 'REAL';
        } else {
          interestTypex = 'ESTIMADO';
        }
        let bodyDetail = {
          returnNumber: this.noReturn,
          row: row,
          interestType: interestTypex,
          period: periodx,
          startDate: start,
          endDate: end,
          days: daysx,
          capital: capitalx,
          rate: retex,
          interest: interestx,
          balance: balancex,
        };
        this.createDetailInterestReturn(bodyDetail);
      }
    }
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
        next: resp => {
          this.dateEnd = resp.data[0].fec_fin;
          this.balance = resp.data[0].saldo;
        },
      });
    //endpoint http://sigebimsdev.indep.gob.mx/deposit/api/v1/detail-interest-return/pubReturnDetail/{depOriginMovNumber}
    //return data;
  }

  interestCheck() {
    let priorInterest: number;
    this.validComplementary();

    priorInterest = this.form.controls['interestCredited'].value;

    this.form.controls['check'].setValue('');
    this.form.controls['expeditionDate'].setValue('');
    this.form.controls['collectionDate'].setValue('');
    this.transferred = '';
    this.calculateReturn();
    if ((priorInterest = this.form.controls['interestCredited'].value)) {
      this.alert(
        'warning',
        'El interes calculado es igual al que ya se ha pagado',
        'Por lo que no es necesario generar ningun cheque complementario'
      );
    } else {
      /*SELECT seq_num_devolucion.nextval
      INTO: blk_dev.no_devolucion
      FROM dual;*/
      this.form.controls['checkType'].setValue('INTERES');
      this.detailReturn();
      this.detailInterestReturnService
        .getById(this.noReturn)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            for (let i = 0; i < resp.data.length; i++) {
              this.interestaccredited = resp.data[i].interest;
            }
            this.form.controls['interestCredited'].setValue(
              this.interestaccredited
            );
          },
        });
    }
    // llamar al servicio de deposit

    this.form.controls['transferDate'].setValue(0);
    /*this.form.controls['subTotal'].setValue(
      this.form.controls['interestCredited'].value
    );*/
    this.form.controls['costsAdmon'].setValue(0);
    this.form.controls['associatedCosts'].setValue(0);
    this.form.controls['checkAmount'].setValue(
      this.form.controls['interestCredited'].value
    );
    this.form.controls['transferDate'].disable();
    this.form.controls['cutoffDate'].disable();
    this.form.controls['beneficiary'].disable();
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
          next: resp => {
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

  transferMov() {
    let concept: string = null;
    // crear en HTML etiqueta traspasado_a_cuenta;
    if (this.transferred == 'TRASPASADO') {
      this.alert('warning', 'Ya ha sido traspasado', '');
      return;
    }
    if ((this.form.controls['amount'].value ?? 0) === 0) {
      this.alert('warning', 'Debe haber algun importe para el cheque', '');
      return;
    }
    if (this.form.controls['bankAccount'].value == null) {
      this.alert(
        'warning',
        'Debe especificar la cuenta',
        'De donde se hace la salida del cheque'
      );
      return;
    }
    if (this.form.controls['check'].value == null) {
      this.alert('warning', 'Debe ingresar el folio del cheque a devolver', '');
      return;
    }
    if (this.form.controls['expeditionDate'].value == null) {
      this.alert(
        'warning',
        'Debe especificar la fecha de cobro del cheque',
        ''
      );
      return;
    }
    if (this.form.controls['beneficiary'].value == null) {
      this.alert('warning', 'Debe especificar el beneficiario del cheque', '');
      return;
    }

    this.goodParametersService
      .getById('CONCPTRASP')
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          concept = resp.initialValue;
        },
      });
    if (concept == null) {
      this.alert(
        'warning',
        'No se tiene definido el concepto',
        'Con el que se hara la afectación en la cuenta bancaria correspondiente'
      );
      return;
    }
    //:blk_dev.di_fec_programada_devolucion := reg.fec_programada_x_deco_devo;
    /*if ( this.form.controls['cutoffDate'].value != this.scheduledFecReturn){
      this.alert('warning','Especifico una fecha de corte diferente a la que se tiene programada','Por lo que no puede realizar el traspaso');
      return;
    }*/
    this.alertQuestion(
      'warning',
      'Traspasar',
      '¿Seguro que desea traspasar el movimiento?'
    ).then(question => {
      if (question.isConfirmed) {
        const user = this.authService.decodeToken() as any;
        console.log(user);
        let bodyMov = {
          dateMotion: this.form.controls['collectionDate'].value,
          userinsert: user,
          numberAccount: this.userChecks.accountnumberpayreturn,
          postDiverse: this.form.controls['checkAmount'].value,
          numberReturnPayCheck: this.userChecks.devolutionnumber,
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
        next: data => {
          this.transferred = 'TRASPASADO';
        },
        error: error => {},
      });
  }
}
