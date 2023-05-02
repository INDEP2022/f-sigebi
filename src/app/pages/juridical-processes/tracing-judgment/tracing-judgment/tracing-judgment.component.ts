/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-tracing-judgment',
  templateUrl: './tracing-judgment.component.html',
  styleUrls: ['./tracing-judgment.component.scss'],
})
export class TracingJudgmentComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // Table settings
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
      noDespacho: { title: 'No. Despacho' },
      despachoResponsable: { title: 'Despacho Responsable' },
      fechaActuacion: { title: 'Fecha Actuación' },
      actuaciones: { title: 'Actuaciones' },
    },
  };
  // Data table
  dataTable = [
    {
      noDespacho: 'DATA',
      despachoResponsable: 'DATA',
      fechaActuacion: 'DATA',
      actuaciones: 'DATA',
    },
  ];

  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noBien: '',
      juicio: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }
}
