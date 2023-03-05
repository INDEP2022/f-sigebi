import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, from, switchMap } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IAuthorityIssuingParams } from 'src/app/core/models/catalogs/authority.model';
import { IExpedientMassiveUpload } from 'src/app/core/models/ms-expedient/expedient';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { IMassiveParams } from 'src/app/core/models/ms-interfacesat/ms-interfacesat.interface';
import { INotificationTransferentIndiciadoCityGetData } from 'src/app/core/models/ms-notification/notification.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import {
  GOODS_BULK_LOAD_ACTIONS,
  GOODS_BULK_LOAD_TARGETS,
  SAT_SAE_INMUEBLES_PROCESO_4,
  SAT_SAE_MUEBLES_PROCESO_4,
} from '../constants/good-bulk-load-data';
import { previewData } from '../interfaces/goods-bulk-load-table';
import { GoodsBulkLoadService } from '../services/goods-bulk-load.table';
import { DeclarationsSatSaeMassive } from '../utils/declarations-sat-massive';
import {
  ERROR_ATRIBUTE_CLASS_GOOD,
  ERROR_CANTIDAD,
  ERROR_CITY_ASUNTO_SAT,
  ERROR_CLASS_GOOD,
  ERROR_ESTATUS,
  ERROR_ESTATUS_GENERAL,
  ERROR_EXPEDIENTE,
  ERROR_EXPEDIENTE_IDENTIFICADOR,
  ERROR_EXPEDIENTE_TRANSFERENTE_INDICIADO_CITY,
  ERROR_EXPORT,
  ERROR_GET_CLAVE_SAT,
  ERROR_GOOD_INMUEBLE,
  ERROR_IDENTIFICADOR_MENAJE,
  ERROR_INDICATOR,
  ERROR_ISSUING_INSTITUTION,
  ERROR_TRANSFERENTE,
  ERROR_TRANSFERENTE_PARAMS,
  ERROR_UNIDAD,
  ERROR_UNITY_CLASS_GOOD,
  FORM_ACTION_TYPE_NULL,
  FORM_IDENTIFICATOR_NULL,
  FORM_INMUEBLES_MUEBLES_CHECK,
  NOT_LOAD_FILE,
  VALIDATION_END_MESSAGE,
  VALIDATION_PROCESS_MESSAGE,
  VALIDATION_START_MESSAGE,
  VALIDATION_UPDATE_PROCESS_MESSAGE,
  VALIDATION_UPLOAD_CREATION_EXPEDIENTE_MESSAGE,
  VALIDATION_UPLOAD_START_MESSAGE,
} from '../utils/goods-bulk-load.message';
import { GOODS_BULK_LOAD_COLUMNS } from './goods-bulk-load-columns';

interface IValidInfoData {
  error: any; // Arreglo de errores encontrados
  opcion: string; // Opcion de la carga masiva
  subOpcion: number; // Opción seleccionada de la carga masiva
  dataRow: any; // Data del registro actual del excel
  contadorRegistro: number; // Contador del registro actual
  objInsertResponse?: any; // Objeto para agregar las respuestas de las consultas al responder
  validLastRequest?: boolean; // Bandera para validar si la respuesta anterior obtuvo respuesta correcta
}

