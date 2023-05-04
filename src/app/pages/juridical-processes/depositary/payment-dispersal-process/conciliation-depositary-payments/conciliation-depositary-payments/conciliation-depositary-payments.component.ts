/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
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
import { IAppointmentDepositary } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ConciliationDepositaryPaymentsService } from '../services/conciliation-depositary-payments.service';
import {
  ERROR_DATE_DISPERSAL_NULL,
  ERROR_GOOD_NULL,
  NOT_FOUND_GOOD,
  NOT_FOUND_GOOD_APPOINTMENT,
} from '../utils/conciliation-depositary-payments.messages';
import {
  TABLE_SETTINGS_DISPERSION_PAGOS,
  TABLE_SETTINGS_FACT_GEN,
} from './conciliation-depositary-payments-columns';

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
  // DISPERSIÓN DE PAGOS DEPOSITARIAS
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  tableFactGenSettings = TABLE_SETTINGS_FACT_GEN;
  tableSettingsDispersion = TABLE_SETTINGS_DISPERSION_PAGOS;
  dataFactGen = [
    {
      fechaDepositaria: '18/09/2022',
      tipoDepositaria: 'Depositaría,Administrador,Interventor,Comodato',
      nDiasDepositaria: 1,
      fecRecep: '18/09/2022',
      usuRecep: 'Usu. Recep',
      area: 'Ärea',
      nDias: 1,
      fecCierre: '18/09/2022',
      usuarioCierre: 'Usuario Cierre',
    },
  ];
  dataDispersion = [
    {
      noPago: '12345',
      idPago: '12345',
      noBien: '12345',
      montoMensual: '500',
      referencia: '2154165144',
      montoSinIva: '450',
      iva: '5',
      montoIva: '50',
      abonoComp: '12/20', // Abono/Comp.
      pagoActual: '100',
      recGastPorcentaje: '5', // Rec. Gast. %
      recGastValor: '50', // Rec. Gast. Valor
      pago: '12', // Select
      reconocimientoGastos: '5 -- 50', // % -- Valor
    },
  ];
  // CONCILIACIÓN DE PAGOS
  public form: FormGroup;
  public formDepositario: FormGroup;
  public noBienReadOnly: number = null;
  dispersionPagos: boolean = false;
  depositaryAppointment: IAppointmentDepositary;
  good: IGood;

  public rutaValidacionPagos: string =
    baseMenu +
    baseMenuDepositaria +
    baseMenuProcesoDispercionPagos +
    DEPOSITARY_ROUTES_1[2].link;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private svConciliationDepositaryPaymentsService: ConciliationDepositaryPaymentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.required]], //*
      nombramiento: [{ value: '', disabled: false }, [Validators.maxLength(6)]], //*
      fecha: [{ value: '', disabled: true }, [Validators.maxLength(11)]], //*
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

  mostrarInfo(form: any): any {
    console.log(form.value);
    this.dispersionPagos = true;
  }
  btnSalirDispersion() {
    console.log('btnSalirDispersion');
    this.dispersionPagos = false;
  }
  btnDispersar(dispersar: any) {
    console.log('btnDispersar', dispersar);
    if (dispersar.validDate) {
      console.log(dispersar);
    } else {
      this.alert('warning', 'Número de Bien', ERROR_DATE_DISPERSAL_NULL);
    }
  }
  btnAplicarPagos() {
    console.log('btnAplicarPagos');
  }
  btnDispersarPagos() {
    console.log('btnDispersarPagos');
  }
  mostrarInfoDepositario(formDepositario: any): any {
    console.log(formDepositario.value);
  }
  btnValidacionPagos(form: any): any {
    this.form = form;
    console.log(this.form.value);
    console.log('btnValidacionPagos');
    if (this.form.get('noBien').valid) {
      this.router.navigateByUrl(
        this.rutaValidacionPagos + '/' + this.form.get('noBien').value
      );
    } else {
      this.alert('warning', 'Número de Bien', ERROR_GOOD_NULL);
    }
  }

  async btnSearchGood(goodNumber: number) {
    console.log(goodNumber);
    if (this.form.get('noBien').valid) {
      this.loading = true;
      this.noBienReadOnly = this.form.get('noBien').value;
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter('goodNumber', this.noBienReadOnly);
      params.addFilter('revocation', 'N');
      await this.svConciliationDepositaryPaymentsService
        .getGoodAppointmentDepositaryByNoGood(params.getParams())
        .subscribe({
          next: res => {
            console.log(res.data);
            this.depositaryAppointment = res.data[0];
            this.form
              .get('nombramiento')
              .setValue(this.depositaryAppointment.appointmentNumber);
            this.formDepositario
              .get('idDepositario')
              .setValue(this.depositaryAppointment.personNumber.id);
            this.formDepositario
              .get('depositario')
              .setValue(this.depositaryAppointment.personNumber.nombre);
            let fecha = this.datePipe.transform(
              this.depositaryAppointment.appointmentDate,
              'dd-MMM-yyyy'
            );
            this.form.get('fecha').setValue(fecha);
            // this.formDepositario
            //   .get('procesar')
            //   .setValue(this.depositaryAppointment.personNumber.nombre);
            this.form
              .get('noBien')
              .setValue(this.depositaryAppointment.good.goodId);
            this.form
              .get('descripcion')
              .setValue(this.depositaryAppointment.good.description);
            this.getGoodData();
          },
          error: err => {
            this.loading = false;
            this.alert(
              'warning',
              'Número de Bien',
              NOT_FOUND_GOOD_APPOINTMENT(err.error.message)
            );
          },
        });
    } else {
      this.alert('warning', 'Número de Bien', ERROR_GOOD_NULL);
    }
  }

  async getGoodData() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('goodId', this.noBienReadOnly);
    await this.svConciliationDepositaryPaymentsService
      .getGoodDataByFilter(params.getParams())
      .subscribe({
        next: res => {
          console.log(res.data);
          // this.good = res.data[0]; // Set data good
          // this.form.get('noBien').setValue(this.good.goodId);
          // this.form.get('descripcion').setValue(this.good.description);
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.alert(
            'warning',
            'Número de Bien',
            NOT_FOUND_GOOD(err.error.message)
          );
        },
      });
  }
}
