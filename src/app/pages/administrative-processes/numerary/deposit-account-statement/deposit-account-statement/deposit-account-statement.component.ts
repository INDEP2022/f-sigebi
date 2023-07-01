import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { DepositAccountStatementModalComponent } from '../deposit-account-statement-modal/deposit-account-statement-modal.component';

@Component({
  selector: 'app-deposit-account-statement',
  templateUrl: './deposit-account-statement.component.html',
  styles: [],
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
  goodSelect = new DefaultSelect();
  anualBassis: string;
  anual: number;
  vfDate: Date;
  vb_valid: boolean = false;
  searchMode: boolean = false;
  searchConfirm: boolean = false;
  bodyDep: any;
  instrument: string;
  ok: boolean = false;
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
    private expedientService: ExpedientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    //this.getGood(new ListParams());
    this.getParameters();
  }
  prepareForm() {
    this.form = this.fb.group({
      account: [null, Validators.required],
      bank: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      amount: [null, Validators.nullValidator],
      depositDate: [null, Validators.nullValidator],
      transfDate: [null, Validators.nullValidator],
      proceedings: [null, Validators.nullValidator],
      good: [null, Validators.nullValidator],
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

      goodId: [null],
      fileNumber: [null],
    });
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
      data,
      callback: (next: boolean) => {
        if (next) this.getAttributes();
      },
    };
    this.modalService.show(DepositAccountStatementModalComponent, modalConfig);
  }

  getGood(params: ListParams) {
    this.goodService.getAll(params).subscribe({
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
  enableSearchMode() {
    this.searchMode = true;
    //this.onSearchStart.emit(true);
  }

  confirmSearch() {
    console.log('confirmSearch');
    this.getAccountMovement();
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

  changeGood(event: any) {
    console.log(event.scheduledDateDecoDev, event.status);
  }

  getParameters() {
    this.goodParametersService.getById('DIASCALINT').subscribe(data => {
      this.anualBassis = data.initialValue;
      this.anual = Number(this.anualBassis);
      if (this.anual === null) {
        //NO SE PUEDE OPERAR LA PANTALLA
        this.alert(
          'warning',
          'No se tiene definido el parametro de dias x año',
          'no es posible operar la pantalla'
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

  initialize() {
    const statusBien = this.form.get('status').value;
    if (statusBien) {
      const params = { estatus: statusBien, vc_pantalla: 'FCONADBEDOCTAXIND' };
      this.screenStatusService.getAllFiltro(params).subscribe({
        next: data => {
          if (data.data) {
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
    }
    if (this.vb_valid === false) {
      this.alert(
        'warning',
        'El bien se encuentra en un estatus',
        'En el cual no se permite registrar la devolucion'
      );
    }

    // VERIFICAR SI VA no-devolucion

    if (this.form.controls['transfDate'].value === null) {
      if (this.form.controls['transfDate'].value != null) {
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

  getAccountMovement() {
    let accont = {
      tiExpQuery: this.form.controls['fileNumber'].value,
      tiQueryGood: this.form.controls['goodId'].value,
    };
    this.accountMovementService.createAccount(accont).subscribe({
      next: data => {
        this.bodyDep = data.data;
        this.fillOut();
      },
    });
  }

  fillOut() {
    console.log(this.bodyDep);
    this.form.controls['bank'].setValue(this.bodyDep[0].cve_banco);
    this.form.controls['currency'].setValue(this.bodyDep[0].cve_moneda);
    //this.form.controls['good'].setValue(this.bodyDep[0].no_bien);
    this.form.controls['amount'].setValue(this.bodyDep[0].deposito);
    const formatFecTrans = this.bodyDep[0].fec_calculo_intereses;
    const formatTrans = this.datePipe.transform(formatFecTrans, 'yyyy/MM/dd');
    const formatFecMov = this.bodyDep[0].fec_movimiento;
    const formatMov = this.datePipe.transform(formatFecMov, 'yyyy/MM/dd');
    console.log(formatMov);
    this.form.controls['transfDate'].setValue(formatTrans);
    this.form.controls['depositDate'].setValue(formatMov);
    this.form.controls['transferDate'].setValue(formatTrans);
    this.form.controls['account'].setValue(this.bodyDep[0].cve_cuenta);
    console.log(this.bodyDep[0].no_cuenta_traspaso);
    if (this.bodyDep[0].no_cuenta_traspaso != null) {
      const params = new ListParams();
      params[
        'filter.accountNumber'
      ] = `$eq:${this.bodyDep[0].no_cuenta_traspaso}`;
      this.bankAccountService.getCveBank(params).subscribe({
        next: resp => {
          this.instrument = resp.data[0].cveInterestCalcRate;
          console.log(this.instrument);
        },
      });
    }
    //Averiguar no_cuenta_paga_devolucion
    const noCuenta = 0;
    if (noCuenta != null) {
      const params = new ListParams();
      params['filter.accountNumber'] = `$eq:${noCuenta}`;
      this.bankAccountService.getCveBank(params).subscribe({
        //SETEAR A LAS ETIQUETAS
        //cve_cuenta no_cuenta_traspaso cve_banco
      });
    }

    if (this.bodyDep[0].no_bien != null) {
      this.goodService.getById2(this.bodyDep[0].no_bien).subscribe({
        next: resp => {
          console.log(resp);
          this.form.controls['good'].setValue(resp.description);
          this.form.controls['status'].setValue(resp.status);
          this.form.controls['proceedings'].setValue(resp.fileNumber);

          const formatFecTrans = resp.scheduledDateDecoDev;
          const formatTrans =
            formatFecTrans != null
              ? this.datePipe.transform(formatFecTrans, 'yyyy/MM/dd')
              : null;
        },
      });
    }
    // buscar el dato de expediente_deposito
    const di_expedient = 0;
    if (di_expedient != null) {
      const params = new ListParams();
      params['filter.id'] = `$eq:${di_expedient}`;
      this.expedientService.getAll().subscribe({
        next: resp => {
          //VARIABLES A SETEARSE nombre_indiciado averiguacion_previa causa_penal
        },
      });
    }

    // setear a di_subtotal := :blk_dev.importe_sin_interes + NVL(:blk_dev.interes_acreditado,0);
  }

  detailcalculation() {
    const noCuentaOrigenDeposito = 0;
    if (noCuentaOrigenDeposito === null) {
      this.alert('warning', 'Debe seleccionar un deposito primero', '');
    } else {
      /*if(){
        //:di_sum_int_subtotal := NVL(:di_sum_int_real ,0) + NVL(:di_sum_int_estimado,0);
      }*/
    }
  }

  validComplementary() {
    this.ok = true;
    const noMovimientoOrigenDeposito = 0;
    if (noMovimientoOrigenDeposito === null) {
      this.alert(
        'warning',
        'Debe registrar primero un movimiento normal',
        'Para hacer un cheque complementario'
      );
    }
    const importeDevolucion = 0;
    if (importeDevolucion == 0) {
      this.alert('warning', 'Debe haber algun importe para el cheque', '');
    }
    const tiCuentaDevolucion = 0;
    if (tiCuentaDevolucion === null) {
      this.alert(
        'warning',
        'Debe especificar la cuenta',
        'De donde se hace la salida del cheque'
      );
    }
    const folioCheque = 0;
    if (folioCheque === null) {
      this.alert(
        'warning',
        'Debe especificar',
        'El folio del cheque a devolver'
      );
    }
    const fecExpedicionCheque = 0;
    if (fecExpedicionCheque === null) {
      this.alert(
        'warning',
        'Debe especificar',
        'La fecha de expedicion del cheque'
      );
    }

    const beneficiarioCheque = 0;
    if (fecExpedicionCheque === null) {
      this.alert('warning', 'Debe especificar', 'El beneficiario del cheque');
    }

    const fecCorteDevolucion = 0;
    const diFecProgramadaDevolucion = 0;
    if (fecCorteDevolucion != diFecProgramadaDevolucion) {
      this.alert(
        'warning',
        'Especifico una fecha de corte',
        'Diferente a la programada'
      );
    }

    const tipoCheque = 'INTERES';
    if (tipoCheque == 'INTERES') {
      this.alert(
        'warning',
        'Se encuentra en un cheque complementario',
        'El beneficiario del cheque'
      );
    } else {
      //GO_BLOCK('blk_dev')

      if (!this.ok) {
        this.alert(
          'warning',
          'Ya se tiene registradoun cheque',
          'Complementario a ese movimiento'
        );
      }
    }
  }

  calculateReturn() {
    let hoy = this.form.controls['cutoffDate'].value;
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

    console.log(this.instrument);
    if (this.form.controls['transferDate'].value != null) {
      accruedInterest = 0;
      estimatedInterest = 0;
      capitalization = this.form.controls['toReturn'].value;
      accumulatedCap = capitalization;
      this.goodParametersService.getById('TASAPROYEC').subscribe({
        next: resp => {
          points = Number(resp.initialValue);
        },
      });
      this.goodParametersService.getById('DIASCALINT').subscribe({
        next: resp => {
          anualBasis = Number(resp.initialValue);
        },
      });

      const monthsBetween: number = this.calculateMonthsBetween(
        this.form.controls['cutoffDate'].value,
        this.form.controls['transferDate'].value
      );
      const monthsComplete = Math.floor(monthsBetween);
      const result = monthsComplete + 1;
      months = result;
      console.log(months);
      for (let i_mes_actual = 0; i_mes_actual < months; i_mes_actual++) {
        //const mes_actual = i_mes_actual + 1;
        //console.log(`Revisando mes actual: ${mes_actual}`);
        const fechaInicioInteres: Date = new Date(
          this.form.controls['transferDate'].value
        ); // Convertir la fecha a un objeto Date
        const month: Date = new Date(
          fechaInicioInteres.setMonth(
            fechaInicioInteres.getMonth() + i_mes_actual
          )
        ); // Agregar i_mes_actual meses a la fecha
        currentMonth = month.getMonth() + 1;

        const year: Date = new Date(
          fechaInicioInteres.setMonth(
            fechaInicioInteres.getMonth() + i_mes_actual
          )
        ); // Agregar i_mes_actual meses a la fecha
        currentYear = year.getFullYear();
        console.log(this.instrument);

        this.getTasas();
        /*if(){
          realRate = true;
        }else{
          realRate =false;
          annual = anualBasis;
          estimatedRate = annual; 
        }*/

        if ((i_mes_actual = 0)) {
          if (months > 1) {
            const ti_fec_inicio_interes: Date = new Date(); // Asigna aquí la fecha de inicio del período de interés

            const ultimoDiaMes: Date = new Date(
              this.form.controls['transferDate'].value.getFullYear(),
              this.form.controls['transferDate'].value.getMonth() + 1,
              0
            );
            // El código anterior crea una nueva fecha que representa el último día del mes correspondiente a 'ti_fec_inicio_interes'

            const diferenciaMilisegundos: number =
              ultimoDiaMes.getTime() -
              this.form.controls['transferDate'].value.getTime();
            const diferenciaDias: number = Math.floor(
              diferenciaMilisegundos / (1000 * 60 * 60 * 24)
            );
            // Calcula la diferencia de días dividiendo la diferencia en milisegundos entre ambos días por la cantidad de milisegundos en un día (24 * 60 * 60 * 1000)

            calculateDays = diferenciaDias;
          } else {
            const trunc_vf_hoy: Date = new Date(
              hoy.getFullYear(),
              hoy.getMonth(),
              hoy.getDate()
            );
            // Crea una nueva fecha que representa la fecha actual sin la parte de tiempo (hora, minutos, segundos y milisegundos)

            const trunc_ti_fec_inicio_interes: Date = new Date(
              this.form.controls['transferDate'].value.getFullYear(),
              this.form.controls['transferDate'].value.getMonth(),
              this.form.controls['transferDate'].value.getDate()
            );
            // Crea una nueva fecha que representa la fecha de inicio de interés sin la parte de tiempo

            const diferenciaMilisegundos: number =
              trunc_vf_hoy.getTime() - trunc_ti_fec_inicio_interes.getTime();
            const diferenciaDias: number = Math.floor(
              diferenciaMilisegundos / (1000 * 60 * 60 * 24)
            );
            // Calcula la diferencia de días dividiendo la diferencia en milisegundos entre las dos fechas por la cantidad de milisegundos en un día (24 * 60 * 60 * 1000)

            calculateDays = diferenciaDias;
          }
        } else if (i_mes_actual > 0 && i_mes_actual < months - 1) {
          const fechaInicio = new Date(currentYear, currentMonth - 1, 1); // Crea la fecha de inicio del mes actual
          const ultimoDiaMes = new Date(currentYear, currentMonth, 0).getDate(); // Obtiene el último día del mes actual
          const fechaFin = new Date(
            currentYear,
            currentMonth - 1,
            ultimoDiaMes
          ); // Crea la fecha de fin del mes actual
          const diferenciaDias =
            Math.floor(
              (fechaFin.getTime() - fechaInicio.getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1;
          // Calcula la diferencia en días entre las dos fechas y le suma 1
          calculateDays = diferenciaDias;
        } else if ((i_mes_actual = months - 1)) {
          const diaActual: number = hoy.getDate(); // Obtiene el día actual como un número
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

      this.getPayment();
      /* SETEAR A LAS SIGUIENTES VARIABLES
      interes_real
      interes_estimado
      interes_acreditado
      di_subtotal
      importe_devolucion
      tasa_estimda
      */
    }
  }

  calculateMonthsBetween(date1: Date, date2: Date): number {
    const monthsDiff = (date2.getFullYear() - date1.getFullYear()) * 12;
    return monthsDiff + (date2.getMonth() - date1.getMonth());
  }

  getTasas() {
    /*let body{
      diCoinDeposit: 'di_moneda_deposito',
      vnActualYear: 'vn_anio_actual',
      vnMonthYear: 'vn_mes_actual',
      diInstrument: 'di_instrumento',
    };
    this.goodParametersService.createAccount(body).subscribe({
      next: resp=>{
        return resp.tas, resp.mes
      }
    });*/
  }

  getPayment() {}

  interestCheck() {}

  detailCalculation() {
    const cuenta_origen_deposito = 0;
    if (cuenta_origen_deposito === null) {
      this.alert('warning', 'Debe seleccionar un deposito primero', '');
    }
  }
}
