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
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { IncidentMaintenanceService } from 'src/app/core/services/ms-generalproc/incident-maintenance.service';
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
  maxDate: Date = new Date();
  deleteGoodDictamen: boolean;
  dictaminacion: any;
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
        sort: false,
        title: 'No. Bien',
        // valuePrepareFunction: (data: any) => {
        //   return data ? data.id : '';
        // },
      },
      fileNumber: {
        sort: false,
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
        sort: false,
        title: 'Errores del proceso',
      },
    },
  };
  // Data table
  dataTableErrors: { processId: any; description: string }[] = [];
  totalItemsErrors = 0;
  paramsErrors = new BehaviorSubject<ListParams>(new ListParams());

  btnsEnabled = {
    btnDictation: false,
    btnGoodDictation: false,
  };

  public form = new FormGroup({
    /**@description no_of_dicta */
    id: new FormControl(''),
    /**@description clave_oficio_armada */
    passOfficeArmy: new FormControl('', [
      Validators.pattern(KEYGENERATION_PATTERN),
    ]),
    /**@description no_expediente */
    expedientNumber: new FormControl(''),
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
    delete: new FormControl({ value: false, disabled: false }),
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
    private authService: AuthService,
    private dictationXGood1Service: DictationXGood1Service,
    private documentsDictumStatetMService: DocumentsDictumStatetMService,
    protected incidentMaintenanceService: IncidentMaintenanceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form.get('wheelNumber').valueChanges.subscribe(x => {
      this.getVolante();
    });
    this.params.pipe(skip(1)).subscribe(params => {
      this.loadDataForDataTable(params);
    });

    this.paramsErrors.pipe(skip(1)).subscribe(params => {
      this.getTmpErrores(params);
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
    this.expedientNumber = id;
    if (!id && !wheelNumber) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe ingresar un número de dictaminacion o un número de volante'
      );
      return;
    }

    // this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    //  let data = this.params.value;
    //   data.limit = 1;
    let params = `?limit=1&page=1`;

    if (id) {
      params += `&filter.id=${id}`;
    }

    if (wheelNumber) {
      params += `&filter.wheelNumber=${wheelNumber}`;
    }

    const paramsSearch = this.generateParamsSearchDictation();
    Object.keys(paramsSearch).forEach(key => {
      params += `&${key}=${paramsSearch[key]}`;
    });
    this.dictationService.getAllWithFilters(params).subscribe({
      next: data => {
        if (data.count > +1) {
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
        this.onLoadToast(
          'warning',
          'advertencia',
          'Sin datos para la informacion suministrada'
        );
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
    //this.getDictations(parseInt(id), wheelNumber);
    this.getDictationForId('find');
  }

  close() {
    this.modalService.hide();
  }

  async onClickGoodDictation() {
    console.log(this.dictaminacion);
    let bodyDelete: any = {};
    this.dictationService.getTmpExpDesahogoByExpedient(793877).subscribe({
      next: data => {
        console.log(data);
        bodyDelete['officialNumber'] = this.dictaminacion.expedientNumber;
        bodyDelete['typeDictum'] = this.dictaminacion.typeDict;
        console.log(bodyDelete);
      },
      error: err => {
        this.onLoadToast(
          'warning',
          '',
          'No Se Han encontrado Bienes Relacionados'
        );
      },
    });

    if (this.dataTable.length < 1) {
      this.onLoadToast(
        'warning',
        '',
        'No Se Tiene Datos Cargados En la Tabla de Carga Masiva'
      );
      return;
    }
    const question = await this.alertQuestion(
      'warning',
      'Confirmación',
      'Los Bienes del Dictamen Serán Eliminados ¿Desea Continuar?'
    );
    if (!question.isConfirmed) {
      return;
    }

    let body: any = {};
    if (this.isFileLoad) {
      body['goodIds'] = /* this.dataTable.map(x => {
        return { no_bien: x.goodNumber }; 
      });*/ this.dataFile.map(x => {
        return { no_bien: x.goodNumber };
      });
    } else {
      if (!this.formCargaMasiva.value.identificadorCargaMasiva) {
        this.onLoadToast(
          'warning',
          '',
          'Debe Ingresar Un Identificador de Carga Masiva y Cargar los Bienes del Identificador'
        );
        return;
      }

      body['identifier'] = this.formCargaMasiva.value.identificadorCargaMasiva;
      this.btnsEnabled.btnGoodDictation = true;
    }
    this.documentsDictumStatetMService.removeDictamen(bodyDelete).subscribe({
      next: data => {
        this.onLoadToast('success', 'Bien', 'Eliminado Correctamente');
        this.dataTable = [];
        this.totalItems = 0;
        this.dataTableErrors = [];
        this.totalItemsErrors = 0;
        this.formCargaMasiva.reset();
        this.form.get('delete').setValue(false);
        this.form.get('delete').disable();
        this.btnsEnabled.btnGoodDictation = false;
      },
      error: err => {
        this.onLoadToast('warning', '', 'Error al Eliminar los Bienes');
        this.btnsEnabled.btnGoodDictation = false;
      },
    });
  }

  onClickBtnClear() {
    this.dataTable = [];
    this.totalItems = 0;
    this.dataTableErrors = [];
    this.totalItemsErrors = 0;
    this.formCargaMasiva.reset();
    this.form.reset();
    this.form.get('delete').setValue(false);
    this.form.get('delete').disable();
    this.isFileLoad = false;
  }

  //TODO: FOR TESTING
  async onClickDictation() {
    console.log(this.dictaminacion);
    let bodyDelete: any = {};
    this.dictationService.getTmpExpDesahogoByExpedient(793877).subscribe({
      next: data => {
        console.log(data);
        bodyDelete['ofDictNumber'] = this.dictaminacion.id;
        bodyDelete['id'] = data.data[0].goodNumber;
        bodyDelete['typeDict'] = this.dictaminacion.typeDict;
        console.log(bodyDelete);
      },
      error: err => {
        this.onLoadToast(
          'warning',
          '',
          'No Se Han encontrado Bienes Relacionados'
        );
      },
    });

    const armyOfficeKey = this.form.get('passOfficeArmy').value;
    console.log(armyOfficeKey);
    if (!armyOfficeKey) {
      this.alert(
        'warning',
        'Advertencia',
        'Debe Ingresar la Clave de la Oficina del Ejercito'
      );
      return;
    }

    try {
      const count = await this.CountDictationGoodFile(armyOfficeKey);
      const responseQuestion = await this.alertQuestion(
        'info',
        '',
        'Desea Eliminar el Dictamen: ' + armyOfficeKey,
        'Continuar',
        'Cancelar'
      );
      if (!responseQuestion.isConfirmed) {
        this.btnsEnabled.btnDictation = false;
        return;
      }
      this.onLoadToast(
        'info',
        '',
        `El Total de Expediente a eliminar son: ${count}`
      );
      let usuar;
      try {
        console.log(this.authService.decodeToken());
        const user = this.authService
          .decodeToken()
          .preferred_username?.toUpperCase();
        usuar = await this.getRtdictaAarusr(user);
      } catch (ex) {
        this.btnsEnabled.btnDictation = false;
        this.alert(
          'info',
          '',
          'Su Usuario No Tiene Permiso Para Eliminar Registros'
        );
        return;
      }

      if (usuar?.user) {
        console.log(bodyDelete);
        this.dictationXGood1Service.removDictamen(bodyDelete).subscribe({
          next: data => {
            this.alert('success', 'Dictamen', 'Proceso terminado');
          },
          error: err => {
            this.alert('error', '', 'Error Desconocido Consulte a Su Analista');
          },
        });
        // await this.procedureDeleteDictationMoreTax(armyOfficeKey);
        this.alert('success', 'Dictamen', 'Proceso terminado');
        this.btnsEnabled.btnDictation = false;
      } else {
        this.alert(
          'error',
          '',
          'Su Usuario No Tiene Permiso Para Eliminar Registros'
        );
        this.btnsEnabled.btnDictation = false;
      }
    } catch (ex: any) {
      this.btnsEnabled.btnDictation = false;
      this.alert('error', '', 'Error Desconocido Consulte a Su Analista');
    }
  }

  onClickLoadByIdentifier(): void {
    this.isFileLoad = false;
    this.dataTable = [];
    this.totalItems = 0;
    this.dataTableErrors = [];
    this.totalItemsErrors = 0;
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
        'Debe Ingresar un Identificador de Carga Masiva'
      );
      this.totalItems = 0;
      return;
    }
    this.loading = true;
    const params = `?filter.id=${identificador}&page=${listParams.page}&limit=${listParams.limit}`;
    console.log(params);
    this.massiveGoodService.getAllWithFilters(params).subscribe({
      next: data => {
        console.log('rrrrrrr', data);
        this.dataTable = data.data.map(item => {
          return {
            goodNumber: (item.goodNumber as any)?.id,
            fileNumber: (item.fileNumber as any)?.id,
          };
        });
        this.totalItems = data.count;
        this.loading = false;
        // this.file = null;
      },
      error: () => {
        this.dataTable = [];
        this.totalItems = 0;
        this.dataTableErrors = [];
        this.totalItemsErrors = 0;
        // this.file = null;
        this.loading = false;
      },
    });
  }

  dataFile: { goodNumber: number; fileNumber: number }[];

  async onClickLoadFile(event: any) {
    console.log(event.target.files);
    this.dataTableErrors = [];
    this.dataTable = [];
    this.totalItemsErrors = 0;
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

    this.fileInput.nativeElement.value = null;
  }

  async onClickPrintOffice() {
    try {
      const { CLAVE_ARMADA, PARAMFORM, P_OFICIO, TIPO_DIC, TIPO_VOL, vIDENTI } =
        await this.prePrints();
      console.log({
        CLAVE_ARMADA,
        PARAMFORM,
        P_OFICIO,
        TIPO_DIC,
        TIPO_VOL,
        vIDENTI,
      });
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

  async btnExpedientesXls(event: any) {
    console.log('event', event);
    const data = await getDataFromExcel(event.target.files[0]);
    if (!this.validateExcel(data)) {
      return;
    }
  }

  isDisableCreateDictation = false;

  async onClickCreatedDictation() {
    if (
      this.form.value.instructorDate ||
      this.form.value.dictDate ||
      this.form.value.expedientNumber ||
      this.form.value.id ||
      this.form.value.passOfficeArmy ||
      this.form.value.statusDict ||
      this.form.value.typeDict ||
      this.form.value.userDict ||
      this.form.value.wheelNumber
    ) {
      this.alert('error', '', 'Se Debe Ingresar la Informacion de Un Dictamen');
      return;
    }
    let vNO_OF_DICTA;
    if (this.form.invalid) {
      this.alert('error', '', 'Se Debe Ingresar la Informacion de Un Dictamen');
      return;
    }
    if (!this.form.value.id && !this.form.value.typeDict) {
      this.alert('error', '', 'Se Debe Ingresar la Informacion de Un Dictamen');
      return;
    }

    try {
      const dictation = await this.getDictationForId('find');
      vNO_OF_DICTA = dictation;
    } catch (error) {
      this.alert('error', '', 'No Se Encontró el Dictamen');
      return;
    }
    const body = {
      p_no_of_dicta: Number.parseInt(this.form.get('id').value),
      p_tipo_dictaminacion: this.form.get('typeDict').value,
    };
    // debugger;
    ////////////////////////////////////Hay que revisar por que si se le envia todo no realiza la insercion correctamente.
    console.log(body);
    this.dictationService.postCargaMasDesahogob(body).subscribe({
      next: () => {
        this.isDisableCreateDictation = true;
        this.dataTableErrors = [];
      },
      error: e => {
        console.log({ e });
        this.alert('error', '', 'Error Inesperado En el Proceso.');
      },
    });
  }

  async getDictationForId(type: string) {
    let body: any;
    if (this.form.value.typeDict == '') {
      body = {
        id: this.form.value.id,
        typeDict: null,
      };
    } else {
      body = {
        id: this.form.value.id,
        typeDict: this.form.value.typeDict,
      };
    }

    this.dictationService.findByIds(body).subscribe({
      next: data => {
        const dictation = data;
        this.dictaminacion = data;
        console.log(data);
        // this.openMoreOneResults();
        return dictation;
      },
      error: error => {
        console.log(error);
      },
    });
    if (type == 'find') {
      this.openMoreOneResults();
    }
  }

  getVolante() {
    if (this.form.get('wheelNumber').value) {
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
      this.alert(
        'info',
        '',
        'LLene los Campos: Numero Expediente, Numero Dictaminación y Tipo Dictaminación'
      );
      this.form.value.delete = false;
      event.target.checked = !target.checked;
      return;
    }

    if (target.checked) {
      this.isDisabledBtnGoodDictation = false;
      this.isDisableCreateDictation = true;
    } else {
      this.isDisabledBtnGoodDictation = true;
      this.isDisableCreateDictation = false;
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
    let vTIPO_VOLANTE: any;
    let vIDENTI = '';
    console.log({ id, typeDict, passOfficeArmy });
    if (!id && !typeDict && !passOfficeArmy) {
      this.alert('warning', 'Error', 'Se Debe Ingresar un Dictamen.');
      throw new Error('Se debe ingresar un Dictamen.');
    }

    try {
      await this.getDictationForId('other');
    } catch (error) {
      this.alert('warning', 'Error', 'No se encontró un Dictamen');
      throw 'No se encontró un Dictamen';
    }

    try {
      vIDENTI = await this.findGoodAndDictXGood1();
      console.log(vIDENTI);
    } catch (error: any) {
      if (error.status >= 400 && error.status < 500) {
        this.alert(
          'warning',
          '',
          'No Se Encontró Identificador en el Dictamen.'
        );
        throw error;
      }
      this.alert('warning', 'info', error?.message);
      throw error;
    }

    try {
      const notification = await this.getNotificationWhereWheelNumber();
      vTIPO_VOLANTE = notification;
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
        console.log('habemus pdf');
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
        this.onLoadToast('error', '', 'Reporte No Disponible');
      },
    });
  }

  async getNotificationWhereWheelNumber() {
    const { wheelNumber } = this.form.value;
    const queryParams = `filter.wheelNumber=$eq:${wheelNumber || ''}&limit=1`;
    console.log(queryParams);
    const notification = await firstValueFrom(
      this.notificationsService.getAllFilter(queryParams)
    );
    console.log(notification.data);
    return notification.data;
  }

  async findGoodAndDictXGood1(): Promise<any> {
    const body = {
      id: this.form.value.id,
      typeDict: this.form.value.typeDict,
    };
    console.log(body);
    const data = [];
    data.push(
      await firstValueFrom(this.dictationService.postFindGoodDictGood1(body))
    );
    console.log(data);
    if (data?.length > 1) {
      throw new Error('Se tiene varios identificadores en el Dictamen.');
    }

    return data;
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
          sort: false,
        },
        expedientNumber: {
          title: 'No. de Expediente',
          sort: false,
        },
        wheelNumber: {
          title: 'No. de Volante',
          sort: false,
        },
        typeDict: {
          title: 'Tipo de Dictamen',
          sort: false,
        },
        status: {
          title: 'Estatus',
          sort: false,
        },
      },
      totalItems: data ? data.count : 0,
      ms: 'dictation',
      path: 'dictation',
    };

    const modalRef = this.modalService.show(HasMoreResultsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onClose.pipe(take(1)).subscribe(result => {});
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
