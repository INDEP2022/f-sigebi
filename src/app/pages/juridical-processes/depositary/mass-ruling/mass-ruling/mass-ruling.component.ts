/** BASE IMPORT */
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, skip, take } from 'rxjs';
import { HasMoreResultsComponent } from 'src/app/@standalone/has-more-results/has-more-results.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { getDataFromExcel, showToast } from 'src/app/common/helpers/helpers';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
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
  @ViewChild('fileExpedient') fileInput: ElementRef;
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
        // valuePrepareFunction: (data: any) => {
        //   return data ? data.id : '';
        // },
      },
      fileNumber: {
        title: 'No. Expediente',
        // valuePrepareFunction: (data: any) => {
        //   return data ? data.id : '';
        // },
      },
    },
  };
  totalItems = 0;
  // Data table
  dataTable: { goodNumber: number; fileNumber: number }[] = [];
  isFileLoad = false;

  params = new BehaviorSubject<ListParams>(new ListParams());
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
    /**@description no_of_dicta */
    id: new FormControl(null),
    /**@description clave_oficio_armada */
    passOfficeArmy: new FormControl('', [
      Validators.pattern(KEYGENERATION_PATTERN),
    ]),
    /**@description no_expediente */
    expedientNumber: new FormControl(null),
    /**@description tipo_dictaminacion */
    typeDict: new FormControl(''),
    /**@description estatus_dictaminacion */
    statusDict: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    /**@description fec_dictaminacion */
    dictDate: new FormControl(''),
    /**@description usuario_dictamina */
    userDict: new FormControl('', [Validators.pattern(STRING_PATTERN)]),
    /**@description fecha_instructora */
    instructorDate: new FormControl(''),
    /**@description no_volante */
    wheelNumber: new FormControl(''),
    /**@description nn */
    delete: new FormControl({ value: false, disabled: true }),
  });
  public formCargaMasiva = new FormGroup({
    identificadorCargaMasiva: new FormControl('', [
      Validators.pattern(KEYGENERATION_PATTERN),
    ]),
  });
  isDisabledBtnGoodDictation = true;
  // file: File | null = null;
  // public searchForm: FormGroup;
  constructor(
    // private fb: FormBuilder,
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
    this.params.pipe(skip(1)).subscribe(params => {
      this.loadDataForDataTable(params);
    });
  }

  loadDataForDataTable(listParams: ListParams) {
    if (this.isFileLoad) {
      this.getTmpExpDesahogoB(listParams);
    } else {
      this.loadDataByIdentifier(listParams);
    }
  }

  getDictations(
    // params: ListParams,
    id: number,
    wheelNumber: number
  ) {
    // this.expedientNumber = id;
    // if (!id && !wheelNumber) {
    //   this.alert(
    //     'warning',
    //     'Advertencia',
    //     'Debe ingresar un número de dictaminacion o un número de volante'
    //   );
    //   return;
    // }

    // this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    //  let data = this.params.value;
    //   data.limit = 1;
    let params = `?limit=1&page=1`;

    // if (id) {
    //   params += `&filter.id=${id}`;
    // }

    // if (wheelNumber) {
    //   params += `&filter.wheelNumber=${wheelNumber}`;
    // }

    const paramsSearch = this.generateParamsSearchDictation();
    Object.keys(paramsSearch).forEach(key => {
      params += `&${key}=${paramsSearch[key]}`;
    });

    this.dictationService.getAllWithFilters(params).subscribe({
      next: data => {
        // console.log(data);
        if (data.count > 1) {
          this.openMoreOneResults();
        } else {
          // this.form.patchValue(data.data[0] as any);
          // this.form
          //   .get('instructorDate')
          //   .patchValue(new Date(data.data[0].instructorDate) as any);
          // this.form
          //   .get('dictDate')
          //   .patchValue(new Date(data.data[0].dictDate) as any);
          this.loadValuesDictation(data.data[0]);
        }
      },
      error: err => {
        this.loading = false;
        this.form.reset();
      },
    });
  }

  loadValuesDictation(data: any) {
    this.form.patchValue(data);
    this.form
      .get('instructorDate')
      .patchValue(new Date(data.instructorDate) as any);
    this.form.get('dictDate').patchValue(new Date(data.dictDate) as any);
  }

  searchDictation() {
    const id = this.form.get('id').value;
    const wheelNumber = this.form.get('wheelNumber').value as any;
    this.getDictations(id, wheelNumber);
  }

  close() {
    this.modalService.hide();
  }

  async onClickGoodDictation() {
    if (this.dataTable.length < 1) {
      this.onLoadToast(
        'warning',
        'No se tiene datos cargados en la tabla de carga masiva'
      );
      return;
    }

    if (this.dataTable.length < 1) {
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

    let body: any = {};
    if (this.isFileLoad) {
      body['goodIds'] = this.dataTable.map(x => {
        return { no_bien: x.goodNumber };
      });
    } else {
      body['identifier'] = this.dataTable[0];
      this.btnsEnabled.btnGoodDictation = true;
      // this.uploadForIdentifier();
    }
    this.massiveDictationService.deleteGoodOpinion(body).subscribe({
      next: () => {
        this.onLoadToast('success', 'Proceso Terminado');
        this.dataTable = [];
        this.formCargaMasiva.reset();
        this.form.get('delete').setValue(false);
        this.form.get('delete').disable();
        this.btnsEnabled.btnGoodDictation = false;
        // this.file = null;
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

  onClickBtnClear() {
    this.dataTable = [];
    this.formCargaMasiva.reset();
    this.form.reset();
    this.form.get('delete').setValue(false);
    this.form.get('delete').disable();
    this.isFileLoad = false;
  }

  //TODO: FOR TESTING
  async onClickDictation() {
    const armyOfficeKey = this.form.get('passOfficeArmy').value;
    // if (!armyOfficeKey) {
    //   this.alert(
    //     'warning',
    //     'Advertencia',
    //     'Debe ingresar la clave de la oficina del ejercito'
    //   );
    //   return;
    // }

    try {
      const count = await this.CountDictationGoodFile(armyOfficeKey);
      const responseQuestion = await this.alertQuestion(
        'info',
        'Información',
        'Desea eliminar el Dictamen: ' + armyOfficeKey
      );
      if (!responseQuestion.isConfirmed) {
        this.btnsEnabled.btnDictation = false;
        return;
      }
      this.onLoadToast(
        'info',
        `El Total de Expediente a eliminar son: ${count}`
      );
      let usuar;
      try {
        const user = this.authService
          .decodeToken()
          .preferred_username?.toUpperCase();
        usuar = await this.getRtdictaAarusr(user);
      } catch (ex) {
        this.btnsEnabled.btnDictation = false;
        this.alert(
          'info',
          '',
          'Su usuario no tiene permiso para eliminar registros'
        );
        return;
      }

      if (usuar?.user) {
        await this.procedureDeleteDictationMoreTax(armyOfficeKey);
        this.alert('success', 'Dictamen', 'Proceso terminado');
        this.btnsEnabled.btnDictation = false;
      } else {
        this.alert(
          'error',
          'Error',
          'Su usuario no tiene permiso para eliminar registros'
        );
        this.btnsEnabled.btnDictation = false;
      }
    } catch (ex: any) {
      this.btnsEnabled.btnDictation = false;
      this.alert('error', 'Error', 'Error desconocido Consulte a su Analista');
    }
  }

  onClickLoadByIdentifier(): void {
    this.isFileLoad = false;
    this.dataTable = [];
    this.params.next(new ListParams());
  }

  loadDataByIdentifier(listParams = new ListParams()) {
    this.isFileLoad = false;
    const identificador = this.formCargaMasiva.get(
      'identificadorCargaMasiva'
    ).value;
    if (!identificador) {
      this.onLoadToast(
        'error',
        '',
        'Debe ingresar un identificador de carga masiva'
      );
      return;
    }
    this.loading = true;
    const params = `?filter.id=${identificador}&page=${listParams.page}&limit=${listParams.limit}`;
    this.massiveGoodService.getAllWithFilters(params).subscribe({
      next: data => {
        console.log(data.data);
        this.dataTable = data.data.map(item => {
          return {
            goodNumber: (item.goodNumber as any).id,
            fileNumber: (item.fileNumber as any).id,
          };
        });
        this.totalItems = data.count;
        this.loading = false;
        // this.file = null;
      },
      error: () => {
        this.dataTable = [];
        this.totalItems = 0;
        // this.file = null;
        this.loading = false;
      },
    });
  }
  dataFile: { goodNumber: number; fileNumber: number }[];
  async onClickLoadFile(event: any) {
    this.dataTableErrors = [];
    this.dataTable = [];
    this.isFileLoad = true;
    this.totalItems = 0;
    const { id, typeDict } = this.form.value;
    if (!id && !typeDict) {
      showToast({
        icon: 'error',
        text: 'Se debe ingresar un Dictamen.',
      });
      event.target.value = null;
      return;
    }
    const file = event.target.files[0];
    const data = await getDataFromExcel(file);
    if (!this.validateExcel(data)) {
      this.fileInput.nativeElement.value = null;
      return;
    }
    this.dataFile = data.map((item: any) => {
      return {
        goodNumber: item.NO_BIEN,
        fileNumber: item.NO_EXPEDIENTE,
      };
    });
    this.pupPreviousData({ bienes: this.dataFile });
    // const dataTable: any[] = [];
    // const dataTableError: any[] = [];
    // data.forEach((item: any, index) => {
    //   if (isNaN(item.NO_BIEN) || isNaN(item.NO_EXPEDIENTE)) {
    //     dataTableError.push({
    //       processId: 12345,
    //       description: `REGISTRO: ${index + 1}, CONTENIDO NO_BIEN: ${
    //         item.NO_BIEN
    //       }, NO_EXPEDIENTE: ${item.NO_EXPEDIENTE} `,
    //     });
    //     return;
    //   }
    //   dataTable.push({
    //     goodNumber: item.NO_BIEN ,
    //     fileNumber: item.NO_EXPEDIENTE,
    //   });
    // });
    // this.dataTableErrors = dataTableError;
    // this.dataTable = dataTable;

    this.form.get('id').setValue(null);
    this.form.get('delete').enable();
    this.form.get('delete').setValue(false);
    this.isDisableCreateDictation = false;
    this.fileInput.nativeElement.value = null;
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
  async onClickCreatedDictation() {
    let vNO_OF_DICTA;
    // if (this.form.invalid) {
    //   this.alert('error', 'Se debe ingresar un dictamen', '');
    //   return;
    // }
    if (!this.form.value.id && !this.form.value.typeDict) {
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
      p_no_of_dicta: Number.parseInt(this.form.get('id').value),
      p_tipo_dictaminacion: this.form.get('typeDict').value,
    };
    // debugger;
    this.dictationService.postCargaMasDesahogob(body).subscribe({
      next: () => {
        this.isDisableCreateDictation = true;
        this.dataTableErrors = [];
      },
      error: e => {
        console.log({ e });
        this.alert(
          'error',
          e?.error?.message || 'Error inesperado en el proceso.',
          ''
        );
      },
    });
  }

  async getDictationForId() {
    const body = {
      id: this.form.value.id,
      typeDict: this.form.value.typeDict,
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
      // this.params = new BehaviorSubject<FilterParams>(new FilterParams());
      // let data = this.params.value;

      // data.addFilter('wheelNumber', this.form.get('wheelNumber').value);
      const params = `?filter.wheelNumber=${
        this.form.get('wheelNumber').value
      }&page=1&limit=1`;

      this.notificationsService.getAllFilter(params).subscribe({
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
      throw new Error('Se debe ingresar un Dictamen.');
    }

    try {
      await this.getDictationForId();
    } catch (error) {
      this.alert('warning', 'Error', 'No se encontró un Dictamen');
      throw 'No se encontró un Dictamen';
    }

    try {
      vIDENTI = await this.findGoodAndDictXGood1();
    } catch (error: any) {
      if (error.status >= 400 && error.status < 500) {
        this.alert(
          'warning',
          'info',
          'No se encontró identificador en el Dictamen.'
        );
        throw error;
      }
      this.alert('warning', 'info', error?.message);
      // console.log({ error });
      throw error;
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
      throw 'No se encontró la Notificación del Dictamen.';
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
    // console.log({ findGoodAndDictXGood1: data });
    if (data?.data.length > 1) {
      throw new Error('Se tiene varios identificadores en el Dictamen.');
    }

    return data.data[0].substr;
  }

  showReport(nameReport: string, params: { [key: string]: any }) {
    this.siabService.fetchReport(nameReport, params).subscribe(response => {
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      } else {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      }
    });
  }

  generateParamsSearchDictation() {
    const { id, expedientNumber, wheelNumber } = this.form.value;
    const params: any = {};
    id && (params['filter.id'] = id);
    expedientNumber && (params['filter.expedientNumber'] = expedientNumber);
    wheelNumber && (params['filter.wheelNumber'] = wheelNumber);
    return params;
  }

  openMoreOneResults(data?: IListResponse<any>) {
    let context: Partial<HasMoreResultsComponent> = {
      queryParams: this.generateParamsSearchDictation(),
      columns: {
        id: {
          title: 'Identificador',
        },
        expedientNumber: {
          title: 'Número de expediente',
        },
        wheelNumber: {
          title: 'Número de volante',
        },
        typeDict: {
          title: 'Tipo de dictamen',
        },
        status: {
          title: 'Estatus',
        },
      },
      totalItems: data ? data.count : 0,
      ms: 'dictation',
      path: 'dictation',
    };

    console.log({ context });

    const modalRef = this.modalService.show(HasMoreResultsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onClose.pipe(take(1)).subscribe(result => {
      console.log({ result });
      if (result) {
        this.loadValuesDictation(result);
      }
    });
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
