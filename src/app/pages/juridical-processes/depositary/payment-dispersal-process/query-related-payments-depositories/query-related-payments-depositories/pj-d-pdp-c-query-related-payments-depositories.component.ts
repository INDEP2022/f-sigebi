/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-pdp-c-query-related-payments-depositories',
  templateUrl:
    './pj-d-pdp-c-query-related-payments-depositories.component.html',
  styleUrls: [
    './pj-d-pdp-c-query-related-payments-depositories.component.scss',
  ],
})
export class PJDPDPQueryRelatedPaymentsDepositoriesComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // Pagos Recibidos en el Banco
  // ------
  tableSettingsPagosBanco = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noMovimiento: {
        title: 'No. Movimiento',
      },
      banco: {
        title: 'Banco',
      },
      fecha: {
        title: 'Fecha',
      },
      referencia: {
        title: 'Referencia',
      },
      deposito: {
        title: 'Deposito',
      },
      noOrdenIngreso: {
        title: 'No. Orden Ingreso',
      },
      fechaOI: {
        title: 'Fecha IO',
      },
      noPago: {
        title: 'No. Pago',
      },
    },
  };
  dataPagosBanco = [
    {
      noMovimiento: 'Data',
      banco: 'Data',
      fecha: 'Data',
      referencia: 'Data',
      deposito: 'Data',
      noOrdenIngreso: 'Data',
      fechaOI: 'Data',
      noPago: 'Data',
    },
  ];

  // Composicion de Pagos Recibidos
  // ------
  tableSettingsPagosRecibidos = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    columns: {
      pagDet: {
        title: 'Pag. Det.',
      },
      pagoOrigen: {
        title: 'Pago Origen',
      },
      montoMensual: {
        title: 'Monto Mensual',
      },
      referencia: {
        title: 'Referencia',
      },
      montoSinIva: {
        title: 'Monto Sin Iva',
      },
      iva: {
        title: 'Iva',
      },
      montoIva: {
        title: 'Monto Iva',
      },
      abonoComp: {
        title: 'Abondo Comp.',
      },
      pagoActual: {
        title: 'Pago Actual',
      },
      recGastPorcentaje: {
        title: 'Rec. Gast. (%)',
      },
      recGastValor: {
        title: 'Rec. Gast.',
      },
      fechaProceso: {
        title: 'Fecha Proceso',
      },
      estatus: {
        title: 'Estatus',
      },
      observacionesPago: {
        title: 'Observaciones Pago',
      },
    },
  };
  dataPagosRecibidos = [
    {
      pagDet: 'Data',
      pagoOrigen: 'Data',
      montoMensual: 'Data',
      referencia: 'Data',
      montoSinIva: 'Data',
      iva: 'Data',
      montoIva: 'Data',
      abonoComp: 'Data',
      pagoActual: 'Data',
      recGastPorcentaje: 'Data',
      recGastValor: 'Data',
      fechaProceso: 'Data',
      estatus: 'Data',
      observacionesPago: 'Data',
    },
  ];

  public form: FormGroup;
  public formDepositario: FormGroup;
  public noBienReadOnly: number = null;

  constructor(private fb: FormBuilder, private activateRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.paramMap.get('id');
    if (id) this.noBienReadOnly = Number(id);
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: [this.noBienReadOnly, [Validators.required]], //*
      nombramiento: ['', [Validators.required]], //*
      fecha: ['', [Validators.required]], //*
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
  }

  mostrarInfoDepositario(formDepositario: any): any {
    console.log(formDepositario.value);
  }

  btnExportarExcel(): any {
    console.log('Exportar Excel');
  }

  btnEnviarSIRSAE(): any {
    console.log('Envíar a SIRSAE');
  }

  btnImprimir(): any {
    console.log('Imprimir');
  }

  btnActualizarPago(): any {
    console.log('Actualizar Pago');
  }
}
