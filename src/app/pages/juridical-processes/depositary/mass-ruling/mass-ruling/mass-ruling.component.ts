/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
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
  wheelType: string = '';

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
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private notificationsService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    this.form.get('wheelNumber').valueChanges.subscribe(x => {
      this.getVolante();
    });
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
        this.searchForm.get('wheelNumber').patchValue(data.data[0].wheelNumber);
        this.searchForm
          .get('expedientNumber')
          .patchValue(data.data[0].expedientNumber);
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
    this.loading = true;
    const identificador = this.formCargaMasiva.get(
      'identificadorCargaMasiva'
    ).value;

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;

    if (identificador) {
      data.addFilter('id', identificador);
    }
    this.massiveGoodService.getAllWithFilters(data.getParams()).subscribe({
      next: data => {
        this.dataTable = data.data;
        this.loading = false;
        console.log(data.data);
      },
      error: err => {
        this.dataTable = [];
        this.loading = false;
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

  getVolante() {
    if (this.form.get('wheelNumber').value) {
      console.log(this.form.get('wheelNumber').value);
      this.params = new BehaviorSubject<FilterParams>(new FilterParams());
      let data = this.params.value;

      data.addFilter('wheelNumber', this.form.get('wheelNumber').value);

      this.notificationsService.getAllFilter(data.getParams()).subscribe({
        next: data => {
          this.wheelType = data.data[0].wheelType;
        },
        error: err => {
          console.log(err);
        },
      });
    }
  }

  btnImprimeRelacionBienes() {
    let params = {
      CLAVE_ARMADA: this.form.controls['passOfficeArmy'].value,
      TIPO_DIC: this.form.controls['typeDict'].value,
      TIPO_VOL: this.wheelType,
    };

    console.log(params);

    this.siabService
      .fetchReport('RGENREPDICTAMASREL', params)
      .subscribe(response => {
        if (response !== null) {
          if (response.body === null || response.code === 500) {
            this.alert('error', 'No existe el reporte', '');
            return;
          }
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }

  btnImprimeRelacionExpediente() {
    let params = {
      CLAVE_ARMADA: this.form.controls['passOfficeArmy'].value,
      TIPO_DIC: this.form.controls['typeDict'].value,
      TIPO_VOL: this.wheelType,
    };

    this.siabService
      .fetchReport('RGENREPDICTAMASEXP', params)
      .subscribe(response => {
        if (response !== null) {
          console.log(response);
          if (response.body === null || response.code === 500) {
            this.alert('error', 'No existe el reporte', '');
            return;
          }

          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }
}
