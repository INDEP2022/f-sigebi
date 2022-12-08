/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  TABLE_SETTINGS_DISPERSION_PAGOS,
  TABLE_SETTINGS_FACT_GEN,
} from './conciliation-depositary-payments-columns';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { BehaviorSubject } from 'rxjs';
import { DEPOSITARY_ROUTES_1 } from 'src/app/common/constants/juridical-processes/depositary-routes-1';
import {
  baseMenu,
  baseMenuDepositaria,
  baseMenuProcesoDispercionPagos,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import Swal from 'sweetalert2';

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

  public form: FormGroup;
  public formDepositario: FormGroup;
  dispersionPagos: boolean = false;

  public rutaValidacionPagos: string =
    baseMenu +
    baseMenuDepositaria +
    baseMenuProcesoDispercionPagos +
    DEPOSITARY_ROUTES_1[2].link;

  constructor(private fb: FormBuilder, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.required]], //*
      nombramiento: ['', [Validators.required]], //*
      fecha: ['', [Validators.required]], //*
      fechaEliminarDispersion: [
        '',
        [Validators.minLength(2), Validators.maxLength(10)],
      ], //*
    });
    this.formDepositario = this.fb.group({
      idDepositario: ['', [Validators.required]], //*
      depositario: ['', [Validators.required]], //*
      procesar: ['', [Validators.required]], //* SI/NO
      fechaEjecucion: ['', [Validators.required]], //*
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
  btnDispersar(dispersar: boolean) {
    console.log('btnDispersar', dispersar);
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
      this.message('Faltan datos', 'El No. Bien es obligatorio.', 'warning');
    }
  }

  message(title: string, text: string, type: any) {
    Swal.fire({
      title: title,
      text: text,
      icon: type,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        console.log('OK');
      }
    });
  }
}
