/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
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
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  expedientNumber: number = null;
  wheelNumber: number = null;

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
  public searchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dictationService: DictationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    this.form.get('noOficio').valueChanges.subscribe(data => {
      this.getDictations(new ListParams(), data);
    });
    this.loading = true;
  }

  getDictations(
    params: ListParams,
    expedientNumber?: number,
    wheelNumber?: number
  ) {
    this.expedientNumber = expedientNumber;
    if (!expedientNumber) {
      return;
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;

    if (expedientNumber) {
      data.addFilter('expedientNumber', expedientNumber);
    }

    if (wheelNumber) {
      data.addFilter('wheelNumber', wheelNumber);
    }

    // this.dataTableNotifications = [];

    this.dictationService.getAllWithFilters(data.getParams()).subscribe({
      next: data => {
        // this.dataTable = data.data;
      },
      error: err => {
        this.loading = false;
      },
    });

    this.dictationService.getAllWithFilters(data.getParams()).subscribe({
      next: data => {
        console.log(data);
      },
    });
  }

  searchDictation() {
    const expedientNumber = this.searchForm.get('expedientNumber').value;
    const wheelNumber = this.searchForm.get('wheelNumber').value;
    this.getDictations(new ListParams(), expedientNumber, wheelNumber);
  }

  private prepareForm() {
    this.form = this.fb.group({
      noOficio: '', //*
      typeDict: '',
      dictDate: '',
      statusDict: ['', [Validators.pattern(STRING_PATTERN)]],
      passOfficeArmy: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      instructorDate: '',
      userDict: ['', [Validators.pattern(STRING_PATTERN)]],
      wheelNumber: '',
      expedientNumber: '',
      delete: '', // Check
    });
    this.searchForm = this.fb.group({
      wheelNumber: null,
      expedientNumber: null,
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
