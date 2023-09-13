/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs';
import { DEPOSITARY_ROUTES_1 } from 'src/app/common/constants/juridical-processes/depositary-routes-1';
import {
  baseMenu,
  baseMenuDepositaria,
  baseMenuProcesoDispercionPagos,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IDepositaryAppointments,
  IPaymendtDepParamsDep,
  IPersonsModDepositary,
} from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IPaymentsGensDepositary } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { PersonService } from 'src/app/core/services/catalogs/person.service';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ConciliationDepositaryPaymentsService } from '../services/conciliation-depositary-payments.service';
import {
  CORRECT_REMOVE_PAYMENTS,
  ERROR_APOINTMENT_NUMBER_NULL,
  ERROR_DATE_DISPERSAL_NULL,
  ERROR_GOOD_NULL,
  ERROR_GOOD_PARAM,
  NOT_FOUND_GET_PARAMSDEP_PAYMENTS,
  NOT_FOUND_GET_VALIDADEP_PAYMENTS,
  NOT_FOUND_GET_VALID_BLACKLIST,
  NOT_FOUND_GET_VALID_STATUS,
  NOT_FOUND_GOOD_APPOINTMENT,
  NOT_FOUND_REMOVE_PAYMENTS,
} from '../utils/conciliation-depositary-payments.messages';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-conciliation-depositary-payments',
  templateUrl: './conciliation-depositary-payments.component.html',
  styleUrls: ['./conciliation-depositary-payments.component.scss'],
})
export class ConciliationDepositaryPaymentsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // CONCILIACIÓN DE PAGOS
  public form: FormGroup;
  public formDepositario: FormGroup;
  public noBienReadOnly: number = null;
  depositaryAppointment: IDepositaryAppointments;
  good: IGood;
  dataPagosRecibidos: IPaymentsGensDepositary[] = [];
  dataPersonsDepositary: IPersonsModDepositary;
  screenKey: string = 'FCONDEPOCONCILPAG';
  actualDate: any = null;
  origin: string = null;
  noBienParams: number = null;
  selectDataGood: IGood;

  public rutaValidacionPagos: string =
    baseMenu +
    baseMenuDepositaria +
    baseMenuProcesoDispercionPagos +
    DEPOSITARY_ROUTES_1[2].link;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private svConciliationDepositaryPaymentsService: ConciliationDepositaryPaymentsService,
    private activatedRoute: ActivatedRoute,
    private personService: PersonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.noBienParams = params['p_nom_bien']
          ? Number(params['p_nom_bien'])
          : null;
        this.origin = params['origin'] ?? null;
        console.log(params);
      });
    this.loading = true;
    this.selectDataGood = null;
    this.prepareForm();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      if (!isNaN(Number(id))) {
        this.noBienReadOnly = Number(id);
        this.form.get('noBien').setValue(this.noBienReadOnly);
        this.btnSearchGood(Number(id));
      } else {
        this.loading = false;
        this.alert('warning', 'Número de bien', ERROR_GOOD_PARAM);
      }
    } else {
      this.loading = false;
    }
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: [
        { value: null, disabled: false },
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(NUM_POSITIVE),
        ],
      ], //*
      nombramiento: [
        { value: '', disabled: false },
        [Validators.maxLength(10)],
      ], //*
      nombramientoDescription: [
        { value: '', disabled: false },
        [Validators.maxLength(200)],
      ], //*
      fecha: [
        { value: this.actualDate, disabled: true },
        [Validators.maxLength(11)],
      ], //*
      fechaEliminarDispersion: [
        { value: '', disabled: false },
        [Validators.required, Validators.maxLength(10)],
      ], //*
      descripcion: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1250)],
      ], //*
    });
    this.formDepositario = this.fb.group({
      idDepositario: [
        { value: '', disabled: false },
        [Validators.required, Validators.maxLength(30)],
      ], //*
      depositario: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ], //*
      procesar: [{ value: '', disabled: true }, [Validators.required]], //* SI/NO
      fechaEjecucion: [
        { value: '', disabled: true },
        [Validators.maxLength(11)],
      ], //*
    });
  }

  btnRunPayment(form: any): any {
    console.log(form.value);
    // DESPUES DE VALIDAR SE LLAMA LA PANTALLA FCONDEPOCONDISPAG
    if (this.form.get('noBien').valid && this.noBienReadOnly) {
      if (this.depositaryAppointment) {
        if (this.depositaryAppointment.appointmentNum) {
          this.getParamsDep();
        } else {
          this.alert(
            'warning',
            'Número de nombramiento',
            ERROR_APOINTMENT_NUMBER_NULL
          );
        }
      } else {
        this.alert(
          'warning',
          'Número de nombramiento',
          ERROR_APOINTMENT_NUMBER_NULL
        );
      }
    } else {
      this.alert(
        'warning',
        'Número de bien',
        ERROR_GOOD_NULL + ' y da clic en búscar para continuar'
      );
    }
  }
  btnSalirDispersion() {
    console.log('btnSalirDispersion');
  }
  btnDispersar(dispersar: any) {
    console.log('btnDispersar', dispersar);
    if (dispersar.validDate) {
      console.log(dispersar);
      this.alertQuestion(
        'warning',
        'Eliminar',
        '¿Seguro que desea eliminar todas las dispersiones de la la fecha: ' +
          this.datePipe.transform(dispersar.dateValue, 'dd/MM/yyyy') +
          '?'
      ).then(res => {
        if (res.isConfirmed) {
          this.deletePaymentRefRemove(dispersar.dateValue);
        }
      });
    } else {
      this.alert('warning', 'Fecha requerida', ERROR_DATE_DISPERSAL_NULL);
    }
  }

  async deletePaymentRefRemove(dateParam: string) {
    this.loading = true;
    let params: any = {
      pOne: Number(this.depositaryAppointment.appointmentNum),
      pDate: new Date(dateParam),
    };
    await this.svConciliationDepositaryPaymentsService
      .deletePaymentRefRemove(params)
      .subscribe({
        next: res => {
          this.loading = false;
          console.log(res.data);
          this.btnSearchGood(this.noBienReadOnly);
          this.alertInfo(
            'success',
            'Se eliminó correctamente',
            CORRECT_REMOVE_PAYMENTS(
              Number(this.depositaryAppointment.appointmentNum),
              this.datePipe.transform(dateParam, 'dd/MM/yyyy')
            )
          );
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'error',
            'Error al eliminar',
            NOT_FOUND_REMOVE_PAYMENTS(
              err.error.message,
              Number(this.depositaryAppointment.appointmentNum),
              dateParam
            )
          );
        },
      });
  }

  btnDepositaryRecharge(formDepositario: any): any {
    console.log(formDepositario.value);

    if (this.form.get('noBien').valid && this.noBienReadOnly) {
      // Recargar los clientes
      if (!this.depositaryAppointment.appointmentNum) {
        this.alert(
          'warning',
          'Número de nombramiento',
          'Se requiere un número de nombramiento para continuar, búsque otro bien e intente nuevamente'
        );
        return;
      }
      this.loading = true;
      this.depositaryRecharge();
    } else {
      this.alert(
        'warning',
        'Número de bien',
        ERROR_GOOD_NULL + ' y da clic en búscar para continuar'
      );
    }
  }

  depositaryRecharge() {
    this.svConciliationDepositaryPaymentsService
      .getgetAplicationcargaCliente1(
        Number(this.depositaryAppointment.appointmentNum)
      )
      .subscribe({
        next: res => {
          console.log(res.data);
          if (res.data.length > 0) {
            this.dataPersonsDepositary.personNum =
              res.data[res.data.length - 1].no_persona;
            // this.dataPersonsDepositary.personNum =
            //   res.data[res.data.length - 1].nombre;
            this.formDepositario
              .get('idDepositario')
              .setValue(res.data[res.data.length - 1].no_persona);
            this.formDepositario
              .get('depositario')
              .setValue(res.data[res.data.length - 1].nombre);
            this.dataPersonsDepositary.process = 'S';
            this.dataPersonsDepositary.sendSirsae = 'N';
            this.dataPersonsDepositary.modifyStatus = 'N';
            this.actualDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
            this.dataPersonsDepositary.dateExecution = this.actualDate;
            this.formDepositario
              .get('fechaEjecucion')
              .setValue(this.dataPersonsDepositary.dateExecution);
            this.formDepositario
              .get('procesar')
              .setValue(
                this.dataPersonsDepositary.process == 'S' ? true : false
              );
            this.depositaryRecharge_Delete();
          } else {
            this.loading = false;
            this.alertInfo(
              'error',
              'Sin resultados',
              'No se encontraró otro depositario'
            );
          }
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'error',
            'Ocurrió un error al recargar el depositario',
            err.error.message
          );
        },
      });
  }

  depositaryRecharge_Delete() {
    this.svConciliationDepositaryPaymentsService
      .getgetAplicationcargaCliente2(
        Number(this.depositaryAppointment.appointmentNum)
      )
      .subscribe({
        next: res => {
          console.log(res.data);
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'error',
            'Ocurrió un error al recargar el depositario',
            err.error.message
          );
        },
      });
  }

  btnValidacionPagos(form: any): any {
    this.formDepositario = form.depositario;
    this.form = form.form;
    // Llama la forma FCONDEPODISPAGOS
    if (this.form.get('noBien').valid && this.noBienReadOnly) {
      this.router.navigate(
        [this.rutaValidacionPagos + '/' + this.form.get('noBien').value],
        {
          queryParams: {
            origin: this.screenKey,
            goodNumber: this.form.get('noBien').value,
          },
        }
      );
    } else {
      this.alert(
        'warning',
        'Número de bien',
        ERROR_GOOD_NULL + ' y da clic en búscar para continuar'
      );
    }
  }

  clearData(event: any) {
    console.log(event);
    this.form.reset();
    this.noBienReadOnly = null;
    this.depositaryAppointment = null;
    this.dataPersonsDepositary = null;
    this.dataPagosRecibidos = null;
    this.formDepositario.reset();
    this.selectDataGood = null;
  }

  selectedGood(dataGood: IGood) {
    console.log(dataGood);
    this.selectDataGood = dataGood;
    if (dataGood) {
      this.btnSearchGood(dataGood.goodId);
    } else {
      this.clearData(null);
    }
  }

  async btnSearchGood(goodNumber: number) {
    console.log(goodNumber);
    if (this.form.get('noBien').valid) {
      this.loading = true;
      this.noBienReadOnly = this.form.get('noBien').value;
      // const params = new FilterParams();
      // params.removeAllFilters();
      // params.addFilter('goodNumber', this.noBienReadOnly);
      // params.addFilter('revocation', 'N');
      let params = new ListParams();
      params['filter.goodNum'] = this.noBienReadOnly;
      params['filter.revocation'] = 'N';
      await this.svConciliationDepositaryPaymentsService
        .getGoodAppointmentDepositaryByNoGood(params)
        .subscribe({
          next: res => {
            console.log(res.data);
            this.depositaryAppointment = res.data[0];
            this.form
              .get('nombramiento')
              .setValue(this.depositaryAppointment.appointmentNum);
            this.form
              .get('nombramientoDescription')
              .setValue(this.depositaryAppointment.contractKey);
            if (this.depositaryAppointment.personNum) {
              const params = new FilterParams();
              params.removeAllFilters();
              params.addFilter('id', this.depositaryAppointment.personNum);
              this.personService.getAllFilters().subscribe({
                next: res => {
                  console.log(res);
                  this.depositaryAppointment.personNumber = res.data[0];
                  this.formDepositario
                    .get('idDepositario')
                    .setValue(this.depositaryAppointment.personNumber.id);
                  this.formDepositario
                    .get('depositario')
                    .setValue(this.depositaryAppointment.personNumber.name);
                },
                error: err => {
                  console.log(err);
                },
              });
            }
            this.actualDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
            this.form.get('fecha').setValue(this.actualDate);
            this.depositaryAppointment.good = this.selectDataGood;
            // this.form
            //   .get('noBien')
            //   .setValue(this.depositaryAppointment.good.goodId);
            if (this.depositaryAppointment.good) {
              this.form
                .get('descripcion')
                .setValue(this.depositaryAppointment.good.description);
            }
            // if (this.depositaryAppointment.goodNum) {
            //   const params = new FilterParams();
            //   params.removeAllFilters();
            //   params.addFilter('goodId', this.noBienReadOnly);
            //   this.svConciliationDepositaryPaymentsService
            //     .getGoodDataByFilter(params.getParams())
            //     .subscribe({
            //       next: res => {
            //         this.depositaryAppointment.good = res.data[0]; // Set data good
            //         this.form
            //           .get('noBien')
            //           .setValue(this.depositaryAppointment.good.goodId);
            //         this.form
            //           .get('descripcion')
            //           .setValue(this.depositaryAppointment.good.description);
            //       },
            //       error: err => {
            //         console.log(err);
            //       },
            //     });
            // }
            this.getDataPaymentsDispersion();
            this.getPersonsModDepositary();
          },
          error: err => {
            console.log(err);
            this.loading = false;
            this.alert(
              'warning',
              'Número de bien',
              NOT_FOUND_GOOD_APPOINTMENT(err.error.message)
            );
          },
        });
    } else {
      this.alert('warning', 'Número de bien', ERROR_GOOD_NULL);
    }
  }

  async getPersonsModDepositary() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'appointmentNum',
      this.depositaryAppointment.appointmentNum
    );
    await this.svConciliationDepositaryPaymentsService
      .getPersonsModDepositary(params.getParams())
      .subscribe({
        next: res => {
          console.log(res.data);
          this.dataPersonsDepositary = res.data[0]; // Set data good
          this.formDepositario
            .get('fechaEjecucion')
            .setValue(this.dataPersonsDepositary.dateExecution);
          this.formDepositario
            .get('procesar')
            .setValue(this.dataPersonsDepositary.process == 'S' ? true : false);
          this.loading = false;
        },
        error: err => {
          console.log(err);
          this.loading = false;
          // this.alert(
          //   'warning',
          //   'Número de bien',
          //   NOT_FOUND_PERSONS_DEPOSITARY(err.error.message)
          // );
        },
      });
  }

  async getDataPaymentsDispersion() {
    this.dataPagosRecibidos = [];
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('noGoods', this.noBienReadOnly);
    params.addFilter(
      'no_appointment',
      this.depositaryAppointment.appointmentNum
    );
    params['sortBy'] = 'payIdGens:DESC';
    await this.svConciliationDepositaryPaymentsService
      .getPaymentsGensDepositories(params.getParams())
      .subscribe({
        next: res => {
          console.log(res.data);
          this.dataPagosRecibidos = res.data;
        },
        error: err => {
          console.log(err);
          // this.alertInfo(
          //   'warning',
          //   'Composición de Pagos Recibidos',
          //   NOT_FOUND_PAYMENTS_PAYMENTS_DISPERSIONS(err.error.message)
          // );
        },
      });
  }

  async getParamsDep() {
    this.loading = true;
    let params: IPaymendtDepParamsDep = {
      name: Number(this.depositaryAppointment.appointmentNum),
      address: 'D',
    };
    await this.svConciliationDepositaryPaymentsService
      .getPaymentRefParamsDep(params)
      .subscribe({
        next: res => {
          if (res.message[0] == 'OK') {
            console.log(res.data);
            this.getValidStatus();
          } else {
            this.loading = false;
            this.alertInfo(
              'warning',
              'Número de nombramiento',
              NOT_FOUND_GET_PARAMSDEP_PAYMENTS(
                res.message[0],
                Number(this.depositaryAppointment.appointmentNum)
              )
            );
          }
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'warning',
            'Número de nombramiento',
            NOT_FOUND_GET_PARAMSDEP_PAYMENTS(
              err.error.message,
              Number(this.depositaryAppointment.appointmentNum)
            )
          );
        },
      });
  }

  getValidStatus() {
    this.svConciliationDepositaryPaymentsService
      .getValidStatusProcess(Number(this.depositaryAppointment.appointmentNum))
      .subscribe({
        next: res => {
          console.log('VALID STATUS');
          console.log(res.data);
          if (res.data.length > 0) {
            this.loading = false;
            this.alertInfo(
              'warning',
              'Número de nombramiento',
              NOT_FOUND_GET_VALID_STATUS(
                res.message[0] + '',
                Number(this.depositaryAppointment.appointmentNum)
              )
            );
          } else {
            // Valida blacklist
            this.validBlackList();
          }
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'warning',
            'Número de nombramiento',
            NOT_FOUND_GET_VALID_STATUS(
              err.error.message,
              Number(this.depositaryAppointment.appointmentNum)
            )
          );
        },
      });
  }

  validBlackList() {
    this.svConciliationDepositaryPaymentsService
      .getValidBlackListProcess(
        Number(this.depositaryAppointment.appointmentNum)
      )
      .subscribe({
        next: (res: any) => {
          console.log('LISTA NEGRA');
          console.log(res);
          if (res['personNumber'] == 'XX') {
            // Valida Params Dep
            this.getValidaDep();
          } else {
            this.loading = false;
            this.alertInfo(
              'warning',
              'Número de nombramiento',
              NOT_FOUND_GET_VALID_BLACKLIST(
                res.message[0],
                Number(this.depositaryAppointment.appointmentNum)
              )
            );
          }
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'warning',
            'Número de nombramiento',
            NOT_FOUND_GET_VALID_BLACKLIST(
              err.error.message,
              Number(this.depositaryAppointment.appointmentNum)
            )
          );
        },
      });
  }

  getValidaDep() {
    if (!this.form.get('fecha').value) {
      this.loading = false;
      this.alertInfo(
        'warning',
        'Fecha',
        'Se requiere una fecha para continuar'
      );
      return;
    }
    let fecha = new Date();
    this.actualDate = this.datePipe.transform(fecha, 'dd/MM/yyyy');
    this.form.get('fecha').setValue(this.actualDate);
    let params: any = {
      name: Number(this.depositaryAppointment.appointmentNum),
      date: fecha,
    };
    this.svConciliationDepositaryPaymentsService
      .getPaymentRefValidDep(params)
      .subscribe({
        next: res => {
          console.log(res.data);
          this.gotToConciliationPays();
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'warning',
            'Número de nombramiento',
            NOT_FOUND_GET_VALIDADEP_PAYMENTS(
              err.error.message,
              Number(this.depositaryAppointment.appointmentNum)
            )
          );
          // this.gotToConciliationPays();
        },
      });
  }

  gotToConciliationPays() {
    // this.alertInfo('info', '', 'LLAMAR LA PANTALLA FCONDEPOCONDISPAG');
    // this.router
    //   .navigate(['PENDIENTE'], {
    //     queryParams: {
    //       origin: this.screenKey,
    //       P_CONTRA: this.depositaryAppointment.importConsideration,
    //       P_FECHA: this.form.get('fecha').value,
    //       P_PERSONA: this.depositaryAppointment.personNumber.id,
    //     },
    //   })
    //   .then(() => {
    //     this.getPrepOI();
    //   });
    this.alertInfo(
      'warning',
      // 'La siguiente pantalla no se migra: FCONDEPOCONDISPAG - dispersion de pagos depositarias',
      'Esta pantalla no esta disponible por el momento',
      'De igual manera el proceso continuará al cerrar este mensaje'
    ).then(() => {
      this.getPrepOI();
      // this.insertDispersionDB();
    });
    // this.getPrepOI();
    // FCONDEPOCONDISPAG
  }

  async insertDispersionDB() {
    let params: any = {
      pOne: Number(this.depositaryAppointment.appointmentNum),
      pTwo: null,
    };
    // let params: any = {
    //   pOne: Number(this.depositaryAppointment.appointmentNum),
    //   pTwo: this.depositaryAppointment.personNumber.id,
    //   pDate: this.form.get('fecha').value,
    // };
    await this.svConciliationDepositaryPaymentsService
      .insertDispersionDB(params)
      .subscribe({
        next: res => {
          this.loading = false;
          console.log(res.data);
          this.getPrepOI();
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'warning',
            'Dispersión de pagos',
            'Error al procesar la dispersión de pagos'
          );
        },
      });
  }

  async getPrepOI() {
    let params: any = {
      name: Number(this.depositaryAppointment.appointmentNum),
      description: this.depositaryAppointment.contractKey,
    };
    await this.svConciliationDepositaryPaymentsService
      .getPaymentRefPrepOI(params)
      .subscribe({
        next: res => {
          this.loading = false;
          console.log(res.data);
          this.alert('success', 'Proceso completado correctamente', '');
        },
        error: err => {
          this.loading = false;
          console.log(err);
          this.alertInfo(
            'warning',
            'Número de nombramiento',
            NOT_FOUND_GET_VALIDADEP_PAYMENTS(
              err.error.message,
              Number(this.depositaryAppointment.appointmentNum)
            )
          );
          // this.gotToConciliationPays();
        },
      });
  }

  goBack() {
    // if (this.origin == 'FCONDEPOCONCILPAG') {
    //   this.router.navigate([
    //     '/pages/juridical/depositary/payment-dispersion-process/conciliation-depositary-payments/' +
    //       this.noBienParams,
    //   ]);
    // } else
    if (this.origin == 'FCONDEPOCARGAPAG') {
      const value = this.noBienParams ? this.noBienParams : this.noBienReadOnly;
      this.router.navigate([
        '/pages/juridical/depositary/depositary-payment-charges/' + value,
      ]);
    }
  }
}
