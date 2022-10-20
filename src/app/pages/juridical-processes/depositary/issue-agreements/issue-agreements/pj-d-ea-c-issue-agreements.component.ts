/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-ea-c-issue-agreements',
  templateUrl: './pj-d-ea-c-issue-agreements.component.html',
  styleUrls: ['./pj-d-ea-c-issue-agreements.component.scss'],
})
export class PJDEAIssueAgreementsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: {
        title: 'No. Bien',
      }, //*
      descripcion: {
        title: 'Descripción',
      },
      cantidad: {
        title: 'Cantidad',
      },
      estatus: {
        title: 'Estatus',
      },
      fechaRecepcion: {
        title: 'Fecha de Recepción',
      },
      fechaAcuerdoInicial: {
        title: 'Fecha de Acuerdo Inicial',
      },
      diasEmitirResolucion: {
        title: 'Días para Emitir Resolución',
      },
      fechaAudiencia: {
        title: 'Fecha de Audiencia',
      },
      observacionesAcuerdoInicial: {
        title: 'Observaciones Acuerdo Inicial',
      },
      aceptaSuspencion: {
        title: 'Acepta Suspención',
      }, //*
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'No. Bien',
      descripcion: 'Descripción',
      cantidad: 'Cantidad',
      estatus: 'Estatus',
      fechaRecepcion: 'Fecha de Recepción',
      fechaAcuerdoInicial: 'Fecha de Acuerdo Inicial',
      diasEmitirResolucion: 'Días para Emitir Resolución',
      fechaAudiencia: 'Fecha de Audiencia',
      observacionesAcuerdoInicial: 'Observaciones Acuerdo Inicial',
      aceptaSuspencion: 'Acepta Suspención',
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

  mostrarInfo(form: FormGroup): any {
    console.log(form.value);
  }

  mostrarInfoDepositario(formDepositario: FormGroup): any {
    console.log(formDepositario.value);
  }
}
