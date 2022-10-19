/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-pdp-c-conciliation-depositary-payments',
  templateUrl: './pj-d-pdp-c-conciliation-depositary-payments.component.html',
  styleUrls: ['./pj-d-pdp-c-conciliation-depositary-payments.component.scss'],
})
export class PJDPDPConciliationDepositaryPaymentsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableFactGenSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      fechaDepositaria: {
        title: 'Fecha',
      },
      tipoDepositaria: {
        title: 'Tipo',
      },
      nDiasDepositaria: {
        title: 'N. Días',
      },
      fecRecep: {
        title: 'Fec. Recep',
      },
      usuRecep: {
        title: 'Usu. Recep',
      },
      area: {
        title: 'Ärea',
      },
      nDias: {
        title: 'N. Días',
      },
      fecCierre: {
        title: 'Fec. Cierre',
      },
      usuarioCierre: {
        title: 'Usuario Cierre',
      },
    },
  };
  // tipoDepositaria --- Depositaría,Administrador,Interventor,Comodato
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

  public form: FormGroup;
  public formDepositario: FormGroup;

  constructor(private fb: FormBuilder) {
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
}
