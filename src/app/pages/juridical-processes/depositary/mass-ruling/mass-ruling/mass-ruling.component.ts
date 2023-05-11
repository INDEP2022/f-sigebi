/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { getDataFromExcel, showToast } from 'src/app/common/helpers/helpers';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MassiveDictationService } from 'src/app/core/services/ms-massivedictation/massivedictation.service';
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
      goodNumber: {
        title: 'No. Bien',
        valuePrepareFunction: (data: any) => {
          return data ? data.id : '';
        },
      },
      fileNumber: {
        title: 'No. Expediente',
        valuePrepareFunction: (data: any) => {
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
  dataTableErrors = [
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
    private notificationsService: NotificationService,
    private massiveDictationService: MassiveDictationService,
    private documentsService: DocumentsService
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
      passOfficeArmy: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      expedientNumber: ['', Validators.required],
      typeDict: '',
      statusDict: ['', [Validators.pattern(STRING_PATTERN)]],
      dictDate: '',
      userDict: ['', [Validators.pattern(STRING_PATTERN)]],
      instructorDate: '',
      wheelNumber: '',
      delete: false,
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

  private showToasterError(message: string) {
    showToast({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  btnBienesDictamen() {
    const identifier = this.formCargaMasiva.get(
      'identificadorCargaMasiva'
    ).value;

    if (!identifier) {
      this.showToasterError('Debe ingresar el identificador de carga masiva');
      return;
    }

    if (this.dataTable.length === 0 || this.dataTable[0].id !== identifier) {
      this.showToasterError(
        'No se tiene datos cargados de identificador o debe cargar el identificador'
      );
      return;
    }

    if (this.dataTable[0].id !== identifier) {
      this.showToasterError(
        'El identificador ingresado no coincide con el de la tabla'
      );
      return;
    }

    this.alertQuestion(
      'warning',
      'Confirmación',
      'Los Bienes del Dictamen serán eliminados, desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        const id = this.formCargaMasiva.get('identificadorCargaMasiva').value;
        // TODO: Esperando resolucion de incidencia 785 para comprobación eliminación de carga masiva
        this.massiveDictationService.deleteGoodOpinion(id).subscribe({
          next: data => {
            this.loading = false;
            console.log(data);
            showToast({
              icon: 'success',
              text: 'Proceso Terminado',
            });
          },
          error: err => {
            this.loading = false;
            console.log(err);
            this.showToasterError(err.error.message);
          },
        });
      }
    });
  }

  close() {
    this.modalService.hide();
  }

  btnDictamenes() {
    const armyOfficeKey = this.form.get('passOfficeArmy').value;
    if (!armyOfficeKey) {
      showToast({
        icon: 'error',
        text: 'Debe ingresar la clave de la oficina del ejercito',
      });
      return;
    }
    this.documentsService.postCountDictationGoodFile(armyOfficeKey).subscribe({
      next: data => {},
    });
    console.log('Dictamenes');
  }

  btnCargarIdentificador() {
    const identificador = this.formCargaMasiva.get(
      'identificadorCargaMasiva'
    ).value;
    if (!identificador) {
      showToast({
        icon: 'error',
        text: 'Debe ingresar un identificador de carga masiva',
      });
      return;
    }
    this.loading = true;

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

  handleUpload(event: any): string {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const result: string = reader.result as string;
        return result.split(',')[1];
      };

      return '';
    } else {
      return '';
    }
  }

  btnExpedientesCsv(event: any) {
    // console.log(event);
    // const base64 = this.handleUpload(event);

    // if (base64) {
    //   this.massiveGoodService.massivePropertyExcel({ base64 }).subscribe({
    //     next: data => {
    //       console.log(data);
    //     },
    //     error: err => {
    //       console.log(err);
    //     },
    //   });
    // }
    getDataFromExcel(event.target.files[0]).then(data => {
      console.log({ data });
      // this.dataTable = data;
    });
  }

  btnExpedientesXls(event: any) {
    // if (!this.form.get('id').value && !this.form.get('typeDict').value) {
    //   this.alert('info', 'Se debe ingresar un dictamen', '');
    //   return;
    // }
    getDataFromExcel(event.target.files[0]).then(data => {
      console.log({ data });
      // this.dataTable = data;
    });

    // const base64 = this.handleUpload(event);

    // if (base64) {
    //   this.massiveGoodService.massivePropertyExcel({ base64 }).subscribe({
    //     next: data => {
    //       console.log(data);
    //     },
    //     error: err => {
    //       console.log(err);
    //     },
    //   });
    // }
  }

  isDisableCreateDictation = false;
  async btnCrearDictamenes() {
    let vNO_OF_DICTA;
    if (this.form.invalid) {
      this.alert('error', 'Se debe ingresar un dictamen', '');
      return;
    }

    try {
      const dictation = await this.getDictationForId();
      console.log(dictation);
      vNO_OF_DICTA = dictation.id;
    } catch (error) {
      this.alert('error', 'No se encontró el dictamen', '');
      return;
    }
    const body = {
      p_no_of_dicta: this.form.get('id').value,
      p_tipo_dictaminacion: this.form.get('typeDict').value,
    };
    this.dictationService.postCargaMasDesahogob(body).subscribe({
      next: () => {
        this.isDisableCreateDictation = true;
        this.dataTableErrors = [];
      },
      error: () => {
        this.alert('error', 'Error inesperado en el proceso.', '');
      },
    });

    // this.dictationService.create(this.form.value).subscribe({
    //   next: data => {
    //     console.log(data);
    //   },
    //   error: err => {
    //     console.log(err);
    //   },
    // });
  }

  async getDictationForId() {
    const body = {
      id: this.form.get('id').value,
      typeDict: this.form.get('typeDict').value,
    };
    const dictation = await firstValueFrom(this.dictationService.getById(body));
    return dictation;
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
    if (!this.form.get('id').value && !this.form.get('typeDict').value) {
      this.alert('info', 'Se debe ingresar un dictamen', '');
      return;
    }

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
    if (
      !this.form.get('id').value &&
      !this.form.get('typeDict').value &&
      !this.form.get('passOfficeArmy')
    ) {
      this.alert('info', 'Se debe ingresar un dictamen', '');
      return;
    }

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
