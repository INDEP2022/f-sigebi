import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-carga-mas-desahogo',
  templateUrl: './fact-carga-mas-desahogo.component.html',
  styleUrls: ['./fact-carga-mas-desahogo.component.scss'],
})
export class FactCargaMasDesahogoComponent {
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

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      noOficio: '', //*
      tipoDictaminacion: '',
      fecha: '',
      estatus: '',
      claveOficioArmada: '',
      fechaInstructora: '',
      usuarioDictamina: '',
      noVolante: '',
      noExpediente: '',
      eliminar: '', // Check
    });
    this.formCargaMasiva = this.fb.group({
      identificadorCargaMasiva: '',
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

  /**
   * Formulario
   */
  //  public returnField(form, field) { return form.get(field); }
  //  public returnShowRequirements(form, field) {
  //    return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched;
  //  }
}