@Component({
  selector: 'app-goods-bulk-load',
  templateUrl: './goods-bulk-load.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: -5px;
        margin-top: -15px;
      }
    `,
  ],
})
export class GoodsBulkLoadComponent extends BasePage implements OnInit {
  DeclarationsSatSaeMassive: DeclarationsSatSaeMassive;
  //Validaciones archivo
  DeclarationsValidationMassive: DeclarationsSatSaeMassive;
  //Validaciones carga de registros
  DeclarationsUploadValidationMassive: DeclarationsSatSaeMassive;
  assetsForm: FormGroup;
  tableSource: previewData[] = [];
  actions = GOODS_BULK_LOAD_ACTIONS.general;
  target = new FormControl<'general' | 'sat' | 'pgr'>('general');
  targets = GOODS_BULK_LOAD_TARGETS;
  get bulkId() {
    return this.assetsForm.get('idCarga');
  }
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  listError: any[] = []; // Guardar lista de errores del proceso
  proceso: number = 0;
  inicioProceso: boolean = false;
  paramsGeneral: IMassiveParams = {
    p_no_oficio: '',
    p_no_volante: '',
    p_no_expediente: '',
    p_sat_tipo_exp: '',
    asunto_sat: '',
    p_indicador_sat: '',
    p_av_previa: '',
    iden: '',
    no_transferente: '',
    desalojo: '',
  };
  infoDataValidation: IValidInfoData = {
    error: null,
    opcion: null,
    subOpcion: null,
    dataRow: null,
    contadorRegistro: null,
    objInsertResponse: null,
    validLastRequest: false,
  };

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodsBulkService: GoodsBulkLoadService,
    private authService: AuthService,
    private globalVarsService: GlobalVarsService,
    private datePipe: DatePipe
  ) {
    super();
    const _settings = { columns: GOODS_BULK_LOAD_COLUMNS, actions: false };
    this.settings = { ...this.settings, ..._settings };
  }

  ngOnInit(): void {
    this.globalVarsService.loadGlobalVars();
    let tk = this.authService.decodeToken();
    console.log(tk);
    let gv = this.globalVarsService.getGlobalVars$();
    console.log(gv);
    this.prepareForm();
  }

  prepareForm() {
    this.assetsForm = this.fb.group({
      actionType: ['Inserción de bienes', [Validators.required]],
      cars: [null, [Validators.required]],
      inmuebles: [null, [Validators.required]],
      desalojo: [false, [Validators.required]],
      idCarga: [null],
    });
  }

  resetProcess() {
    this.listError = [];
    // this.startVariables();
    this.DeclarationsSatSaeMassive = null;
    this.assetsForm.reset();
    this.targetChange();
    this.inicioProceso = false;
    this.resetValidationDataPreload();
    if (this.DeclarationsValidationMassive) {
      this.startVariables(); // Reset proceso carga masiva
    }
  }

  resetValidationDataPreload() {
    // Resetear la info del registro actual
    this.infoDataValidation = {
      error: null,
      opcion: null,
      subOpcion: null,
      dataRow: null,
      contadorRegistro: null,
      objInsertResponse: null,
      validLastRequest: false,
    };
  }

  save() {
    this.DeclarationsSatSaeMassive = undefined;
    setTimeout(() => {
      console.log(this.DeclarationsSatSaeMassive);
      this.assetsForm.markAllAsTouched();
      this.reviewConditions();
    }, 500);
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.tableSource = [];
      let preloadFile = this.excelService.getData<previewData | any>(
        binaryExcel
      );
      preloadFile.forEach((data: any, count: number) => {
        if (count < 6) {
          let objReplace: any = {};
          for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
              if (key) {
                objReplace[key.toLowerCase()] = data[key];
              }
            }
          }
          this.tableSource.push(objReplace);
        }
      });
      let obj: any = {};
      let object: any = this.tableSource[0];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (key) {
            obj[key] = {
              title: key.toLocaleUpperCase(),
              type: 'string',
              sort: false,
            };
          }
        }
      }

      const _settings = { columns: obj, actions: false };
      this.settings = { ...this.settings, ..._settings };
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  desalojoChange() {
    const value = this.assetsForm.get('desalojo').value;
    if (value) this.bulkId.setValidators([Validators.required]);
    if (!value) this.bulkId.clearValidators();
    this.bulkId.updateValueAndValidity();
  }

  targetChange() {
    this.assetsForm.get('actionType').reset();
    const target = this.target.value;
    this.actions = GOODS_BULK_LOAD_ACTIONS[target] ?? [];
    this.assetsForm.get('actionType').setValue(this.actions[0].value);
    this.assetsForm.get('actionType').updateValueAndValidity();
  }

  /**
   * Inicializar variables del proceso de carga masiva
   */
  startVariables(opcion: boolean = false) {
    if (opcion == true) {
      this.DeclarationsUploadValidationMassive =
        new DeclarationsSatSaeMassive();
      this.DeclarationsUploadValidationMassive.common_general = {
        total_errores: 0,
        registro_errores: 0,
        valid: false,
        count: 0,
        total: 0,
        proceso: '',
      };
      this.DeclarationsUploadValidationMassive.data_error = [];
      this.DeclarationsUploadValidationMassive.message_progress = '';
    } else {
      this.DeclarationsValidationMassive = new DeclarationsSatSaeMassive();
      this.DeclarationsValidationMassive.common_general = {
        total_errores: 0,
        registro_errores: 0,
        valid: false,
        count: 0,
        total: 0,
        proceso: '',
      };
      this.DeclarationsValidationMassive.data_error = [];
      this.DeclarationsValidationMassive.message_progress = '';
    }
  }

  /**
   * Revisar las condiciones para comenzar el proceso de carga de registros
   */
  reviewConditions() {
    console.log(this.assetsForm.value, this.target.value);
    if (!this.validLoadFile()) {
      return;
    }
    if (this.target.value == 'sat') {
      console.log('SAT');
      this.validatorPreloadMassiveSat();
    } else if (this.target.value == 'pgr') {
      console.log('PGR');
      this.validatorPreloadMassivePgr();
    } else if (this.target.value == 'general') {
      console.log('GENERAL');
      this.validatorPreloadMassiveGeneral();
    }
  }

  /**
   * Revisa si se tiene un id de carga ingresado
   * @returns Si la validacion es correcta
   */
  validIdCarga() {
    this.assetsForm.get('idCarga').addValidators(Validators.required);
    this.assetsForm.get('idCarga').updateValueAndValidity();
    if (this.assetsForm.get('idCarga').valid) {
      this.assetsForm.get('idCarga').clearValidators();
      this.assetsForm.get('idCarga').updateValueAndValidity();
      return true;
    } else {
      this.onLoadToast('warning', FORM_IDENTIFICATOR_NULL, 'Error');
      return false;
    }
  }

  /**
   * Revisa si se tiene una opción de carga seleccionada
   * @returns Si la validacion es correcta
   */
  validActionType() {
    if (this.assetsForm.get('actionType').value) {
      console.log(this.assetsForm.get('actionType').value);
      // if (
      //   // GOODS_BULK_LOAD_ACTIONS.sat[0].value !=
      //   //   this.assetsForm.get('actionType').value &&
      //   this.assetsForm.get('cars').value ||
      //   this.assetsForm.get('inmuebles').value
      // ) {
      //   this.onLoadToast(
      //     'warning',
      //     FORM_ACTION_TYPE_WITH_CHECK_ERROR(
      //       GOODS_BULK_LOAD_ACTIONS.sat[0].value
      //     ),
      //     'Error'
      //   );
      //   return false;
      // } else {
      if (
        this.assetsForm.get('cars').value &&
        this.assetsForm.get('inmuebles').value
      ) {
        this.onLoadToast(
          'warning',
          FORM_INMUEBLES_MUEBLES_CHECK(
            this.assetsForm.get('cars').value,
            this.assetsForm.get('inmuebles').value
          ),
          'Error'
        );
        return false;
      } else {
        return true;
      }
      // }
    } else {
      this.onLoadToast('warning', FORM_ACTION_TYPE_NULL, 'Error');
      return false;
    }
  }

  /**
   * Revisa si se tiene un archivo cargado
   * @returns Si la validacion es correcta
   */
  validLoadFile() {
    if (this.tableSource.length > 0) {
      return true;
    } else {
      this.onLoadToast('warning', NOT_LOAD_FILE, 'Error');
      return false;
    }
  }

  /**
   * Proceso de validación de carga masiva para la opción SAT_SAE
   */
  validatorPreloadMassiveSat() {
    if (this.validIdCarga() && this.validActionType()) {
      this.startVariables();
      this.proceso = 0;
      if (
        GOODS_BULK_LOAD_ACTIONS.sat[0].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 1
        this.proceso = 1;
      } else if (
        GOODS_BULK_LOAD_ACTIONS.sat[1].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 2
        this.proceso = 2;
      } else if (
        GOODS_BULK_LOAD_ACTIONS.sat[2].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 3
        this.proceso = 3;
      }
      if (
        GOODS_BULK_LOAD_ACTIONS.sat[0].value ==
          this.assetsForm.get('actionType').value &&
        (this.assetsForm.get('cars').value ||
          this.assetsForm.get('inmuebles').value)
      ) {
        // --- PROCESO 4
        this.proceso = 4;
      }
      // Total de registros
      this.DeclarationsValidationMassive.common_general.total =
        this.tableSource.length;
      // Inicia proceso de validación
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_START_MESSAGE;
      // Setear arreglo de lista de errores
      this.listError = [];
      // Se inicia proceso de carga masiva
      this.inicioProceso = true;
      this.DeclarationsValidationMassive.common_general.proceso =
        this.assetsForm.get('actionType').value;
      this.processValidFileSat(0, this.tableSource[0]);
    }
  }

  processValidFileSat(count: number = 0, row: any) {
    console.log(row);
    // if (count <= 5) {
    this.resetValidationDataPreload();
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      VALIDATION_PROCESS_MESSAGE(count + 1);
    let error: any[] = [[], []];
    // Indice actual del contador
    this.DeclarationsValidationMassive.common_general.count = count;
    let data: any = row;
    this.infoDataValidation = {
      error: error,
      opcion: this.target.value,
      subOpcion: this.proceso,
      dataRow: data,
      contadorRegistro: count,
      objInsertResponse: null,
      validLastRequest: false,
    };
    // Procesos comunes
    // --- PROCESO 1
    // --- PROCESO 2
    // --- PROCESO 3
    // --- PROCESO 4
    if (
      this.proceso == 1 ||
      this.proceso == 2 ||
      this.proceso == 3 ||
      this.proceso == 4
    ) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Validando la unidad de medida.';
      console.log(this.DeclarationsValidationMassive.message_progress);
      // Validar Unidad
      if (!data.unidad) {
        error = this.agregarError(error, ERROR_UNIDAD(data.unidad));
      }
      // Validar Estatus
      // if (data.status) {
      this.validStatusColumna(this.infoDataValidation);
    }
  }

  /**
   * Funciones para validar el proceso de SAT_SAE
   */

  async validExpedientColumna(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el Expediente.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Validar Expediente
    if (infoData.dataRow.expediente) {
      await this.goodsBulkService
        .getExpedientById(infoData.dataRow.expediente)
        .subscribe({
          next: res => {
            console.log(res);
            if (res.identifier != infoData.dataRow.identificador) {
              infoData.error = this.agregarError(
                infoData.error,
                ERROR_EXPEDIENTE_IDENTIFICADOR(res.identifier)
              );
              this.infoDataValidation.error = infoData.error; // Setear error
              infoData.validLastRequest = false; // Respuesta incorrecta
            } else {
              infoData.validLastRequest = true; // Respuesta correcta
              this.validStatusColumna(infoData, opcionValid);
            }
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_EXPEDIENTE(infoData.dataRow.status)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            this.validStatusColumna(infoData, opcionValid);
          },
        });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_EXPEDIENTE(infoData.dataRow.status)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      this.validStatusColumna(infoData, opcionValid);
    }
  }

  async validExpedientByNotificationColumna(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando las Notificaciones de Transferente, Indiciado y Ciudad.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    infoData.validLastRequest = true; // Respuesta correcta
    // Validar Notificaciones de Transferente, Indiciado y Ciudad
    if (
      infoData.dataRow.ciudad &&
      infoData.dataRow.contribuyente &&
      infoData.dataRow.exptrans
    ) {
      let paramsReview: INotificationTransferentIndiciadoCityGetData = {
        city: infoData.dataRow.ciudad,
        indiciado: infoData.dataRow.contribuyente,
        transferent: infoData.dataRow.exptrans,
      };
      await this.goodsBulkService
        .getNotificacionesByTransferentIndiciadoCity(paramsReview)
        .subscribe({
          next: res => {
            console.log(res);
            if (res.length > 0) {
              infoData.error = this.agregarError(
                infoData.error,
                ERROR_EXPEDIENTE_TRANSFERENTE_INDICIADO_CITY(
                  infoData.dataRow.exptrans,
                  res[0].wheelNumber
                )
              );
              this.infoDataValidation.error = infoData.error; // Setear error
              infoData.validLastRequest = false; // Respuesta incorrecta
            }
            // Validar Indicator
            this.validIndicatorById(this.infoDataValidation, opcionValid);
          },
          error: err => {
            console.log(err);
            // Validar Indicator
            this.validIndicatorById(this.infoDataValidation, opcionValid);
          },
        });
    } else {
      // Validar Indicator
      this.validIndicatorById(this.infoDataValidation, opcionValid);
    }
  }

  async validIndicatorById(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando las Notificaciones de Transferente, Indiciado y Ciudad.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    infoData.validLastRequest = true; // Respuesta correcta
    // Validar Notificaciones de Transferente, Indiciado y Ciudad
    if (infoData.dataRow.contribuyente) {
      await this.goodsBulkService
        .getIndicatorById(infoData.dataRow.contribuyente)
        .subscribe({
          next: res => {
            console.log(res);
            // Validar Status
            this.validStatusColumna(this.infoDataValidation, opcionValid);
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_INDICATOR(infoData.dataRow.contribuyente)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            // Validar Status
            this.validStatusColumna(this.infoDataValidation, opcionValid);
          },
        });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_INDICATOR(infoData.dataRow.contribuyente)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      // Validar Status
      this.validStatusColumna(this.infoDataValidation, opcionValid);
    }
  }

  async validStatusColumna(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el Estatus.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Validar Estatus
    if (infoData.dataRow.status) {
      await this.goodsBulkService
        .getGoodStatus(infoData.dataRow.status)
        .subscribe({
          next: res => {
            console.log(res);
            infoData.validLastRequest = true; // Respuesta correcta
            this.validClasificationGood(infoData, opcionValid);
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_ESTATUS(infoData.dataRow.status)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            this.validClasificationGood(infoData, opcionValid);
          },
        });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_ESTATUS(infoData.dataRow.status)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      this.validClasificationGood(infoData, opcionValid);
    }
  }

  async validClasificationGood(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando la clasificación del bien.';
    console.log(
      this.DeclarationsValidationMassive.message_progress,
      infoData.dataRow.clasif,
      infoData.contadorRegistro
    );
    // Validar Clasificación de bien
    if (infoData.dataRow.clasif) {
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: this.params.getValue().limit,
      };
      this.params.getValue().getParams();
      params['filter.numClasifGoods'] = '$eq:' + infoData.dataRow.clasif + '';
      await this.goodsBulkService.getGoodssSubtype(params).subscribe({
        next: res => {
          infoData.validLastRequest = true; // Respuesta correcta
          if (res.data.length == 0) {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_CLASS_GOOD(infoData.dataRow.clasif)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
          }
          this.validUnityByClasificationGood(infoData, opcionValid);
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_CLASS_GOOD(infoData.dataRow.clasif)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.validUnityByClasificationGood(infoData, opcionValid);
        },
      });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_CLASS_GOOD(infoData.dataRow.clasif)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      this.validUnityByClasificationGood(infoData, opcionValid);
    }
  }

  async validUnityByClasificationGood(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando la unidad de medida de acuerdo a la clasificación del bien.';
    console.log(
      this.DeclarationsValidationMassive.message_progress,
      infoData.dataRow.clasif,
      infoData.contadorRegistro
    );
    // Validar Unidad de acuerdo al número de Clasificación de bien
    if (infoData.dataRow.clasif) {
      await this.goodsBulkService
        .getUnityByUnityAndClasifGood(infoData.dataRow.clasif)
        .subscribe({
          next: (res: any) => {
            infoData.validLastRequest = true; // Respuesta correcta
            if (res.minunit != infoData.dataRow.unidad) {
              infoData.error = this.agregarError(
                infoData.error,
                ERROR_UNITY_CLASS_GOOD(
                  infoData.dataRow.unidad,
                  infoData.dataRow.clasif
                )
              );
              this.infoDataValidation.error = infoData.error; // Setear error
              infoData.validLastRequest = false; // Respuesta incorrecta
            }
            if (opcionValid == 'sat') {
              // Se termina el proceso 1 y 3
              if (this.proceso == 1 || this.proceso == 3) {
                this.processEndSat(infoData);
              } else {
                this.proceso2SatGeneral(infoData);
              }
            } else if (opcionValid == 'pgr') {
              if (
                !this.assetsForm.get('cars').value &&
                !this.assetsForm.get('inmuebles').value
              ) {
                this.processEndPgr(infoData);
              }
              // Validar para muebles
              if (this.assetsForm.get('cars').value) {
                this.validMuebleSat(infoData, opcionValid);
              }
              // Validar para inmuebles
              if (this.assetsForm.get('inmuebles').value) {
                this.validInmuebleSat(infoData, opcionValid);
              }
            } else {
              // Se termina el proceso 1 y proceso 3
              if (this.proceso == 1 || this.proceso == 3) {
                this.processEndGeneral(infoData);
              } else if (this.proceso == 2) {
                this.proceso2SatGeneral(infoData);
              } else {
                if (
                  !this.assetsForm.get('cars').value &&
                  !this.assetsForm.get('inmuebles').value
                ) {
                  this.processEndGeneral(infoData);
                }
                // Validar para muebles
                if (this.assetsForm.get('cars').value) {
                  this.validMuebleSat(infoData, opcionValid);
                }
                // Validar para inmuebles
                if (this.assetsForm.get('inmuebles').value) {
                  this.validInmuebleSat(infoData, opcionValid);
                }
              }
            }
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_UNITY_CLASS_GOOD(
                infoData.dataRow.unidad,
                infoData.dataRow.clasif
              )
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            if (opcionValid == 'sat') {
              // Se termina el proceso 1 y 3
              if (this.proceso == 1 || this.proceso == 3) {
                this.processEndSat(infoData);
              } else {
                this.proceso2SatGeneral(infoData);
              }
            } else if (opcionValid == 'pgr') {
              if (
                !this.assetsForm.get('cars').value &&
                !this.assetsForm.get('inmuebles').value
              ) {
                this.processEndPgr(infoData);
              }
              // Validar para muebles
              if (this.assetsForm.get('cars').value) {
                this.validMuebleSat(infoData, opcionValid);
              }
              // Validar para inmuebles
              if (this.assetsForm.get('inmuebles').value) {
                this.validInmuebleSat(infoData, opcionValid);
              }
            } else {
              // Se termina el proceso 1 y proceso 3
              if (this.proceso == 1 || this.proceso == 3) {
                this.processEndGeneral(infoData);
              } else if (this.proceso == 2) {
                this.proceso2SatGeneral(infoData);
              } else {
                if (
                  !this.assetsForm.get('cars').value &&
                  !this.assetsForm.get('inmuebles').value
                ) {
                  this.processEndGeneral(infoData);
                }
                // Validar para muebles
                if (this.assetsForm.get('cars').value) {
                  this.validMuebleSat(infoData, opcionValid);
                }
                // Validar para inmuebles
                if (this.assetsForm.get('inmuebles').value) {
                  this.validInmuebleSat(infoData, opcionValid);
                }
              }
            }
          },
        });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_UNITY_CLASS_GOOD(infoData.dataRow.unidad, infoData.dataRow.clasif)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      if (opcionValid == 'sat') {
        // Se termina el proceso 1 y 3
        if (this.proceso == 1 || this.proceso == 3) {
          this.processEndSat(infoData);
        } else {
          this.proceso2SatGeneral(infoData);
        }
      } else if (opcionValid == 'pgr') {
        if (
          !this.assetsForm.get('cars').value &&
          !this.assetsForm.get('inmuebles').value
        ) {
          this.processEndPgr(infoData);
        }
        // Validar para muebles
        if (this.assetsForm.get('cars').value) {
          this.validMuebleSat(infoData, opcionValid);
        }
        // Validar para inmuebles
        if (this.assetsForm.get('inmuebles').value) {
          this.validInmuebleSat(infoData, opcionValid);
        }
      } else {
        // Se termina el proceso 1 y proceso 3
        if (this.proceso == 1 || this.proceso == 3) {
          this.processEndGeneral(infoData);
        } else if (this.proceso == 2) {
          this.proceso2SatGeneral(infoData);
        } else {
          if (
            !this.assetsForm.get('cars').value &&
            !this.assetsForm.get('inmuebles').value
          ) {
            this.processEndGeneral(infoData);
          }
          // Validar para muebles
          if (this.assetsForm.get('cars').value) {
            this.validMuebleSat(infoData, opcionValid);
          }
          // Validar para inmuebles
          if (this.assetsForm.get('inmuebles').value) {
            this.validInmuebleSat(infoData, opcionValid);
          }
        }
      }
    }
  }

  proceso2SatGeneral(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Validar el proceso 2 para SAT
    if (opcionValid == 'sat') {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Validando el identificador.';
      console.log(this.DeclarationsValidationMassive.message_progress);
      // Validar Identificador padre de menaje
      if (!infoData.dataRow.identificador) {
        infoData.error = this.agregarError(
          infoData.error,
          ERROR_IDENTIFICADOR_MENAJE(infoData.dataRow.identificador)
        );
      }
    }
    // Se termina el proceso 2
    if (this.proceso == 2) {
      this.processEndSat(infoData);
    } else {
      if (opcionValid == 'general') {
        // Continuar a validar el proceso 4 para GENERAL
        this.processEndGeneral(infoData);
      } else {
        // Continuar a validar el proceso 4 para SAT
        this.validTransferente(infoData);
      }
    }
  }

  async validTransferente(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el transferente.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Validar transferente para revisar si el transferente es mayor a 10000 y existe en la base de datos
    if (infoData.dataRow.transferente > 10000) {
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: this.params.getValue().limit,
      };
      this.params.getValue().getParams();
      params['filter.idAuthorityIssuerTransferor'] =
        '$eq:' + infoData.dataRow.transferente + '';
      await this.goodsBulkService
        .getNumberTransferenteAuthority(infoData.dataRow.transferente)
        .subscribe({
          next: res => {
            if (res.data.length == 0) {
              infoData.error = this.agregarError(
                infoData.error,
                ERROR_TRANSFERENTE(infoData.dataRow.transferente)
              );
              this.infoDataValidation.error = infoData.error; // Setear error
              infoData.validLastRequest = false; // Respuesta incorrecta
            }
            // Validar para muebles
            if (this.assetsForm.get('cars').value) {
              this.validMuebleSat(infoData, opcionValid);
            }
            // Validar para inmuebles
            if (this.assetsForm.get('inmuebles').value) {
              this.validInmuebleSat(infoData, opcionValid);
            }
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_TRANSFERENTE(infoData.dataRow.transferente)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            // Validar para muebles
            if (this.assetsForm.get('cars').value) {
              this.validMuebleSat(infoData, opcionValid);
            }
            // Validar para inmuebles
            if (this.assetsForm.get('inmuebles').value) {
              this.validInmuebleSat(infoData, opcionValid);
            }
          },
        });
    } else {
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      // Validar para muebles
      if (this.assetsForm.get('cars').value) {
        this.validMuebleSat(infoData, opcionValid);
      }
      // Validar para inmuebles
      if (this.assetsForm.get('inmuebles').value) {
        this.validInmuebleSat(infoData, opcionValid);
      }
    }
  }

  async validMuebleSat(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando los datos requeridos para el mueble.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Opción del check para sólo autos
    const params: ListParams = {
      page: this.params.getValue().page,
      limit: this.params.getValue().limit,
    };
    this.params.getValue().getParams();
    params['filter.classifGoodNumber'] = '$eq:' + infoData.dataRow.clasif + '';
    await this.goodsBulkService
      .getAtributeClassificationGood(infoData.dataRow.clasif)
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data) {
            let dataResponse = this.validateAttributeClassificationgood(
              res.data,
              SAT_SAE_MUEBLES_PROCESO_4
            );
            console.log('VALIDAR MUEBLES CLASIF GOOD', dataResponse);
            this.processEndSat(infoData);
          }
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_ATRIBUTE_CLASS_GOOD(infoData.dataRow.clasif)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.processEndSat(infoData);
        },
      });
  }

  async validInmuebleSat(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando los datos requeridos para el inmueble.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    const params: ListParams = {
      page: this.params.getValue().page,
      limit: this.params.getValue().limit,
    };
    this.params.getValue().getParams();
    params['filter.classifGoodNumber'] = '$eq:' + infoData.dataRow.clasif + '';
    await this.goodsBulkService
      .getAtributeClassificationGood(infoData.dataRow.clasif)
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data) {
            let dataResponse = this.validateAttributeClassificationgood(
              res.data,
              SAT_SAE_INMUEBLES_PROCESO_4
            );
            console.log('VALIDAR INMUEBLES CLASIF GOOD', dataResponse);
            this.processEndSat(infoData);
          }
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_ATRIBUTE_CLASS_GOOD(infoData.dataRow.clasif)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.processEndSat(infoData);
        },
      });
  }

  processEndSat(infoData: IValidInfoData) {
    // Agregar contador de error para el registro
    if (this.DeclarationsValidationMassive.common_general.total_errores > 0) {
      this.DeclarationsValidationMassive.common_general.registro_errores++;
      infoData.error[1].push(infoData.dataRow);
      this.DeclarationsValidationMassive.data_error.push(infoData.error);
      console.log(this.DeclarationsValidationMassive.message_progress);
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_END_MESSAGE;
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Se termino el proceso para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      // Fin del proceso para validar la carga SAT
      this.processValidFileSat(
        infoData.contadorRegistro + 1,
        this.tableSource[infoData.contadorRegistro + 1]
      ); // CONTINUAR PROCESO
    }
  }

  processEndGeneral(infoData: IValidInfoData) {
    // Agregar contador de error para el registro
    if (this.DeclarationsValidationMassive.common_general.total_errores > 0) {
      this.DeclarationsValidationMassive.common_general.registro_errores++;
      infoData.error[1].push(infoData.dataRow);
      this.DeclarationsValidationMassive.data_error.push(infoData.error);
      console.log(this.DeclarationsValidationMassive.message_progress);
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      console.log(this.DeclarationsValidationMassive);
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_END_MESSAGE;
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Se termino el proceso para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      // Fin del proceso para validar la carga GENERAL
      this.processValidFileGeneral(
        infoData.contadorRegistro + 1,
        this.tableSource[infoData.contadorRegistro + 1]
      ); // CONTINUAR PROCESO
    }
  }

  processEndPgr(infoData: IValidInfoData) {
    // Agregar contador de error para el registro
    if (this.DeclarationsValidationMassive.common_general.total_errores > 0) {
      this.DeclarationsValidationMassive.common_general.registro_errores++;
      infoData.error[1].push(infoData.dataRow);
      this.DeclarationsValidationMassive.data_error.push(infoData.error);
      console.log(this.DeclarationsValidationMassive.message_progress);
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_END_MESSAGE;
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Se termino el proceso para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      // Fin del proceso para validar la carga PGR
      this.processValidFilePgr(
        infoData.contadorRegistro + 1,
        this.tableSource[infoData.contadorRegistro + 1]
      ); // CONTINUAR PROCESO
    }
  }

  agregarError(error: any[], messageError: string) {
    // Agregar contador de error
    this.DeclarationsValidationMassive.common_general.total_errores++;
    // Cambiar validador de proceso
    this.DeclarationsValidationMassive.common_general.valid = false;
    // Guardar error y mensaje
    error[0].push(messageError);
    console.log(error, messageError);
    return error;
  }

  /**
   * Validar la respuesta de atributos de clasificacion del bien con los registros cargados
   * @param dataResponse Respuesta con el listado de Atributos de clasificacion del bien
   */
  validateAttributeClassificationgood(
    dataResponse: IAttribClassifGoods[],
    listCompare: any,
    opcionValid: string = 'sat'
  ) {
    let likeVar = 0;
    let equalVar = 0;
    for (let indice = 0; indice < dataResponse.length; indice++) {
      const info = dataResponse[indice];
      if (info) {
        for (
          let index = 0;
          index < listCompare.listSearchExist.length;
          index++
        ) {
          const element = listCompare.listSearchExist[index];
          if (opcionValid == 'sat' || opcionValid == 'general') {
            if (element == 'NUMERO INTERIOR') {
            } else {
              if (element == info.attribute) {
                likeVar = 1;
              }
            }
          } else if (opcionValid == 'pgr') {
            if (element == info.attribute) {
              likeVar = 1;
            }
          }
        }
        for (
          let index = 0;
          index < listCompare.listEqualExist.length;
          index++
        ) {
          const element = listCompare.listEqualExist[index];
          if (opcionValid == 'sat' || opcionValid == 'general') {
            if (element == 'CODIGO POSTAL') {
            } else {
              if (element == info.attribute) {
                equalVar = 1;
              }
            }
          } else if (opcionValid == 'pgr') {
            if (element == info.attribute) {
              equalVar = 1;
            }
          }
        }
      }
    }
    console.log(likeVar, equalVar);
    return { likeVar: likeVar, equalVar: equalVar };
  }

  /**
   * Funciones para validar el proceso de SAT_SAE
   */

  /**
   * Proceso de validación de carga masiva para la opción PGR_SAE
   */

  /**
   * Proceso de validación de carga masiva para la opción PGR
   */
  validatorPreloadMassivePgr() {
    if (this.validIdCarga() && this.validActionType()) {
      this.startVariables();
      this.proceso = 0;
      // Total de registros
      this.DeclarationsValidationMassive.common_general.total =
        this.tableSource.length;
      // Inicia proceso de validación
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_START_MESSAGE;
      // Setear arreglo de lista de errores
      this.listError = [];
      // Se inicia proceso de carga masiva
      this.inicioProceso = true;
      this.DeclarationsValidationMassive.common_general.proceso =
        this.assetsForm.get('actionType').value;
      this.processValidFilePgr(0, this.tableSource[0]);
    }
  }

  processValidFilePgr(count: number = 0, row: any) {
    console.log(row);
    this.resetValidationDataPreload();
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      VALIDATION_PROCESS_MESSAGE(count + 1);
    // if (count <= 5) {
    this.resetValidationDataPreload();
    let error: any[] = [[], []];
    // Indice actual del contador
    this.DeclarationsValidationMassive.common_general.count = count;
    let data: any = row;
    this.infoDataValidation = {
      error: error,
      opcion: this.target.value,
      subOpcion: this.proceso,
      dataRow: data,
      contadorRegistro: count,
      objInsertResponse: null,
      validLastRequest: false,
    };
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando la cantidad.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Validar Cantidad
    if (!data.cantidad) {
      error = this.agregarError(error, ERROR_CANTIDAD(data.cantidad));
    }
    // Validar Estatus
    this.validStatusColumna(this.infoDataValidation, 'pgr');
  }

  /**
   * Proceso de validación de carga masiva para la opción PGR_SAE
   */

  /**
   * Proceso de validación de carga masiva para la opción GENERAL
   */
  /**
   * Proceso de validación de carga masiva para la opción SAT_SAE
   */
  validatorPreloadMassiveGeneral() {
    if (this.validIdCarga() && this.validActionType()) {
      this.startVariables();
      this.proceso = 0;
      if (
        GOODS_BULK_LOAD_ACTIONS.general[0].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 1
        this.proceso = 1;
      } else if (
        GOODS_BULK_LOAD_ACTIONS.general[1].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 2
        this.proceso = 2;
      } else if (
        GOODS_BULK_LOAD_ACTIONS.general[2].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 3
        this.proceso = 3;
      } else if (
        GOODS_BULK_LOAD_ACTIONS.general[3].value ==
          this.assetsForm.get('actionType').value &&
        (this.assetsForm.get('cars').value ||
          this.assetsForm.get('inmuebles').value)
      ) {
        // --- PROCESO 4
        this.proceso = 4;
      }
      // Total de registros
      this.DeclarationsValidationMassive.common_general.total =
        this.tableSource.length;
      // Inicia proceso de validación
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_START_MESSAGE;
      // Setear arreglo de lista de errores
      this.listError = [];
      // Se inicia proceso de carga masiva
      this.inicioProceso = true;
      console.log(this.proceso);
      this.DeclarationsValidationMassive.common_general.proceso =
        this.assetsForm.get('actionType').value;
      this.processValidFileGeneral(0, this.tableSource[0]);
    }
  }

  processValidFileGeneral(count: number = 0, row: any) {
    console.log(row);
    // if (count <= 5) {
    this.resetValidationDataPreload();
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      VALIDATION_PROCESS_MESSAGE(count + 1);
    let error: any[] = [[], []];
    // Indice actual del contador
    this.DeclarationsValidationMassive.common_general.count = count;
    let data: any = row;
    this.infoDataValidation = {
      error: error,
      opcion: this.target.value,
      subOpcion: this.proceso,
      dataRow: data,
      contadorRegistro: count,
      objInsertResponse: null,
      validLastRequest: false,
    };
    // Procesos comunes
    // --- PROCESO 1
    // --- PROCESO 2
    // --- PROCESO 3
    // --- PROCESO 4
    if (
      this.proceso == 1 ||
      this.proceso == 2 ||
      this.proceso == 3 ||
      this.proceso == 4
    ) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Validando el estatus.';
      console.log(this.DeclarationsValidationMassive.message_progress);
      // Validar Estatus
      if (data.status != 'ROP' && this.proceso == 1) {
        error = this.agregarError(error, ERROR_ESTATUS_GENERAL(count + 1));
        this.processEndGeneral(this.infoDataValidation);
      } else {
        // Mensaje de proceso de validación actual
        this.DeclarationsValidationMassive.message_progress =
          'Validando la cantidad.';
        console.log(this.DeclarationsValidationMassive.message_progress);
        // Validar Cantidad
        if (!data.cantidad) {
          error = this.agregarError(error, ERROR_CANTIDAD(data.cantidad));
        }
        if (this.proceso == 4) {
          // Validar notificaciones del expediente
          this.validExpedientByNotificationColumna(
            this.infoDataValidation,
            'general'
          );
        } else {
          // Validar Expediente
          this.validExpedientColumna(this.infoDataValidation, 'general');
        }
      }
    }
  }

  /**
   * Proceso de validación de carga masiva para la opción GENERAL
   */

  /**
   * Exportar a XLSX errores encontrados
   */
  exportXlsx() {
    let errores = [];
    for (
      let index = 0;
      index < this.DeclarationsValidationMassive.data_error.length;
      index++
    ) {
      const element = this.DeclarationsValidationMassive.data_error[index];
      let obj: any = { ...element[1][0] };
      obj['errores'] = '';
      for (let indice = 0; indice < element[0].length; indice++) {
        const elemento = element[0][indice];
        if (elemento) {
          obj['errores'] = obj['errores'] + ' --- ' + elemento;
        }
      }
      errores.push(obj);
    }
    if (errores.length == 0) {
      this.onLoadToast('warning', 'Reporte', ERROR_EXPORT);
    }
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(errores, {
      filename: `errores_${
        this.DeclarationsValidationMassive.common_general.proceso
      }${new Date().getTime()}`,
    });
  }

  /**
   * Validar los registros de los archivos cargados y subir los datos al servidor
   */

  async getGoodById(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el número de bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    await this.goodsBulkService
      .getGoodById(infoData.dataRow.identificador)
      .subscribe({
        next: res => {
          console.log(res);
          infoData.objInsertResponse['vNO_SUBDELEGACION'] =
            res.subDelegationNumber;
          infoData.objInsertResponse['vNO_DELEGACION'] = res.delegationNumber;
          infoData.objInsertResponse['vNO_ETIQUETA'] = res.labelNumber;
          // BUSCAR CLAVE UNICA
          this.searchSatUniqueKey(infoData, opcionValid); // Buscar clave sat
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_GOOD_INMUEBLE(infoData.dataRow.transferente)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta
          this.searchSatUniqueKey(infoData, opcionValid); // Buscar clave sat
        },
      });
  }

  async createGood(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Creando el número de bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    infoData.validLastRequest = true; // Respuesta correcta
    await this.goodsBulkService
      .getGoodById(infoData.dataRow.transferente)
      .subscribe({
        next: res => res,
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_GOOD_INMUEBLE(infoData.dataRow.transferente)
          );
        },
      });
  }

  async searchSatUniqueKey(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Buscando la clave sat.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Parametros para buscar la clave SAT
    let objParams = {
      officeKey: this.paramsGeneral.p_no_oficio,
      asunto: this.paramsGeneral.asunto_sat,
      saeIdTransferencia: infoData.dataRow.transferente, //'56136', //data.transferente,
    };
    if (infoData.dataRow.transferente == null) {
      await this.goodsBulkService.getSatKey(objParams).subscribe({
        next: res => {
          console.log(res);
          this.searchCityByAsuntoSat(infoData, opcionValid);
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_GET_CLAVE_SAT(infoData.dataRow.transferente)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.searchCityByAsuntoSat(infoData, opcionValid);
        },
      });
    }
  }

  async searchCityByAsuntoSat(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Creacion del expediente.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Creacion del bien
    if (infoData.dataRow.descripcion) {
      // Obtener la clave de la ciudad apartir de la clave Asunto SAT
      await this.goodsBulkService
        .searchCityByAsuntoSat(this.paramsGeneral.asunto_sat)
        .subscribe({
          next: res => {
            infoData.objInsertResponse.no_ciudad = res.no_ciudad;
            this.getInstitucionesEmisoras(infoData, opcionValid);
          },
          error: err => {
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              ERROR_CITY_ASUNTO_SAT(this.paramsGeneral.asunto_sat)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            this.getInstitucionesEmisoras(infoData, opcionValid);
          },
        });
    } else {
    }
  }

  async getInstitucionesEmisoras(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Inicia proceso de validación para carga
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPLOAD_CREATION_EXPEDIENTE_MESSAGE;
    // Obtener las instituciones emisoras por numero de institucion (200)
    await this.goodsBulkService.getIssuingInstitutionById('200').subscribe({
      next: res => {
        infoData.objInsertResponse['LST_NOMBRE_INTITUCION'] = res.authorityName;
        this.getEmisoraAutoridad(infoData, opcionValid);
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          ERROR_ISSUING_INSTITUTION('200')
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        this.getEmisoraAutoridad(infoData, opcionValid);
      },
    });
  }

  async getEmisoraAutoridad(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    let issuingParams: IAuthorityIssuingParams = {
      expedientSat: this.paramsGeneral.p_no_expediente,
      transferent: parseInt(
        infoData.objInsertResponse.manualvar_no_transferente
      ),
      city: infoData.objInsertResponse.no_ciudad,
    };
    // Obtener institucion emisora EMISORA Y AUTORIDAD
    await this.goodsBulkService
      .getIssuingInstitutionByParams(issuingParams)
      .subscribe({
        next: res => {
          console.log('emisora autoridad', res);

          if (res.length == 1) {
            infoData.objInsertResponse.no_autoridad = res[0].no_autoridad; // SET AUTORIDAD
            infoData.objInsertResponse.no_emisora = res[0].no_emisora; // SET EMISORA
          } else {
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              ERROR_TRANSFERENTE_PARAMS(1)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
          }
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_TRANSFERENTE_PARAMS(0)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
        },
      });
  }

  async getOTClaveEnt(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Obtener la clave de la entidad federativa apartir de la clave Asunto SAT
    await this.goodsBulkService
      .getEntityFederativeByAsuntoSat(this.paramsGeneral.asunto_sat)
      .subscribe({
        next: res => {
          infoData.objInsertResponse.otclave_federative_entity = res.otclave;
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_CITY_ASUNTO_SAT(this.paramsGeneral.asunto_sat)
          );
        },
      });
  }

  async asociarVolanteExpediente(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Obtener expediente y validar si existe
    await this.goodsBulkService
      .getEntityFederativeByAsuntoSat(this.paramsGeneral.asunto_sat)
      .subscribe({
        next: res => {
          // Continuar sin crear expediente
        },
        error: err => {
          // Crear expediente
          this.validExpedient(infoData, opcionValid);
        },
      });
  }

  async validExpedient(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Validar si existe un expediente
    await this.goodsBulkService
      .getExpedientById(this.paramsGeneral.p_no_expediente)
      .subscribe({
        next: res => {
          let dateNowParse = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
          console.log(res);
          if (!res) {
            this.insertExpedient(infoData, opcionValid);
          }
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_EXPEDIENTE(infoData.dataRow.expediente)
          );
        },
      });
  }

  async insertExpedient(infoData: IValidInfoData, opcionValid: string = 'sat') {
    let dateNowParse = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let expedienteData: IExpedientMassiveUpload = {
      id: this.paramsGeneral.p_no_expediente, // NO EXPEDIENTE FROM PARAMS
      insertedBy: 'USER', // USUARIO SETEADO MANUALMENTE
      insertMethod: 'CARGA MASIVA VOLANTES', // TIPO DE CARGA MASIVA
      insertDate: dateNowParse, // FECHA ACTUAL PARA CARGAR
      nameInstitution: infoData.objInsertResponse.LST_NOMBRE_INSTITUCION, // NOMBRE DE LA INSTITUCION EMISORA
      indicatedName: null, // SE PASA EL VALOR EN NULL
      federalEntityKey: infoData.objInsertResponse.otclave_federative_entity, // ENTIDAD FEDERATIVA CLAVE
      identifier: infoData.dataRow.identificador, // IDENTIFICADOR
      transferNumber: infoData.dataRow.transferente, // NUMERO DE TRANSFERENTE
      expTransferNumber: infoData.dataRow.expediente, // EXPEDIENTE TRANSFER NUMBER
      expedientType: 'T', // TIPO DE EXPEDIENTE
      authorityNumber: infoData.objInsertResponse.no_autoridad, // NUMERO DE AUTORIDAD
      stationNumber: infoData.objInsertResponse.no_emisora, // NUMERO EMISORA
    };
    // Validar si existe un expediente
    await this.goodsBulkService.createExpedient(expedienteData).subscribe({
      next: res => {
        console.log(res);
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          ERROR_EXPEDIENTE(infoData.dataRow.expediente)
        );
      },
    });
  }

  /**
   * Validar el proceso de carga masiva SAT para subir los datos
   */
  validDataUploadSAT(count: number = 0, row: any) {
    // Mensaje de proceso de validación actual
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPDATE_PROCESS_MESSAGE(count + 1);
    // if (count <= 5) {
    let error: any[] = [[], []];
    // Indice actual del contador
    this.DeclarationsUploadValidationMassive.common_general.count = count;
    let data: any = row;
    this.infoDataValidation = {
      error: error,
      opcion: this.target.value,
      subOpcion: this.proceso,
      dataRow: data,
      contadorRegistro: count,
      objInsertResponse: {
        no_ciudad: null,
        otclave_federative_entity: null,
        name_institution: '',
        no_emisora: null,
        no_autoridad: null,
        manualvar_no_transferente: '120',
      },
      validLastRequest: false,
    };
    // Si el asunto_sat existe en parametros
    if (this.paramsGeneral.asunto_sat) {
      // EXISTE ASUNTO SAT
      if (this.proceso == 2) {
        this.getGoodById(this.infoDataValidation, 'sat');
      } else {
      }
    } else {
      // NO EXISTE ASUNTO SAT
    }

    if (this.proceso == 1) {
    } else if (this.proceso == 2) {
    } else if (this.proceso == 3) {
    } else if (this.proceso == 4) {
    }
  }
  /**
   * Validar los registros a subir al sistema antes de cargar la información
   */
  validDataUploadMassive() {
    this.startVariables(true);
    // Inicia proceso de validación para carga
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPLOAD_START_MESSAGE;
    this.paramsGeneral = {
      p_no_oficio: 'OPD/GUANAJUATO/12960/2022',
      p_no_volante: '1558111',
      p_no_expediente: '110-02-00-00-00-2016-1212',
      p_sat_tipo_exp: '',
      asunto_sat: 'AVV070110777',
      p_indicador_sat: '',
      p_av_previa: '',
      iden: '',
      no_transferente: '',
      desalojo: '',
    };
    this.validDataUploadSAT(0, this.tableSource[0]);
    from(this.tableSource)
      .pipe(
        switchMap(async (row: any, count: number) => {
          // Mensaje de proceso de validación actual
          this.DeclarationsUploadValidationMassive.message_progress =
            VALIDATION_UPDATE_PROCESS_MESSAGE(count + 1);
          // if (count <= 5) {
          let error: any[] = [[], []];
          // Indice actual del contador
          this.DeclarationsUploadValidationMassive.common_general.count = count;
          let data: any = row;
          let no_ciudad: any = null;
          let otclave_federative_entity: any = null;
          let name_institution: string = '';
          let no_emisora: any = null;
          let no_autoridad: any = null;
          let manualvar_no_transferente: string = '120';
          if (count <= 5) {
            // Validacion 5 registros
            // // Validar menaje de acuerdo al identificador
            // if (this.proceso == 2 && this.assetsForm.get('inmuebles').value) {
            //   if (!data.transferente) {
            //     error = this.agregarErrorUploadValidation(
            //       error,
            //       ERROR_GOOD_INMUEBLE(data.transferente)
            //     );
            //   } else {
            //     await this.goodsBulkService
            //       .getGoodById(data.transferente)
            //       .subscribe({
            //         next: res => res,
            //         error: err => {
            //           error = this.agregarErrorUploadValidation(
            //             error,
            //             ERROR_GOOD_INMUEBLE(data.transferente)
            //           );
            //         },
            //       });
            //   }
            // } // Validar menaje de acuerdo al identificador
            // #### REVISAR EL MS PARA OBTENER CVE_UNICA
            // if (
            //   this.assetsForm.get('inmuebles').value ||
            //   this.assetsForm.get('cars').value
            // ) {
            //   // Parametros para buscar la clave SAT
            //   let objParams = {
            //     officeKey: this.paramsGeneral.p_no_oficio,
            //     asunto: this.paramsGeneral.asunto_sat,
            //     saeIdTransferencia: '56136', //data.transferente,
            //   };
            //   if (data.transferente == null) {
            //     await this.goodsBulkService.getSatKey(objParams).subscribe({
            //       next: res => res,
            //       error: err => {
            //         error = this.agregarErrorUploadValidation(
            //           error,
            //           ERROR_GET_CLAVE_SAT(data.transferente)
            //         );
            //       },
            //     });
            //   }
            // }
            // PROCESO --- 4
            // GENERACION DE VOLANTES
            if (this.proceso == 4) {
              // COL1 es la descripcion en el archivo
              if (data.descripcion != null && data.descripcion == '') {
                // // Obtener la clave de la ciudad apartir de la clave Asunto SAT
                // await this.goodsBulkService
                //   .searchCityByAsuntoSat(this.paramsGeneral.asunto_sat)
                //   .subscribe({
                //     next: res => (no_ciudad = res.no_ciudad),
                //     error: err => {
                //       error = this.agregarErrorUploadValidation(
                //         error,
                //         ERROR_CITY_ASUNTO_SAT(this.paramsGeneral.asunto_sat)
                //       );
                //     },
                //   });
                // CREANDO EXPEDIENTE
                if (data.descripcion) {
                  // // Inicia proceso de validación para carga
                  // this.DeclarationsUploadValidationMassive.message_progress =
                  //   VALIDATION_UPLOAD_CREATION_EXPEDIENTE_MESSAGE;
                  // // Obtener las instituciones emisoras por numero de institucion (200)
                  // await this.goodsBulkService
                  //   .getIssuingInstitutionById('200')
                  //   .subscribe({
                  //     next: res => {
                  //       name_institution = res.authorityName;
                  //     },
                  //     error: err => {
                  //       error = this.agregarErrorUploadValidation(
                  //         error,
                  //         ERROR_ISSUING_INSTITUTION('200')
                  //       );
                  //     },
                  //   });
                  // let issuingParams: IAuthorityIssuingParams = {
                  //   expedientSat: this.paramsGeneral.p_no_expediente,
                  //   transferent: parseInt(manualvar_no_transferente),
                  //   city: 266,
                  // };
                  // // Obtener institucion emisora EMISORA Y AUTORIDAD
                  // await this.goodsBulkService
                  //   .getIssuingInstitutionByParams(issuingParams)
                  //   .subscribe({
                  //     next: res => {
                  //       console.log('emisora autoridad', res);
                  //       if (res.length == 1) {
                  //         no_autoridad = res[0].no_autoridad; // SET AUTORIDAD
                  //         no_emisora = res[0].no_emisora; // SET EMISORA
                  //       } else {
                  //         error = this.agregarErrorUploadValidation(
                  //           error,
                  //           ERROR_TRANSFERENTE_PARAMS(1)
                  //         );
                  //       }
                  //     },
                  //     error: err => {
                  //       error = this.agregarErrorUploadValidation(
                  //         error,
                  //         ERROR_TRANSFERENTE_PARAMS(0)
                  //       );
                  //     },
                  //   });
                  // // Obtener la clave de la entidad federativa apartir de la clave Asunto SAT
                  // await this.goodsBulkService
                  //   .getEntityFederativeByAsuntoSat(
                  //     this.paramsGeneral.asunto_sat
                  //   )
                  //   .subscribe({
                  //     next: res => (otclave_federative_entity = res.otclave),
                  //     error: err => {
                  //       error = this.agregarErrorUploadValidation(
                  //         error,
                  //         ERROR_CITY_ASUNTO_SAT(this.paramsGeneral.asunto_sat)
                  //       );
                  //     },
                  //   });
                }

                if (data.expediente) {
                  const paramsAuth: ListParams = {
                    page: this.params.getValue().page,
                    limit: this.params.getValue().limit,
                  };
                  paramsAuth['filter.idAuthorityIssuerTransferor'] =
                    '$eq:' + manualvar_no_transferente + '';
                  // Obtener institucion emisora de acuerdo al id 200
                  await this.goodsBulkService
                    .getNumberTransferenteAuthority(paramsAuth)
                    .subscribe({
                      next: async res => {
                        console.log('emisora de acuerdo al id 200', res);
                        if (res.data.length > 0) {
                        } else if (res.data.length == 0) {
                          let dataExtra = {
                            nameInstitution: res.data[0].authorityName, // Institucion emisora nombre
                            federalEntityKey: otclave_federative_entity, // Entidad federativa
                            identifier: data.identificador, // Identificador
                            transferNumber: data.transferente, // Transferente
                            authorityNumber: no_autoridad, // Numero de autoridad
                            emisoraInstitution: no_emisora, // NUMERO DE EMISORA
                          };
                          this.validExpedientExist(data, error, dataExtra);
                        }
                      },
                      error: err => {
                        error = this.agregarErrorUploadValidation(
                          error,
                          ERROR_TRANSFERENTE(data.transferente)
                        );
                      },
                    });
                }
              }
            }
          } // Validacion 5 registros

          // Errores encontrados
          // error[1].push(row);
          if (this.DeclarationsUploadValidationMassive.data_error[count]) {
            // Insertar errores encontrados a los anteriores
            this.DeclarationsUploadValidationMassive.data_error[
              count
            ][0].splice(
              this.DeclarationsUploadValidationMassive.data_error[count][0],
              ...error[0]
            );
          }
        })
      )
      .subscribe(val => {
        // Fin del proceso de validación
        this.DeclarationsUploadValidationMassive.message_progress =
          VALIDATION_END_MESSAGE;
        // this.DeclarationsUploadValidationMassive =
        //   this.DeclarationsSatSaeMassive;
        console.log(this.DeclarationsUploadValidationMassive, this.listError);
        console.log(val);
      });
  }

  agregarErrorUploadValidation(error: any[], messageError: string) {
    // Agregar contador de error
    this.DeclarationsUploadValidationMassive.common_general.total_errores++;
    // Cambiar validador de proceso
    this.DeclarationsUploadValidationMassive.common_general.valid = false;
    // Guardar error y mensaje
    error[0].push(messageError);
    return error;
  }

  async validExpedientExist(data: any, error: any[], dataExtra: any) {
    // Validar si existe un expediente
    await this.goodsBulkService.getExpedientById(data.expediente).subscribe({
      next: res => {
        let dateNowParse = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        console.log(res);
        let expediente: IExpedientMassiveUpload = {
          id: this.paramsGeneral.p_no_expediente, // NO EXPEDIENTE FROM PARAMS
          insertedBy: 'USER', // USUARIO SETEADO MANUALMENTE
          insertMethod: 'CARGA MASIVA VOLANTES', // TIPO DE CARGA MASIVA
          insertDate: dateNowParse, // FECHA ACTUAL PARA CARGAR
          nameInstitution: dataExtra.nameInstitution, // NOMBRE DE LA INSTITUCION EMISORA
          indicatedName: null, // SE PASA EL VALOR EN NULL
          federalEntityKey: dataExtra.federalEntityKey, // ENTIDAD FEDERATIVA CLAVE
          identifier: dataExtra.identificador, // IDENTIFICADOR
          transferNumber: dataExtra.transferNumber, // NUMERO DE TRANSFERENTE
          expTransferNumber: data.expediente, // EXPEDIENTE TRANSFER NUMBER
          expedientType: 'T', // TIPO DE EXPEDIENTE
          authorityNumber: dataExtra.authorityNumber, // NUMERO DE AUTORIDAD
          stationNumber: '', // NUMERO EMISORA
        };
        if (!res) {
          this.saveExpedient(expediente);
        }
      },
      error: err => {
        error = this.agregarErrorUploadValidation(
          error,
          ERROR_EXPEDIENTE(data.expediente)
        );
      },
    });
  }

  saveExpedient(expediente: IExpedientMassiveUpload) {
    console.log(expediente);
    // await this.goodsBulkService
    //   .getExpedientById(data.expediente)
    //   .subscribe({
    //     next: res => {
    //       console.log(res);
    //       if (!res) {

    //       }
    //     },
    //     error: err => {
    //       error = this.agregarError(
    //         error,
    //         ERROR_EXPEDIENTE(data.expediente)
    //       );
    //     },
    //   });
  }
}
