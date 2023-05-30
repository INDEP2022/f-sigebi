/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { getDataFromExcel, showToast } from 'src/app/common/helpers/helpers';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { MassiveDictationService } from 'src/app/core/services/ms-massivedictation/massivedictation.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { MassRullingResponses } from '../tools/mass-rulling-responses';

@Component({
  selector: 'app-mass-ruling',
  templateUrl: './mass-ruling.component.html',
  styleUrls: ['./mass-ruling.component.scss'],
})
export class MassRulingComponent
  extends MassRullingResponses
  implements OnInit, OnDestroy
{
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
      description: {
        title: 'Errores del proceso',
      },
    },
  };
  // Data table
  dataTableErrors: { processId: any; description: string }[] = [];

  btnsEnabled = {
    btnDictation: false,
    btnGoodDictation: false,
  };

  public form = new FormGroup({
    id: new FormControl(null, Validators.required),
    passOfficeArmy: new FormControl('', [
      Validators.pattern(KEYGENERATION_PATTERN),
    ]),
    expedientNumber: new FormControl(null),
    typeDict: new FormControl(''),
    statusDict: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    dictDate: new FormControl(''),
    userDict: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    instructorDate: new FormControl(''),
    wheelNumber: new FormControl('', Validators.required),
    delete: new FormControl({ value: false, disabled: true }),
  });
  public formCargaMasiva = new FormGroup({
    identificadorCargaMasiva: new FormControl('', [
      Validators.required,
      Validators.pattern(KEYGENERATION_PATTERN),
    ]),
  });
  isDisabledBtnGoodDictation = true;
  file: File | null = null;
  // public searchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    protected dictationService: DictationService,
    // private goodService: GoodService,
    private massiveGoodService: MassiveGoodService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private notificationsService: NotificationService,
    protected massiveDictationService: MassiveDictationService,
    protected documentsService: DocumentsService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.form.get('wheelNumber').valueChanges.subscribe(x => {
    //   this.getVolante();
    // });
  }

  getDictations(
    // params: ListParams,
    id: number,
    wheelNumber: number
  ) {
    this.expedientNumber = id;
    if (!id && !wheelNumber) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe ingresar un número de dictaminacion o un número de volante'
      );
      return;
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.limit = 1;

    if (id) {
      data.addFilter('id', id);
    }

    if (wheelNumber) {
      data.addFilter('wheelNumber', wheelNumber);
    }

    this.dictationService.getAllWithFilters(data.getParams()).subscribe({
      next: data => {
        console.log(data);
        this.form.patchValue(data.data[0] as any);
        this.form
          .get('instructorDate')
          .patchValue(new Date(data.data[0].instructorDate) as any);
        this.form
          .get('dictDate')
          .patchValue(new Date(data.data[0].dictDate) as any);
        // this.searchForm.get('wheelNumber').patchValue(data.data[0].wheelNumber);
        // this.searchForm
        //   .get('expedientNumber')
        //   .patchValue(data.data[0].expedientNumber);
      },
      error: err => {
        this.loading = false;
        this.form.reset();
      },
    });
  }

  searchDictation() {
    const id = this.form.get('id').value;
    const wheelNumber = this.form.get('wheelNumber').value as any;
    this.getDictations(id, wheelNumber);
  }

  close() {
    this.modalService.hide();
  }

  uploadForFileGoodDictation() {}

  async uploadForIdentifier() {
    if (!this.dataTable[0].hasOwnProperty('id')) {
      this.onLoadToast(
        'warning',
        'No se tiene datos cargados en la tabla de carga masiva'
      );
      return;
    }
    const question = await this.alertQuestion(
      'warning',
      'Confirmación',
      'Los Bienes del Dictamen serán eliminados, desea continuar?'
    );
    if (!question.isConfirmed) {
      return;
    }

    const identifier = this.dataTable[0].id;
    this.btnsEnabled.btnGoodDictation = true;
    this.massiveDictationService.deleteGoodOpinion(identifier).subscribe({
      next: () => {
        this.onLoadToast('success', 'Proceso Terminado');
        this.dataTable = [];
        this.formCargaMasiva.reset();
        this.form.get('delete').setValue(false);
        this.form.get('delete').disable();
        this.btnsEnabled.btnGoodDictation = false;
        this.file = null;
      },
      error: err => {
        console.log(err);
        this.onLoadToast(
          'warning',
          'Error al eliminar los bienes del dictamen'
        );
        this.btnsEnabled.btnGoodDictation = false;
      },
    });
  }

  onClickGoodDictation() {
    if (this.dataTable.length < 1) {
      this.onLoadToast(
        'warning',
        'No se tiene datos cargados en la tabla de carga masiva'
      );
      return;
    }

    if (this.file) {
      this.uploadForFileGoodDictation();
    } else {
      this.uploadForIdentifier();
    }

    // let identifier: number = null;
    // if (this.dataTable[0].hasOwnProperty('id')) {
    //   identifier = this.dataTable[0].id;
    // } else {
    //   this.onLoadToast(
    //     'warning',
    //     'No se tiene datos cargados en la tabla de carga masiva'
    //   );
    //   return;
    // }

    // this.alertQuestion(
    //   'warning',
    //   'Confirmación',
    //   'Los Bienes del Dictamen serán eliminados, desea continuar?'
    // ).then(question => {
    //   if (question.isConfirmed) {
    //     this.loading = true;
    //     // TODO: Esperando resolucion de incidencia 785 para comprobación eliminación de carga masiva
    //     this.massiveDictationService.deleteGoodOpinion(identifier).subscribe({
    //       next: data => {
    //         this.loading = false;
    //         console.log(data);
    //         showToast({
    //           icon: 'success',
    //           text: 'Proceso Terminado',
    //         });
    //         this.dataTable = [];
    //         this.formCargaMasiva.reset();
    //         this.form.get('delete').setValue(false);
    //         this.isDisabledBtnGoodDictation = true;
    //         this.form.get('delete').disable();
    //       },
    //       error: err => {
    //         this.loading = false;
    //         console.log(err);
    //         this.onLoadToast('warning', err.error.message);
    //       },
    //     });
    //   }
    // });
  }

  //TODO: FOR TESTING
  async onClickDictation() {
    console.log(this.authService.decodeToken());
    const armyOfficeKey = this.form.get('passOfficeArmy').value;
    if (!armyOfficeKey) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe ingresar la clave de la oficina del ejercito'
      );
      return;
    }
    try {
      this.btnsEnabled.btnDictation = true;
      await this.CountDictationGoodFile(armyOfficeKey);
    } catch (ex) {
      this.btnsEnabled.btnDictation = false;
      this.alert('error', 'Error', 'Error desconocido Consulte a su Analista');
      return;
    }

    this.alertQuestion(
      'info',
      'Información',
      'Desea eliminar el Dictamen: ' + this.form.get('passOfficeArmy').value
    ).then(async question => {
      if (!question.isConfirmed) {
        this.btnsEnabled.btnDictation = false;
        return;
      }
      let usuar;
      try {
        const user = this.authService.decodeToken().name;
        usuar = await this.getRtdictaAarusr(user);
      } catch (ex) {
        this.btnsEnabled.btnDictation = false;
        this.alert(
          'error',
          'Error',
          'Su usuario no tiene permiso para eliminar registros'
        );
        return;
      }

      if (usuar?.user) {
        try {
          const passOfficeArmy = this.form.get('passOfficeArmy').value;
          await this.procedureDeleteDictationMoreTax(passOfficeArmy);
          this.alert('success', 'Dictamen', 'Proceso terminado');
          this.btnsEnabled.btnDictation = false;
        } catch (ex: any) {
          this.btnsEnabled.btnDictation = false;
          this.alert(
            'error',
            'Error',
            'Error desconocido Consulte a su Analista'
          );
        }
      } else {
        this.alert(
          'error',
          'Error',
          'Su usuario no tiene permiso para eliminar registros'
        );
        this.btnsEnabled.btnDictation = false;
      }
    });
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
        this.file = null;
      },
      error: () => {
        this.dataTable = [];
        this.file = null;
        this.loading = false;
      },
    });
  }

  async onClickLoadFile(event: any) {
    const { id, typeDict } = this.form.value;
    if (!id && !typeDict) {
      showToast({
        icon: 'error',
        text: 'Se debe ingresar un Dictamen.',
      });
      event.target.value = null;
      return;
    }
    this.file = event.target.files[0];
    const data = await getDataFromExcel(this.file);
    if (!this.validateExcel(data)) {
      return;
    }
    const dataTable: any[] = [];
    const dataTableError: any[] = [];
    data.forEach((item: any, index) => {
      if (isNaN(item.NO_BIEN) || isNaN(item.NO_EXPEDIENTE)) {
        dataTableError.push({
          processId: 12345,
          fileNumber: `REGISTRO: ${index + 1}, CONTENIDO NO_BIEN: ${
            item.NO_BIEN
          }, NO_EXPEDIENTE: ${item.NO_EXPEDIENTE} `,
        });
        return;
      }
      dataTable.push({
        goodNumber: { id: item.NO_BIEN },
        fileNumber: { id: item.NO_EXPEDIENTE },
      });
    });
    this.dataTableErrors = dataTableError;
    this.dataTable = dataTable;
    this.form.get('id').setValue(null);
    this.form.get('delete').enable();
    this.form.get('delete').setValue(false);
    this.isDisableCreateDictation = false;
  }

  async onClickPrintOffice() {
    try {
      const { CLAVE_ARMADA, PARAMFORM, P_OFICIO, TIPO_DIC, TIPO_VOL, vIDENTI } =
        await this.prePrints();
      let report = 'RGENREPDICTAMASDES';
      if (vIDENTI.includes('4')) {
        report = 'RGENREPDICTAMASDES_EXT';
      }

      this.printReport(report, {
        CLAVE_ARMADA,
        PARAMFORM,
        P_OFICIO,
        TIPO_DIC,
        TIPO_VOL,
      });
    } catch (ex) {
      console.log({ ex });
    }
  }

  async onClickPrintRelationGood() {
    try {
      const { CLAVE_ARMADA, PARAMFORM, P_OFICIO, TIPO_DIC, TIPO_VOL } =
        await this.prePrints();

      this.printReport('RGENREPDICTAMASREL', {
        CLAVE_ARMADA,
        PARAMFORM,
        P_OFICIO,
        TIPO_DIC,
        TIPO_VOL,
      });
    } catch (ex) {
      console.log({ ex });
    }
  }

  async onClickPrintRelationExpedient() {
    try {
      const { CLAVE_ARMADA, PARAMFORM, P_OFICIO, TIPO_DIC, TIPO_VOL } =
        await this.prePrints();
      this.printReport('RGENREPDICTAMASEXP', {
        CLAVE_ARMADA,
        PARAMFORM,
        P_OFICIO,
        TIPO_DIC,
        TIPO_VOL,
      });
    } catch (ex) {
      console.log({ ex });
    }
  }

  // async btnExpedientesXls(event: any) {
  //   const data = await getDataFromExcel(event.target.files[0]);
  //   if (!this.validateExcel(data)) {
  //     return;
  //   }
  //   console.log({ data });
  // }

  isDisableCreateDictation = false;
  async onClickLoadDictation() {
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
  }

  async getDictationForId() {
    const body = {
      id: this.form.get('id').value,
      typeDict: this.form.get('typeDict').value,
    };
    const dictation = await firstValueFrom(
      this.dictationService.findByIds(body)
    );
    console.log({ dictation });
    return dictation;
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

  changeCbDelete(event: any) {
    let target = event.target;
    const { id, typeDict, expedientNumber } = this.form.value;
    if ((!id && !typeDict) || (!id && !expedientNumber)) {
      this.alert('info', 'No se han cargado los bienes a borrar', '');
      event.target.checked = !target.checked;
      return;
    }

    if (target.checked) {
      this.isDisabledBtnGoodDictation = false;
      this.isDisableCreateDictation = true;
    } else {
      this.isDisabledBtnGoodDictation = true;
    }

    console.log({ event, value: target.checked });
  }

  async prePrints(): Promise<{
    PARAMFORM: string;
    P_OFICIO: string;
    TIPO_DIC: any;
    CLAVE_ARMADA: any;
    TIPO_VOL: any;
    vIDENTI: any;
  }> {
    const { id, typeDict, passOfficeArmy } = this.form.value;
    let vTIPO_VOLANTE = '';
    let vIDENTI = '';
    console.log({ id, typeDict, passOfficeArmy });
    if (!id && !typeDict && !passOfficeArmy) {
      this.alert('warning', 'Error', 'Se debe ingresar un Dictamen.');
      return Promise.reject(null);
    }

    try {
      const dictation = await this.getDictationForId();
    } catch (error) {
      this.alert('warning', 'Error', 'No se encontró un Dictamen ');
      return null;
    }

    try {
      vIDENTI = await this.findGoodAndDictXGood1();
    } catch (error: any) {
      this.alertQuestion('warning', 'Error', error?.message);
      console.log({ error });
      return null;
    }

    try {
      const notification = await this.getNotificationWhereWheelNumber();
      vTIPO_VOLANTE = notification?.wheelType;
    } catch (error) {
      this.alert(
        'warning',
        'Error',
        'No se encontró la Notificación del Dictamen.'
      );
      return null;
    }

    //ERROR: este codigo no implementado de oracle forms
    //   pl_id := Get_Parameter_List(pl_name);
    //  IF Id_Null(pl_id) THEN
    //     pl_id := Create_Parameter_List(pl_name);
    //     IF Id_Null(pl_id) THEN
    //        LIP_MENSAJE('Error al crear lista de parámetros. '||pl_name,'N');
    //        RAISE Form_Trigger_Failure;
    //     END IF;
    //  ELSE
    //     Destroy_Parameter_List(pl_id);
    //     pl_id := Create_Parameter_List(pl_name);
    //  END IF;

    return {
      PARAMFORM: 'NO',
      P_OFICIO: id,
      TIPO_DIC: typeDict,
      CLAVE_ARMADA: passOfficeArmy,
      TIPO_VOL: vTIPO_VOLANTE,
      vIDENTI,
    };
  }

  validateExcel(data: unknown): boolean {
    if (!Array.isArray(data)) {
      this.alert('error', 'No se encontraron datos en el archivo', '');
      return false;
    }
    if (Array.isArray(data) && data.length === 0) {
      this.alert('error', 'No se encontraron datos en el archivo', '');
      return false;
    }
    const columns = ['NO_BIEN', 'NO_EXPEDIENTE'];
    const keysExcel = Object.keys(data[0]);
    if (!keysExcel.every(key => columns.includes(key))) {
      this.alert(
        'error',
        `Columna(s) no encontrada(s), asegúrese de contener esta columnas ${columns.join(
          ','
        )}`,
        ''
      );
      return false;
    }
    return true;
  }

  printReport(report: string, params: any) {
    this.siabService.fetchReport(report, params).subscribe({
      next: response => {
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
      },
      error: () => {
        this.loading = false;
        this.onLoadToast('error', 'No disponible', 'Reporte no disponible');
      },
    });
  }

  async getNotificationWhereWheelNumber() {
    const { wheelNumber } = this.form.value;
    const queryParams = `filter.wheelNumber=${wheelNumber || ''}&limit=1`;
    const notification = await firstValueFrom(
      this.notificationsService.getAllFilter(queryParams)
    );
    console.log({ notification });
    return notification.data[0];
  }

  async findGoodAndDictXGood1(): Promise<any> {
    const body = {
      NO_OF_DICTA: this.form.value.id,
      TIPO_DICTAMINACION: this.form.value.typeDict,
    };
    const data: { data: any[] } = await firstValueFrom(
      this.dictationService.postFindGoodDictGood1(body)
    );
    console.log({ findGoodAndDictXGood1: data });
    if (data?.data.length > 1) {
      throw new Error('Se tiene varios identificadores en el Dictamen.');
    }

    return data.data[0].substr;
  }

  // btnImprimeRelacionBienes() {
  //   if (!this.form.get('id').value && !this.form.get('typeDict').value) {
  //     this.alert('info', 'Se debe ingresar un dictamen', '');
  //     return;
  //   }

  //   let params = {
  //     CLAVE_ARMADA: this.form.controls['passOfficeArmy'].value,
  //     TIPO_DIC: this.form.controls['typeDict'].value,
  //     TIPO_VOL: this.wheelType,
  //   };

  //   console.log(params);

  //   this.siabService
  //     .fetchReport('RGENREPDICTAMASREL', params)
  //     .subscribe(response => {
  //       if (response !== null) {
  //         if (response.body === null || response.code === 500) {
  //           this.alert('error', 'No existe el reporte', '');
  //           return;
  //         }
  //         const blob = new Blob([response], { type: 'application/pdf' });
  //         const url = URL.createObjectURL(blob);
  //         let config = {
  //           initialState: {
  //             documento: {
  //               urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
  //               type: 'pdf',
  //             },
  //             callback: (data: any) => {},
  //           },
  //           class: 'modal-lg modal-dialog-centered',
  //           ignoreBackdropClick: true,
  //         };
  //         this.modalService.show(PreviewDocumentsComponent, config);
  //       }
  //     });
  // }

  // btnImprimeRelacionExpediente() {
  //   if (
  //     !this.form.get('id').value &&
  //     !this.form.get('typeDict').value &&
  //     !this.form.get('passOfficeArmy')
  //   ) {
  //     this.alert('info', 'Se debe ingresar un dictamen', '');
  //     return;
  //   }

  //   let params = {
  //     CLAVE_ARMADA: this.form.controls['passOfficeArmy'].value,
  //     TIPO_DIC: this.form.controls['typeDict'].value,
  //     TIPO_VOL: this.wheelType,
  //   };

  //   this.siabService
  //     .fetchReport('RGENREPDICTAMASEXP', params)
  //     .subscribe(response => {
  //       if (response !== null) {
  //         console.log(response);
  //         if (response.body === null || response.code === 500) {
  //           this.alert('error', 'No existe el reporte', '');
  //           return;
  //         }

  //         const blob = new Blob([response], { type: 'application/pdf' });
  //         const url = URL.createObjectURL(blob);
  //         let config = {
  //           initialState: {
  //             documento: {
  //               urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
  //               type: 'pdf',
  //             },
  //             callback: (data: any) => {},
  //           },
  //           class: 'modal-lg modal-dialog-centered',
  //           ignoreBackdropClick: true,
  //         };
  //         this.modalService.show(PreviewDocumentsComponent, config);
  //       }
  //     });
  // }
}
