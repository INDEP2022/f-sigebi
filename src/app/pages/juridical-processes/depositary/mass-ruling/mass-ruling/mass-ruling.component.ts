/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-mass-ruling',
  templateUrl: './mass-ruling.component.html',
  styleUrls: ['./mass-ruling.component.scss'],
})
export class MassRulingComponent extends BasePage implements OnInit, OnDestroy {
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  expedientNumber: number = null;
  wheelNumber: number = null;
  data: LocalDataSource = new LocalDataSource();

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
      id: {
        title: 'No. Bien',
      },
      expediente: {
        title: 'No. Expediente',
        valuePrepareFunction: (data: IExpedient) => {
          return data ? data.id : '';
        },
      },
    },
  };
  // Data table
  dataTable: IGood[] = [];

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
    private dictationService: DictationService,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        this.getGoods(new ListParams());
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(new ListParams()));

    this.prepareForm();

    this.form.get('noOficio').valueChanges.subscribe(data => {
      this.getDictations(new ListParams(), data);
    });
    this.loading = true;

    this.getGoods(new ListParams());
  }

  getGoods(params: ListParams) {
    this.goodService.getAll().subscribe({
      next: data => {
        this.dataTable = data.data;
      },
      error: err => {
        this.loading = false;
      },
    });
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

    this.dictationService.getAllWithFilters(data.getParams()).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        this.loading = false;
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
