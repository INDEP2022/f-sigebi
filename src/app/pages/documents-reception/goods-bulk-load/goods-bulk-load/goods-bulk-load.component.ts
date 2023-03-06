import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IAuthorityIssuingParams } from 'src/app/core/models/catalogs/authority.model';
import { ITagXClasif } from 'src/app/core/models/ms-classifygood/ms-classifygood.interface';
import { IExpedientMassiveUpload } from 'src/app/core/models/ms-expedient/expedient';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import {
  IMassiveParams,
  ISatTransfer,
} from 'src/app/core/models/ms-interfacesat/ms-interfacesat.interface';
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
  ERROR_CREATE_EXPEDIENT,
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
  VALIDATION_UPLOAD_END_MESSAGE,
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
  // VARIABLES CARGA MASIVA
  LNU_NO_BIEN: string | number = '';
  idPantalla: string = 'FMASINSUPDBIENES_SATSAE';
  tipoCarga: string = 'general';
  stopProcess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodsBulkService: GoodsBulkLoadService,
    private authService: AuthService,
    private globalVarsService: GlobalVarsService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    super();
    const _settings = { columns: GOODS_BULK_LOAD_COLUMNS, actions: false };
    this.settings = { ...this.settings, ..._settings };
  }

  ngOnInit(): void {
    this.globalVarsService.loadGlobalVars();
    // let tk = this.authService.decodeToken();
    // console.log(tk);
    // let gv = this.globalVarsService.getGlobalVars$();
    // console.log(gv);

    // this.paramsGeneral = {
    //   p_no_oficio: 'OPD/GUANAJUATO/12960/2022',
    //   p_no_volante: '1558111',
    //   p_no_expediente: '110-02-00-00-00-2016-1212',
    //   p_sat_tipo_exp: '',
    //   asunto_sat: 'AVV070110777',
    //   p_indicador_sat: '',
    //   p_av_previa: '',
    //   iden: '',
    //   no_transferente: '',
    //   desalojo: '',
    // };
    this.validParameters();
    this.prepareForm();
  }

  validParameters() {
    this.stopProcess = true;
    this.tipoCarga = this.route.snapshot.paramMap.get('tipo');
    if (this.tipoCarga) {
      if (this.tipoCarga == 'sat') {
        let validParam = true;
        let param1 = this.route.snapshot.paramMap.get('ASUNTO_SAT');
        if (!param1) {
          validParam = false;
        } else {
          this.paramsGeneral.asunto_sat = decodeURI(param1);
        }
        let param2 = this.route.snapshot.paramMap.get('P_NO_EXPEDIENTE');
        if (!param2) {
          validParam = false;
        } else {
          this.paramsGeneral.p_no_expediente = decodeURI(param2);
        }
        let param3 = this.route.snapshot.paramMap.get('P_NO_OFICIO');
        if (!param3) {
          validParam = false;
        } else {
          this.paramsGeneral.p_no_oficio = decodeURI(param3);
        }
        let param4 = this.route.snapshot.paramMap.get('P_NO_VOLANTE');
        if (!param4) {
          validParam = false;
        } else {
          this.paramsGeneral.p_no_volante = decodeURI(param4);
        }
        let param5 = this.route.snapshot.paramMap.get('P_SAT_TIPO_EXP');
        if (!param5) {
          validParam = false;
        } else {
          this.paramsGeneral.p_sat_tipo_exp = decodeURI(param5);
        }
        let param6 = this.route.snapshot.paramMap.get('P_INDICADOR_SAT');
        if (!param6) {
          validParam = false;
        } else {
          this.paramsGeneral.p_indicador_sat = decodeURI(param6);
        }
        if (!validParam) {
          this.alert(
            'warning',
            'Opción Carga Masiva',
            'Algunos parametros necesarios no se le pasaron a la pantalla.'
          );
        }
      } else if (this.tipoCarga == 'pgr') {
        let validParam = true;
        let param1 = this.route.snapshot.paramMap.get('P_NO_EXPEDIENTE');
        if (!param1) {
          validParam = false;
        } else {
          this.paramsGeneral.p_no_expediente = decodeURI(param1);
        }
        let param2 = this.route.snapshot.paramMap.get('P_AV_PREVIA');
        if (!param2) {
          validParam = false;
        } else {
          this.paramsGeneral.p_av_previa = decodeURI(param2);
        }
        let param3 = this.route.snapshot.paramMap.get('P_NO_VOLANTE');
        if (!param3) {
          validParam = false;
        } else {
          this.paramsGeneral.p_no_volante = decodeURI(param3);
        }
        if (!validParam) {
          this.alert(
            'warning',
            'Opción Carga Masiva',
            'Algunos parametros necesarios no se le pasaron a la pantalla.'
          );
        }
      } else if (this.tipoCarga == 'general') {
        let validParam = true;
        let param1 = this.route.snapshot.paramMap.get('IDEN');
        if (!param1) {
          validParam = false;
        } else {
          this.paramsGeneral.iden = decodeURI(param1);
        }
        let param2 = this.route.snapshot.paramMap.get('NO_TRANSFERENTE');
        if (!param2) {
          validParam = false;
        } else {
          this.paramsGeneral.no_transferente = decodeURI(param2);
        }
        let param3 = this.route.snapshot.paramMap.get('NO_VOLANTE');
        if (!param3) {
          validParam = false;
        } else {
          this.paramsGeneral.p_no_volante = decodeURI(param3);
        }
        let param4 = this.route.snapshot.paramMap.get('DESALOJO');
        if (!param1) {
          validParam = false;
        } else {
          this.paramsGeneral.desalojo = decodeURI(param4);
        }
        let param5 = this.route.snapshot.paramMap.get('P_NO_OFICIO');
        if (!param1) {
          validParam = false;
        } else {
          this.paramsGeneral.p_no_oficio = decodeURI(param5);
        }
        let param6 = this.route.snapshot.paramMap.get('ASUNTO_SAT');
        if (!param6) {
          validParam = false;
        } else {
          this.paramsGeneral.asunto_sat = decodeURI(param6);
        }
        if (!validParam) {
          this.stopProcess = true;
          this.alert(
            'warning',
            'Opción Carga Masiva',
            'Algunos parametros necesarios no se le pasaron a la pantalla.'
          );
        }
      } else {
        this.stopProcess = true;
        this.alert(
          'warning',
          'Opción Carga Masiva',
          'No se encontro la opción de carga masiva ingresada.'
        );
      }
    }
    console.log(this.tipoCarga, this.paramsGeneral);
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
    this.validParameters();
    if (this.stopProcess) {
      return;
    }
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
      limit: 100,
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
      limit: 100,
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
      // SI NO SE ENCUENTRAN ERRORES COMENZAR CARGA DE DATOS
      if (
        this.DeclarationsValidationMassive.common_general.total_errores == 0
      ) {
        this.validDataUploadMassiveSat();
      }
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
   * Exportar a XLSX errores encontrados en la carga de datos
   */
  exportErrorUploadXlsx() {
    let errores = [];
    for (
      let index = 0;
      index < this.DeclarationsUploadValidationMassive.data_error.length;
      index++
    ) {
      const element =
        this.DeclarationsUploadValidationMassive.data_error[index];
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
        this.DeclarationsUploadValidationMassive.common_general.proceso
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
          // BUSCAR CLAVE UNICA
          this.searchSatUniqueKey(infoData, opcionValid); // Buscar clave sat
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
    if (infoData.dataRow.descripcion == null) {
      this.getTagXClassif(infoData, opcionValid); // Obtener la etiqueta de acuerdo a la clasificacion
    } else {
      // Parametros para buscar la clave SAT
      let objParams = {
        officeKey: this.paramsGeneral.p_no_oficio,
        asunto: this.paramsGeneral.asunto_sat,
        saeIdTransferencia: infoData.dataRow.transferente, //'56136', //data.transferente,
      };
      await this.goodsBulkService.getSatKey(objParams).subscribe({
        next: res => {
          console.log(res);
          infoData.objInsertResponse['SAT_CVE_UNICA'] = res.satOnlyKey; // Obtener SAT CVE Unica
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
    let dataFilter = '';
    if (opcionValid == 'sat') {
      dataFilter = this.paramsGeneral.asunto_sat;
    } else if (opcionValid == 'pgr') {
      dataFilter = this.paramsGeneral.p_av_previa;
    }
    // Creacion del bien
    if (infoData.dataRow.descripcion) {
      // Obtener la clave de la ciudad apartir de la clave Asunto SAT
      await this.goodsBulkService
        .searchCityByAsuntoSat(dataFilter, opcionValid)
        .subscribe({
          next: res => {
            infoData.objInsertResponse.no_ciudad = res.no_ciudad;
            this.getInstitucionesEmisoras(infoData, opcionValid);
          },
          error: err => {
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              ERROR_CITY_ASUNTO_SAT(dataFilter)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            this.getInstitucionesEmisoras(infoData, opcionValid);
          },
        });
    } else {
      infoData.error = this.agregarErrorUploadValidation(
        infoData.error,
        ERROR_CITY_ASUNTO_SAT(dataFilter)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      this.getInstitucionesEmisoras(infoData, opcionValid);
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
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obteniendo Emisora y Autoridad.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let issuingParams: IAuthorityIssuingParams;
    if (opcionValid == 'sat') {
      issuingParams = {
        expedientSat: this.paramsGeneral.p_no_expediente,
        transferent: parseInt(
          infoData.objInsertResponse.manualvar_no_transferente
        ),
        city: infoData.objInsertResponse.no_ciudad,
      };
    } else if (opcionValid == 'pgr') {
      issuingParams = {
        office: this.paramsGeneral.p_av_previa,
        transferent: parseInt(
          infoData.objInsertResponse.manualvar_no_transferente
        ),
        city: infoData.objInsertResponse.no_ciudad,
      };
    }
    // Obtener institucion emisora EMISORA Y AUTORIDAD
    await this.goodsBulkService
      .getIssuingInstitutionByParams(issuingParams, opcionValid)
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
          this.getOTClaveEnt(infoData, opcionValid); // Obtener clave entidad federativa
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_TRANSFERENTE_PARAMS(0)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.getOTClaveEnt(infoData, opcionValid); // Obtener clave entidad federativa
        },
      });
  }

  async getOTClaveEnt(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obteniendo clave de la entidad federativa.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let dataFilter: any;
    if (opcionValid == 'sat') {
      dataFilter = this.paramsGeneral.asunto_sat;
    } else {
      dataFilter = this.paramsGeneral.p_av_previa;
    }
    // Obtener la clave de la entidad federativa apartir de la clave Asunto SAT
    await this.goodsBulkService
      .getEntityFederativeByAsuntoSat(dataFilter)
      .subscribe({
        next: res => {
          infoData.objInsertResponse.otclave_federative_entity = res.otclave;
          this.validExpedient(infoData, opcionValid); // Validar expediente
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_CITY_ASUNTO_SAT(dataFilter)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.validExpedient(infoData, opcionValid); // Validar exdiente
        },
      });
  }

  async validExpedient(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el expediente.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Validar si existe un expediente
    await this.goodsBulkService
      .getExpedientById(this.paramsGeneral.p_no_expediente)
      .subscribe({
        next: res => {
          console.log(res);
          if (!res) {
            this.insertExpedient(infoData, opcionValid);
          } else {
            this.getTagXClassif(infoData, opcionValid); // Obtener etiqueta de clasificacion del bien
          }
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_EXPEDIENTE(infoData.dataRow.expediente)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.getTagXClassif(infoData, opcionValid); // Obtener etiqueta de clasificacion del bien
        },
      });
  }

  async insertExpedient(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Creando el expediente.';
    console.log(this.DeclarationsValidationMassive.message_progress);
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
      expedientType: opcionValid == 'sat' ? 'T' : 'P', // TIPO DE EXPEDIENTE
      authorityNumber: infoData.objInsertResponse.no_autoridad, // NUMERO DE AUTORIDAD
      stationNumber: infoData.objInsertResponse.no_emisora, // NUMERO EMISORA
    };
    // Crear un expediente
    await this.goodsBulkService.createExpedient(expedienteData).subscribe({
      next: res => {
        console.log(res);
        infoData.objInsertResponse['idExpediente'] = res.id; // Setear id del expediente
        this.getTagXClassif(infoData, opcionValid); // Obtener la etiqueta de acuerdo a la clasificacion
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          ERROR_CREATE_EXPEDIENT
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        this.getTagXClassif(infoData, opcionValid); // Obtener la etiqueta de acuerdo a la clasificacion
      },
    });
  }

  async getTagXClassif(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obtener etiqueta por clasificacion del bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let dataTag: ITagXClasif = {
      col6: infoData.dataRow.clasif,
      lnuTransfereeNumber: infoData.dataRow.transferente,
    };
    // Obtener el numero de etiqueta
    await this.goodsBulkService.getTagXClasifByCol6Transfer(dataTag).subscribe({
      next: res => {
        console.log(res);
        infoData.objInsertResponse['vno_etiqueta'] = res.vno_etiqueta; // Setear la etiqueta
        this.createGood(infoData, opcionValid); // Crear bien
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el bien'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        this.createGood(infoData, opcionValid); // Crear bien
      },
    });
  }

  async createGood(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress = 'Creando el bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let dataGood: any = {
      id: '', // ID
      // satUniqueKey: '', // SAT_CVE_UNICA
      siabiInventoryId: infoData.objInsertResponse['SAT_CVE_UNICA'], // SIAB_INVENTORY
      inventoryNumber: infoData.objInsertResponse['SAT_CVE_UNICA'], // NUMERO DE INVENTARIO
      fileNumber: this.paramsGeneral.p_no_expediente, // NO_EXPEDIENTE
      description: infoData.objInsertResponse.descripcion, // Descripcion
      quantity: infoData.objInsertResponse.cantidad, // Cantidad
      unit: infoData.objInsertResponse.unidad, // Unidad
      status: infoData.objInsertResponse.status, // Status
      identifier: infoData.objInsertResponse.identificador, // Identificador
      goodClassNumber: infoData.objInsertResponse.clasif, // Numero de clasificacion del bien
      val1: infoData.dataRow['numero de placas'], // Valor 1
      val2: infoData.dataRow['serie'], // Valor 2
      subDelegationNumber: infoData.objInsertResponse['vNO_SUBDELEGACION'], // Sub delegacion
      delegationNumber: infoData.objInsertResponse['vNO_DELEGACION'], // Delegacion
      labelNumber: infoData.objInsertResponse['vno_etiqueta'], // Numero de etiqueta
      flyerNumber: this.paramsGeneral.p_no_volante, // No volante
      observations: infoData.dataRow.observaciones, // Observaciones
    };
    // Crear el bien
    await this.goodsBulkService.createGood(dataGood).subscribe({
      next: res => {
        console.log(res);
        infoData.objInsertResponse['LNU_NO_BIEN'] = res.idGood;
        infoData.validLastRequest = true; // Respuesta correcta
        this.createMassiveChargeGood(infoData, opcionValid); // Crear registro carga masiva
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el bien'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        this.createMassiveChargeGood(infoData, opcionValid); // Crear bien
      },
    });
  }

  async createMassiveChargeGood(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Creando registro en la carga masiva del bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let massiveGoodData: any = {
      id: this.assetsForm.get('idCarga').value, // Id de la carga masiva
      goodNumber: infoData.objInsertResponse['LNU_NO_BIEN'], // Numero de bien
      fileNumber: this.paramsGeneral.p_no_expediente, // Numero de expediente
      flyerNumber: this.paramsGeneral.p_no_volante, // Numero de volante
      user: 'USER', // USER para que el back indique el valor
      massiveChargeDate: this.datePipe.transform(new Date()), // Fecha y hora actual
      daydayEviction: this.assetsForm.get('idCarga').value ? 1 : 0, //  Desalojo dia a dia
    };
    // Crear el bien
    await this.goodsBulkService.createGood(massiveGoodData).subscribe({
      next: res => {
        console.log(res);
        infoData.validLastRequest = true; // Respuesta correcta
        this.createHistoryGood(infoData, opcionValid); // Crear registro carga masiva
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el registro de la carga masiva'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        this.createHistoryGood(infoData, opcionValid); // Crear bien
      },
    });
  }

  async createHistoryGood(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    if (opcionValid == 'sat') {
      this.idPantalla = 'FMASINSUPDBIENES_SATSAE';
    } else if (opcionValid == 'pgr') {
      this.idPantalla = 'FMASINSUPDBIENES_PGRSAE';
    }
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Creando registro en historico del bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let goodHistory: IHistoryGood = {
      propertyNum: infoData.objInsertResponse['LNU_NO_BIEN'], // Numero de bien
      status: 'ROP', // Estatus
      changeDate: new Date(), // Fecha
      userChange: 'USER', // USER se indica el usuario
      statusChangeProgram: this.idPantalla, // Clave de la pantalla
      reasonForChange: 'Automatico masivo', // Razon del cambio
      registryNum: 1, // No se toma en el ms
      extDomProcess: '', // No se toma en el ms
    };
    // Crear el historico del bien
    await this.goodsBulkService.createHistoryGood(goodHistory).subscribe({
      next: res => {
        console.log(res);
        infoData.validLastRequest = true; // Respuesta correcta
        this.updateSatTransferencia(infoData, opcionValid); // Crear registro carga masiva
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el historico del bien'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        this.updateSatTransferencia(infoData, opcionValid); // Crear bien
      },
    });
  }

  async updateSatTransferencia(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // --************** ACTUALIZACION DE TABLA DE REGISTROS DEL SAT CON EL NO DE BIEN**-----------
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Actualización de tabla de registros del SAT con el número de bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Crear el historico del bien
    await this.goodsBulkService
      .getSatTransferencia(infoData.objInsertResponse['SAT_CVE_UNICA'])
      .subscribe({
        next: async res => {
          console.log(res);
          infoData.validLastRequest = true; // Respuesta correcta
          let dataUpdate: ISatTransfer = res;
          if (opcionValid == 'sat') {
            dataUpdate.saeGoodNumber =
              infoData.objInsertResponse['LNU_NO_BIEN'];
            dataUpdate.saeStatusShipping = 'G'; // Cambiar el estatus del envio
          } else if ('pgr') {
            dataUpdate.saeGoodNumber =
              infoData.objInsertResponse['LNU_NO_BIEN'];
          }
          // actualizar el estatus de sat transferencia
          await this.goodsBulkService
            .updateSatTransferencia(res.id, dataUpdate)
            .subscribe({
              next: res => {
                console.log(res);
                infoData.validLastRequest = true; // Respuesta correcta
                if (
                  this.assetsForm.get('cars').value ||
                  this.assetsForm.get('inmuebles').value
                ) {
                  this.validMuebleInmuebleUpload(infoData, opcionValid); // Validar muebles e inmuebles
                } else {
                  if (opcionValid == 'sat') {
                    this.processUploadEndSat(infoData);
                  } else if (opcionValid == 'pgr') {
                    this.processUploadEndPgr(infoData);
                  }
                }
              },
              error: err => {
                infoData.error = this.agregarErrorUploadValidation(
                  infoData.error,
                  'Error al actualizar el estatus de sat transferencia'
                );
                this.infoDataValidation.error = infoData.error; // Setear error
                infoData.validLastRequest = false; // Respuesta incorrecta
                if (
                  this.assetsForm.get('cars').value ||
                  this.assetsForm.get('inmuebles').value
                ) {
                  this.validMuebleInmuebleUpload(infoData, opcionValid); // Validar muebles e inmuebles
                } else {
                  if (opcionValid == 'sat') {
                    this.processUploadEndSat(infoData);
                  } else if (opcionValid == 'pgr') {
                    this.processUploadEndPgr(infoData);
                  }
                }
              },
            });
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            'Error al obtener el registro de SAT tarnsferencia.'
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          if (
            this.assetsForm.get('cars').value ||
            this.assetsForm.get('inmuebles').value
          ) {
            this.validMuebleInmuebleUpload(infoData, opcionValid); // Validar muebles e inmuebles
          } else {
            if (opcionValid == 'sat') {
              this.processUploadEndSat(infoData);
            } else if (opcionValid == 'pgr') {
              this.processUploadEndPgr(infoData);
            }
          }
        },
      });
  }

  async validMuebleInmuebleUpload(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando los datos requeridos para el muebles e inmuebles.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Opción del check para sólo autos
    const params: ListParams = {
      page: this.params.getValue().page,
      limit: 100,
    };
    this.params.getValue().getParams();
    params['filter.classifGoodNumber'] = '$eq:' + infoData.dataRow.clasif + '';
    await this.goodsBulkService
      .getAtributeClassificationGood(infoData.dataRow.clasif)
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data) {
            if (this.assetsForm.get('cars').value) {
              let dataResponseMueble = this.validMuebleSatUpload(
                infoData,
                opcionValid,
                res.data
              );
              console.log('VALIDAR MUEBLES CLASIF GOOD', dataResponseMueble);
              infoData.objInsertResponse = dataResponseMueble;
            } else if (this.assetsForm.get('inmuebles').value) {
              let dataResponseInmueble = this.validMuebleSatUpload(
                infoData,
                opcionValid,
                res.data
              );
              console.log(
                'VALIDAR INMUEBLES CLASIF GOOD',
                dataResponseInmueble
              );
              infoData.objInsertResponse = dataResponseInmueble;
            }
          }
          this.processUploadEndSat(infoData);
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_ATRIBUTE_CLASS_GOOD(infoData.dataRow.clasif)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.processUploadEndSat(infoData);
        },
      });
  }

  async validMuebleSatUpload(
    infoData: IValidInfoData,
    opcionValid: string = 'sat',
    dataResponse: IAttribClassifGoods[]
  ) {
    dataResponse.forEach(element => {
      // Validar para muebles
      if (this.assetsForm.get('cars').value) {
        if (
          element.attribute.includes(
            SAT_SAE_MUEBLES_PROCESO_4.listSearchExist[0]
          )
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['blindaje']; // BLINDAJE
        } else if (
          element.attribute == SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[0]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['entfed']; // ENTFED
        } else if (
          element.attribute == SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[1]
        ) {
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['edofisico']; // EDOFISICO
        } else if (
          element.attribute == SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[2]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['marca']; // MARCA
        } else if (
          element.attribute == SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[3]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['submarca']; // SUBMARCA
        } else if (
          element.attribute == SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[4]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['modelo']; // MODELO
        } else if (
          element.attribute.includes(
            SAT_SAE_MUEBLES_PROCESO_4.listSearchExist[1]
          ) ||
          element.attribute.includes(
            SAT_SAE_MUEBLES_PROCESO_4.listSearchExist[2]
          )
        ) {
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['numero de motor']; // numero de motor
        } else if (
          element.attribute[SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[5]]
        ) {
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['numero de placas']; // NUMERO DE PLACAS
        } else if (
          element.attribute[SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[6]]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['serie']; // SERIE
        } else if (
          element.attribute[SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[7]]
        ) {
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['procedencia']; // PROCEDENCIA
        } else if (
          element.attribute[SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[8]]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['ciudad']; // CIUDAD se toma para ubicacion
        } else if (
          element.attribute[SAT_SAE_MUEBLES_PROCESO_4.listEqualExist[9]]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['tipo']; // TIPO
        }
      }

      // Validar para inmuebles
      if (this.assetsForm.get('inmuebles').value) {
        if (
          element.attribute.includes(
            SAT_SAE_INMUEBLES_PROCESO_4.listSearchExist[0]
          )
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['colonia']; // colonia
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[0]
        ) {
          // indefinido
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['nooficio']; // nooficio
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[1]
        ) {
          // indefinido
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['fecoficio']; // fecoficio
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[2]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['nooficio']; // nooficio    3 opciones
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[3]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['menaje']; // menaje
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[0]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['nooficio']; // nooficio
        } else if (
          element.attribute.includes(
            SAT_SAE_INMUEBLES_PROCESO_4.listSearchExist[2]
          )
        ) {
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['edofisico']; // edofisico
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[4]
        ) {
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['domicilio']; // domicilio
        } else if (
          element.attribute.includes(
            SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[2]
          )
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['nombre']; // nombre
        } else if (
          element.attribute.includes(
            SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[3]
          )
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['calle']; // calle
        } else if (
          element.attribute.includes(
            SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[4]
          )
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['numext']; // numext
        } else if (
          element.attribute.includes(
            SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[5]
          )
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['numint']; // numint
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[5]
        ) {
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['delegmuni']; // delegmuni
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[6] ||
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[12]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['estado']; // estado o entfed
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[11]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['codpos']; // codpos
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[7]
        ) {
          infoData.objInsertResponse['LST_DATO'] =
            infoData.dataRow['supterreno']; // supterreno
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[8]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['suncontr']; // suncontr
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[9]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['habitado']; // habitado
        } else if (
          element.attribute == SAT_SAE_INMUEBLES_PROCESO_4.listEqualExist[10]
        ) {
          infoData.objInsertResponse['LST_DATO'] = infoData.dataRow['agua']; // agua
        }
      }
    });
    return infoData;
  }

  processUploadEndSat(infoData: IValidInfoData) {
    // Agregar contador de error para el registro
    if (
      this.DeclarationsUploadValidationMassive.common_general.total_errores > 0
    ) {
      this.DeclarationsUploadValidationMassive.common_general
        .registro_errores++;
      infoData.error[1].push(infoData.dataRow);
      this.DeclarationsUploadValidationMassive.data_error.push(infoData.error);
      console.log(this.DeclarationsUploadValidationMassive.message_progress);
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        VALIDATION_UPLOAD_END_MESSAGE;
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        'Se termino el proceso de carga de datos para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      // Fin del proceso para validar la carga SAT
      this.validDataUploadSAT(
        infoData.contadorRegistro + 1,
        this.tableSource[infoData.contadorRegistro + 1]
      ); // CONTINUAR PROCESO
    }
  }

  processUploadEndPgr(infoData: IValidInfoData) {
    // Agregar contador de error para el registro
    if (
      this.DeclarationsUploadValidationMassive.common_general.total_errores > 0
    ) {
      this.DeclarationsUploadValidationMassive.common_general
        .registro_errores++;
      infoData.error[1].push(infoData.dataRow);
      this.DeclarationsUploadValidationMassive.data_error.push(infoData.error);
      console.log(this.DeclarationsUploadValidationMassive.message_progress);
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        VALIDATION_UPLOAD_END_MESSAGE;
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        'Se termino el proceso de carga de datos para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      // Fin del proceso para validar la carga PGR
      this.validDataUploadPGR(
        infoData.contadorRegistro + 1,
        this.tableSource[infoData.contadorRegistro + 1]
      ); // CONTINUAR PROCESO
    }
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
        if (this.proceso == 4) {
          // BUSCAR CLAVE UNICA
          this.searchSatUniqueKey(this.infoDataValidation, 'sat'); // Buscar clave sat
        } else {
          // COMMIT SILECIOSO PARA ACTUALIZAR LOS BIENES DE CARGA MASIVA CON EL USUARIO
          this.processUploadEndSat(this.infoDataValidation);
        }
      }
    } else {
      // NO EXISTE ASUNTO SAT
      this.infoDataValidation.error = this.agregarError(
        this.infoDataValidation.error,
        'No se encontro el Asunto SAT en los parámetros'
      );
      this.infoDataValidation.error = this.infoDataValidation.error; // Setear error
      this.infoDataValidation.validLastRequest = false; // Respuesta incorrecta
      this.processUploadEndSat(this.infoDataValidation);
    }
  }
  /**
   * Validar los registros a subir al sistema antes de cargar la información
   */
  async validDataUploadMassiveSat() {
    this.startVariables(true);
    // Inicia proceso de validación para carga
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPLOAD_START_MESSAGE;
    this.validDataUploadSAT(0, this.tableSource[0]);
  }

  /**
   * Validar el proceso de carga masiva SAT para subir los datos
   */
  validDataUploadPGR(count: number = 0, row: any) {
    this.assetsForm.get('idCarga').setValue('ASEG');
    this.assetsForm.get('idCarga').updateValueAndValidity();
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
        manualvar_no_transferente: '1',
      },
      validLastRequest: false,
    };
    if (this.proceso == 4) {
      // BUSCAR CLAVE UNICA
      this.searchSatUniqueKey(this.infoDataValidation, 'pgr'); // Buscar clave sat
    } else {
      // COMMIT SILECIOSO PARA ACTUALIZAR LOS BIENES DE CARGA MASIVA CON EL USUARIO
      this.processUploadEndPgr(this.infoDataValidation);
    }
  }

  /**
   * Validar los registros a subir al sistema antes de cargar la información
   */
  async validDataUploadMassivePgr() {
    this.startVariables(true);
    // Inicia proceso de validación para carga
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPLOAD_START_MESSAGE;
    this.validDataUploadPGR(0, this.tableSource[0]);
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
}
