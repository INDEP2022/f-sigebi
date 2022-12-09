/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-mass-ruling',
  templateUrl: './mass-ruling.component.html',
  styleUrls: ['./mass-ruling.component.scss'],
})
export class MassRulingComponent extends BasePage implements OnInit, OnDestroy {
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
      },
      noExpediente: {
        title: 'No. Expediente',
      },
    },
  };
  // Data table
  dataTable = [
    {
      noBien: 'DATA',
      noExpediente: 'DATA',
    },
  ];

  tableSettings1 = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      erroresProceso: {
        title: 'Errores del proceso',
      },
    },
  };
  // Data table
  dataTable1 = [
    {
      erroresProceso: 'DATA',
    },
  ];

  public form: FormGroup;
  public formCargaMasiva: FormGroup;
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noOficio: '', //*
      tipoDictaminacion: '',
      fecha: '',
      estatus: ['', [Validators.pattern(STRING_PATTERN)]],
      claveOficioArmada: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      fechaInstructora: '',
      usuarioDictamina: ['', [Validators.pattern(STRING_PATTERN)]],
      noVolante: '',
      noExpediente: '',
      eliminar: '', // Check
    });
    this.formCargaMasiva = this.fb.group({
      identificadorCargaMasiva: [
        '',
        [Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
  }

  btnBienesDictamen() {
    console.log('Bienes Dictamen');
  }

  btnDictamenes() {
    console.log('Dictamenes');
  }

  btnCargarIdentificador() {
    console.log('Identificador');
  }

  btnExpedientesCsv() {
    console.log('Expedientes csv');
  }

  btnExpedientesXls() {
    console.log('Expedientes xls');
  }

  btnCrearDictamenes() {
    console.log('Dictamenes');
  }

  btnImprimeOficio() {
    console.log('Oficio');
  }

  btnImprimeRelacionBienes() {
    console.log('Relacion Bienes');
  }

  btnImprimeRelacionExpediente() {
    console.log('Relacion Expediente');
  }
}
