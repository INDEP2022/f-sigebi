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
  selector: 'app-resolution-revision-resources',
  templateUrl: './resolution-revision-resources.component.html',
  styleUrls: ['./resolution-revision-resources.component.scss'],
})
export class ResolutionRevisionResourcesComponent
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
      noBien: { title: 'No. Bien' },
      descripcion: { title: 'Descripción' },
      cantidad: { title: 'Cantidad' },
      estatus: { title: 'Estatus' },
      motivoRecursoRevision: { title: 'Motivo de Recurso de Revisión' },
      fechaRecepcion: { title: 'Fecha de Recepción' },
      fechaEmisionResolucion: { title: 'Fecha de Emisión de Resolución' },
      observacionesRecursoRevision: {
        title: 'Observaciones del Recurso de Revisión',
      },
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'DATA',
      descripcion: 'DATA',
      cantidad: 'DATA',
      estatus: 'DATA',
      motivoRecursoRevision: 'DATA',
      fechaRecepcion: 'DATA',
      fechaEmisionResolucion: 'DATA',
      observacionesRecursoRevision: 'DATA',
    },
  ];
  showResolucion: boolean = false;
  public form: FormGroup;

  constructor(private fb?: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.startApp();
    this.loading = true;
  }

  startApp() {
    this.form = this.fb.group({
      resolucion: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], //*
    });
  }

  btnResolucion() {
    this.showResolucion = true;
  }

  btnCloseResolucion() {
    console.log(this.form.value);
    this.showResolucion = false;
  }
}
