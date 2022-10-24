import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-con-depo-dis-pagos',
  templateUrl: './fact-con-depo-dis-pagos.component.html',
  styleUrls: ['./fact-con-depo-dis-pagos.component.scss'],
})
export class FactConDepoDisPagosComponent {
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noBien: ['', [Validators.required]], //*
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

  /**
   * Formulario
   */
  //  public returnField(form, field) { return form.get(field); }
  //  public returnShowRequirements(form, field) {
  //    return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched;
  //  }
}
