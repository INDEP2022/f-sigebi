/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
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
  dataTable: any[] = [];

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
    private goodService: GoodService,
    private massiveGoodService: MassiveGoodService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  getDictations(
    params: ListParams,
    expedientNumber?: number,
    wheelNumber?: number
  ) {
    this.expedientNumber = expedientNumber;
    if (!expedientNumber && !wheelNumber) {
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
        this.form.patchValue(data.data[0]);
        this.form
          .get('instructorDate')
          .patchValue(new Date(data.data[0].instructorDate));
        this.form.get('dictDate').patchValue(new Date(data.data[0].dictDate));
      },
      error: err => {
        this.loading = false;
        this.form.reset();
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
      id: '', //*
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
    const identificador = this.formCargaMasiva.get(
      'identificadorCargaMasiva'
    ).value;

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;

    if (identificador) {
      data.addFilter('id', identificador);
    }
    this.massiveGoodService.getAll().subscribe({
      next: data => {
        this.dataTable = data.data;
      },
      error: err => {
        this.loading = false;
        this.dataTable = [];
      },
    });
  }

  btnExpedientesCsv(value: any) {}

  btnExpedientesXls() {
    if (!this.form.get('id').value && !this.form.get('typeDict').value) {
      this.alert('info', 'Se debe ingresar un dictamen', '');
    }
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
