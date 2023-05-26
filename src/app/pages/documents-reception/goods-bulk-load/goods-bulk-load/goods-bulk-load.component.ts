import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IAuthorityIssuingParams } from 'src/app/core/models/catalogs/authority.model';
import { ITagXClasif } from 'src/app/core/models/ms-classifygood/ms-classifygood.interface';
import {
  IExpedientMassiveFromTmp,
  IExpedientMassiveUpload,
} from 'src/app/core/models/ms-expedient/expedient';
import { ITempExpedient } from 'src/app/core/models/ms-expedient/tmp-expedient.model';
import { ICopiesxFlier } from 'src/app/core/models/ms-flier/tmp-doc-reg-management.model';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { IPgrTransfer } from 'src/app/core/models/ms-interfacefgr/ms-interfacefgr.interface';
import {
  IMassiveParams,
  ISatTransfer,
} from 'src/app/core/models/ms-interfacesat/ms-interfacesat.interface';
import { IMenageWrite } from 'src/app/core/models/ms-menage/menage.model';
import {
  INotification,
  INotificationTransferentIndiciadoCityGetData,
} from 'src/app/core/models/ms-notification/notification.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import {
  IDocReceptionFlyersRegistrationParams,
  IDocumentsReceptionRegisterForm,
} from '../../flyers/documents-reception-register/interfaces/documents-reception-register-form';
import {
  FGR_OPCION,
  GOODS_BULK_LOAD_ACTIONS,
  GOODS_BULK_LOAD_TARGETS,
  SAT_SAE_INMUEBLES_PROCESO_4,
  SAT_SAE_MUEBLES_PROCESO_4,
} from '../constants/good-bulk-load-data';
import { previewData } from '../interfaces/goods-bulk-load-table';
import { GoodsBulkLoadService } from '../services/goods-bulk-load.table';
import { LoasFileGoodsBulkService } from '../services/load-file-goods-bulk.service';
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
import {
  APPLY_DATA_COLUMNS,
  GOODS_BULK_LOAD_COLUMNS,
  OFFICE_COLOR_DATA_COLUMN,
  WHEEL_COLOR_DATA_COLUMN,
} from './goods-bulk-load-columns';

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
  tableSourceActualPreload: previewData[] = [];
  tableSourceActualUpload: previewData[] = [];
  actions = GOODS_BULK_LOAD_ACTIONS.general;
  target = new FormControl<'general' | 'sat' | typeof FGR_OPCION>('general');
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
  procesandoPreload: Boolean = false;
  procesandoUpload: Boolean = false;
  pgrData: IPgrTransfer[] = [];
  globals: IGlobalVars;
  cargandoPgr: boolean = false;
  endProcess: boolean = false;
  pgrGoodNumber: string | number = '';
  userId: any;
  userDelegation: number = null;
  userSubdelegation: number = null;
  wheelCount: number = 0;
  fileNumberCount: number = 0;
  flyersRegistrationParams: IDocReceptionFlyersRegistrationParams = null;
  documentsReceptionRegisterForm: Partial<IDocumentsReceptionRegisterForm> =
    null;
  WHEEL_COLOR_DATA_COLUMN = WHEEL_COLOR_DATA_COLUMN;
  OFFICE_COLOR_DATA_COLUMN = OFFICE_COLOR_DATA_COLUMN;
  FGR_OPCION = FGR_OPCION;
  optionInvalid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodsBulkService: GoodsBulkLoadService,
    private authService: AuthService,
    private globalVarsService: GlobalVarsService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private LoasFileGoodsBulkService: LoasFileGoodsBulkService,
    private msDocumentsReceptionDataService: DocumentsReceptionDataService
  ) {
    super();
    const _settings = { columns: GOODS_BULK_LOAD_COLUMNS, actions: false };
    this.settings = { ...this.settings, ..._settings };
  }

  ngOnInit(): void {
    this.optionInvalid = false;
    this.wheelCount = 0;
    this.fileNumberCount = 0;
    this.blockErrors(true); // OCULTAR MENSAJES DEL INTERCEPTOR
    const token = this.authService.decodeToken();
    this.userId = token.preferred_username
      ? token.preferred_username.toLocaleUpperCase()
      : token.preferred_username;
    if (this.userId == 'SIGEBIADMON') {
      this.userId = this.userId.toLocaleLowerCase();
    }
    // let main = document.documentElement.querySelector('.init-page');
    // main.scroll(0, 0);
    // this.blockErrors(false); // OCULTAR MENSAJES DEL INTERCEPTOR
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globals = globalVars;
      });
    this.procesandoPreload = false; // Inicializar variables proceso
    this.procesandoUpload = false; // Inicializar variables proceso
    this.prepareForm();
    this.validParameters();
  }

  detenerProceso() {
    this.stopProcess = true;
  }

  continuarProceso() {
    if (this.procesandoPreload) {
      // preload proccess
      if (this.target.value == 'sat') {
        // console.log('SAT');
        this.validatorPreloadMassiveSat();
      } else if (this.target.value == FGR_OPCION) {
        this.endProcess = false;
        // console.log('PGR--');
        this.validatorPreloadMassivePgr(); // Iniciar proceso de validación
      } else if (this.target.value == 'general') {
        // console.log('GENERAL');
        this.validatorPreloadMassiveGeneral();
      }
    }
    if (this.procesandoUpload) {
      // upload proccess
    }
  }

  reviewStopProcess() {
    if (this.procesandoPreload) {
      this.procesandoPreload = false;
    }
    if (this.procesandoUpload) {
      this.procesandoUpload = false;
    }
  }

  validParameters() {
    this.stopProcess = false;
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
          this.stopProcess = true;
          this.alert(
            'warning',
            'Opción Carga Masiva',
            'Algunos parametros necesarios no se recibieron en la pantalla.'
          );
        } else {
          this.target.setValue(this.tipoCarga);
          this.target.updateValueAndValidity();
          this.targetChange();
        }
      } else if (this.tipoCarga == FGR_OPCION) {
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
          this.stopProcess = true;
          this.alert(
            'warning',
            'Opción Carga Masiva',
            'Algunos parámetros necesarios no se recibieron en la pantalla'
          );
        } else {
          // let paramsData = localStorage.getItem('_flyersRegistrationParams');
          // if (paramsData) {
          //   let objParams: any = JSON.parse(paramsData);
          //   this.flyersRegistrationParams = objParams;
          // } else {
          //   this.flyersRegistrationParams =
          //     this.msDocumentsReceptionDataService.flyersRegistrationParams;
          //   if (this.flyersRegistrationParams.pNoTramite) {
          //     let strParams = JSON.stringify(this.flyersRegistrationParams);
          //     if (strParams) {
          //       localStorage.setItem('_flyersRegistrationParams', strParams);
          //     }
          //   }
          // }
          // let paramsDataForm = localStorage.getItem(
          //   '_documentsReceptionRegisterForm'
          // );
          // if (paramsDataForm) {
          //   let objParams: any = JSON.parse(paramsDataForm);
          //   this.documentsReceptionRegisterForm = objParams;
          // } else {
          //   this.documentsReceptionRegisterForm =
          //     this.msDocumentsReceptionDataService.documentsReceptionRegisterForm;
          //   if (this.documentsReceptionRegisterForm.identifier) {
          //     let strParams = JSON.stringify(
          //       this.documentsReceptionRegisterForm
          //     );
          //     if (strParams) {
          //       localStorage.setItem(
          //         '_documentsReceptionRegisterForm',
          //         strParams
          //       );
          //     }
          //   }
          // }
          console.log(this.paramsGeneral);
          this.target.setValue(this.tipoCarga);
          this.target.updateValueAndValidity();
          this.targetChange();
          this.getDataPGRFromParams(); // Obtener PGR data
        }
      } else {
        this.optionInvalid = true;
        this.stopProcess = true;
        this.alert(
          'warning',
          'La opción no corresponde a las permitidas.',
          'Revisa los parámetros que se cargaron en la pantalla.'
        );
      }
    }
  }

  prepareForm() {
    this.assetsForm = this.fb.group({
      actionType: ['Inserción de bienes', [Validators.required]],
      cars: [null, [Validators.required]],
      inmuebles: [null, [Validators.required]],
      desalojo: [false, [Validators.required]],
      idCarga: [
        null,
        [Validators.maxLength(300), Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  resetProcess() {
    this.endProcess = false;
    this.tableSource = [];
    this.listError = [];
    // this.startVariables();
    this.DeclarationsSatSaeMassive = null;
    this.assetsForm.reset();
    this.targetChange();
    this.inicioProceso = false;
    if (this.tipoCarga == FGR_OPCION) {
      this.assetsForm.get('idCarga').setValue('ASEG');
      this.assetsForm.updateValueAndValidity();
      this.validParameters();
    }
    this.resetValidationDataPreload();
    if (this.DeclarationsValidationMassive) {
      this.startVariables(); // Reset proceso carga masiva
    }
    if (this.DeclarationsUploadValidationMassive) {
      this.startVariables(true); // Reset proceso carga masiva
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
      objInsertResponse: {},
      validLastRequest: false,
    };
  }

  save() {
    // this.validParameters();
    if (this.stopProcess || this.optionInvalid) {
      return;
    }
    this.DeclarationsSatSaeMassive = undefined;
    setTimeout(() => {
      this.assetsForm.markAllAsTouched();
      if (this.target.value == 'general') {
        if (this.validIdCarga()) {
          const params = new FilterParams();
          params.removeAllFilters();
          let encodeP = encodeURIComponent(
            this.assetsForm.get('idCarga').value
          );
          params.addFilter('id', encodeP);
          // Validar el identificador
          this.goodsBulkService
            .getUploadGoodIdentificador(params.getFilterParams())
            .subscribe({
              next: res => {
                // if (res.data.length > 0) {
                this.alert(
                  'warning',
                  'Opción Carga Masiva',
                  'Ya existe(n) ' +
                    res.count +
                    ' registro(s) con este IDENTIFICADOR de Carga.'
                );
                // } else {
                //   this.blockErrors(true); // OCULTAR MENSAJES DEL INTERCEPTOR
                //   this.reviewConditions();
                // }
              },
              error: err => {
                console.log(err);
                let msg;
                if (err.status == 400) {
                  this.blockErrors(true); // OCULTAR MENSAJES DEL INTERCEPTOR
                  this.reviewConditions();
                } else {
                  msg =
                    'Ocurrió un error al validar el Identificador de Carga, intentelo nuevamente' +
                    err.error.message;
                  this.alert('warning', 'Opción Carga Masiva', msg);
                }
              },
            });
        }
      } else {
        this.reviewConditions();
      }
    }, 500);
  }

  onFileChange(event: Event) {
    if (this.tipoCarga == FGR_OPCION) {
      return;
    } else {
      const files = (event.target as HTMLInputElement).files;
      if (files.length != 1) throw 'No files selected, or more than of allowed';
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(files[0]);
      fileReader.onload = () => this.readExcel(fileReader.result);
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      let preloadFile = this.excelService.getData<previewData | any>(
        binaryExcel
      );
      this.tableSource = [];
      preloadFile.forEach((data: any, count: number) => {
        // PRUEBA
        // if (count < 1) {
        let objReplace: any = {};
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (key) {
              objReplace[key.toLowerCase()] = data[key];
            }
          }
          // }
        }
        if (objReplace) {
          this.tableSource.push(objReplace);
        }
      });
      let obj: any = {};
      let object: any = this.tableSource[0];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (key) {
            obj[key] = APPLY_DATA_COLUMNS(key);
            // obj[key] = {
            //   title: key.toLocaleUpperCase(),
            //   type: 'string',
            //   sort: false,
            // };
          }
        }
      }
      const _settings = { columns: obj, actions: false };
      this.settings = { ...this.settings, ..._settings };
    } catch (error) {
      this.alert('error', 'Ocurrió un error al leer el archivo', 'Error');
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
    console.log(this.actions[0], target);
    if (this.actions[0]) {
      this.assetsForm.get('actionType').setValue(this.actions[0].value);
      this.assetsForm.get('actionType').updateValueAndValidity();
    }
  }

  /**
   * Inicializar variables del proceso de carga masiva
   */
  startVariables(opcion: boolean = false) {
    if (opcion == true) {
      this.DeclarationsUploadValidationMassive =
        new DeclarationsSatSaeMassive();
      // setTimeout(() => {
      this.DeclarationsUploadValidationMassive.common_general = {
        total_errores: 0,
        registro_errores: 0,
        valid: false,
        count: 0,
        total: 0,
        proceso: '',
        bienes: 0,
        volantes: this.wheelCount,
        expedientes: this.fileNumberCount,
        menajes: 0,
      };
      this.DeclarationsUploadValidationMassive.data_error = [];
      this.DeclarationsUploadValidationMassive.message_progress = '';
      // }, 100);
    } else {
      this.DeclarationsValidationMassive = new DeclarationsSatSaeMassive();
      // setTimeout(() => {
      this.DeclarationsValidationMassive.common_general = {
        total_errores: 0,
        registro_errores: 0,
        valid: false,
        count: 0,
        total: 0,
        proceso: '',
        bienes: 0,
        volantes: 0,
        expedientes: 0,
        menajes: 0,
      };
      this.DeclarationsValidationMassive.data_error = [];
      this.DeclarationsValidationMassive.message_progress = '';
      // }, 100);
    }
  }

  /**
   * Revisar las condiciones para comenzar el proceso de carga de registros
   */
  reviewConditions() {
    if (!this.validLoadFile()) {
      return;
    }
    this.blockErrors(true); // OCULTAR MENSAJES DEL INTERCEPTOR
    // Inicia proceso de preload
    this.procesandoPreload = true;
    if (this.target.value == 'sat') {
      // console.log('SAT');
      this.validatorPreloadMassiveSat();
    } else if (this.target.value == FGR_OPCION) {
      this.endProcess = false;
      // console.log(FGR_OPCION);
      this.validatorPreloadMassivePgr(); // Iniciar proceso de validación
    } else if (this.target.value == 'general') {
      // console.log('GENERAL');
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
    this.assetsForm.get('idCarga').markAsTouched();
    if (this.assetsForm.get('idCarga').valid) {
      this.assetsForm.get('idCarga').clearValidators();
      this.assetsForm.get('idCarga').updateValueAndValidity();
      return true;
    } else {
      // this.onLoadToast('warning', FORM_IDENTIFICATOR_NULL, 'Error');
      this.alert(
        'warning',
        FORM_IDENTIFICATOR_NULL,
        'Ocurrió un error al validar el identificador, intentelo nuevamente.'
      );
      return false;
    }
  }

  /**
   * Revisa si se tiene una opción de carga seleccionada
   * @returns Si la validacion es correcta
   */
  validActionType() {
    if (this.assetsForm.get('actionType').value) {
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
        this.alert(
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
      this.alert('warning', FORM_ACTION_TYPE_NULL, 'Error');
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
      if (this.tipoCarga == FGR_OPCION) {
        this.alert(
          'warning',
          'Error al cargar la información de los bienes, revisa los parámetros: EXPEDIENTE, VOLANTE y OFICIO',
          'Error'
        );
      } else {
        this.alert('warning', NOT_LOAD_FILE, 'Error');
      }
      return false;
    }
  }

  getDataPGRFromParams() {
    this.cargandoPgr = true;
    this.assetsForm.get('idCarga').setValue('ASEG');
    this.assetsForm.updateValueAndValidity();
    // this.assetsForm.get('idCarga').disable();
    this.assetsForm.disable();
    this.pgrData = [];
    const params = new FilterParams();
    params.removeAllFilters();
    let office = encodeURIComponent(this.paramsGeneral.p_av_previa);
    params.addFilter('pgrOffice', office);
    // Obtener data de PGR
    this.goodsBulkService
      .getDataPGRFromParams(params.getFilterParams())
      .subscribe({
        next: res => {
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            if (element) {
              if (element.pgrTypeGoodNum || element.pgrTypeGoodNum == 0) {
                this.pgrData.push(element);
              }
            }
          }
          if (this.pgrData.length > 0) {
            this.initDataPgr(this.pgrData);
          } else {
            this.cargandoPgr = false;
            this.alert(
              'warning',
              'Carga Masiva FGR',
              'Ocurrió un error al cargar la información de los bienes. Para el Oficio: ' +
                this.paramsGeneral.p_av_previa
            );
          }
        },
        error: err => {
          this.cargandoPgr = false;
          this.alert(
            'warning',
            'Carga Masiva FGR',
            'Ocurrió un error al cargar la información de los bienes.' +
              err.error.message
          );
        },
      });
  }

  initDataPgr(pgrData: IPgrTransfer[]) {
    console.log(pgrData);
    const params = new FilterParams();
    params.addFilter('user', this.userId);
    this.hideError();
    this.goodsBulkService.getInfoUserLogued(params.getParams()).subscribe({
      next: data => {
        if (data.data.length > 0) {
          this.userDelegation = data.data[0].delegationNumber;
          this.userSubdelegation = data.data[0].subdelegationNumber;
          this.cargandoPgr = true;
          this.tableSource = [];
          this.pgrData = pgrData;
          this.getDataVolanteData(this.pgrData[0]); // Inicia proceso de carga y validacion
        }
      },
      error: err => {
        this.cargandoPgr = false;
        this.alert(
          'warning',
          'Carga Masiva FGR',
          'Ocurrió un error al cargar la Delegación y Subdelegación. Del usuario: ' +
            err.error.message
        );
      },
    });
  }

  getDataVolanteData(dataPgr: IPgrTransfer, count: number = 0) {
    console.log('CONTADOR PROCESO', count, dataPgr.pgrGoodNumber);
    const params = new FilterParams();
    params.removeAllFilters();
    let expedient = encodeURIComponent(this.paramsGeneral.p_no_expediente);
    params.addFilter('expedientNumber', expedient);
    let volante = encodeURIComponent(this.paramsGeneral.p_no_volante);
    params.addFilter('wheelNumber', volante);
    let off = this.paramsGeneral.p_av_previa.substring(0, 34);
    console.log(off, off.length);
    let oficio = encodeURIComponent(off);
    params.addFilter('officeExternalKey', oficio);
    this.goodsBulkService
      .getDataPgrNotificationByFilter(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log(res);
          this.getFilterDataPgr(dataPgr, count, res.data[0], null); // Inicia proceso de carga y validacion
        },
        error: err => {
          this.cargandoPgr = false;
          this.onLoadToast(
            'warning',
            'Datos del bien',
            'Ocurrio un error al cargar la información del volante.'
          );
        },
      });
  }

  getFilterDataPgr(
    dataPgr: IPgrTransfer,
    count: number = 0,
    volanteData: INotification,
    copiasData: ICopiesxFlier
  ) {
    // let fechaParseOficio = this.datePipe.transform(
    //   volanteData.entryProcedureDate,
    //   'dd/MM/yyyy'
    // );
    let fechaParseOficio = volanteData.externalOfficeDate
      ? this.datePipe.transform(volanteData.externalOfficeDate, 'dd/MM/yyyy')
      : '';
    let data: any = {
      tipovolante: volanteData.wheelType,
      remitente: volanteData.externalRemitter,
      identificador: volanteData.identifier,
      asunto: volanteData.affair.id,
      exptrans: volanteData.expedientTransferenceNumber,
      // descripcion: volanteData.observations,
      ciudad: volanteData.cityNumber,
      entfed: volanteData.entFedKey,
      contribuyente: volanteData.indiciadoNumber,
      transferente: volanteData.endTransferNumber,
      viarecepcion: volanteData.viaKey,
      areadestino: volanteData.departamentDestinyNumber,
      gestiondestino: volanteData.departament.dsarea,
      observaciones: volanteData.observations,
      autoridad: volanteData.autorityNumber,
      nooficio: dataPgr.pgrOffice,
      fecoficio: fechaParseOficio,
      // solicitante: '200',
      solicitante:
        typeof volanteData.institutionNumber == 'number'
          ? volanteData.institutionNumber
          : volanteData.institutionNumber
          ? volanteData.institutionNumber.id
          : '',
      // destinatario: copiasData ? copiasData.copyuser : null,
      destinatario: null,
      descripcion: '',
      cantidad: null,
      unidad: '',
      status: 'ROP',
      clasif: null,
      marca: '',
      serie: '',
    };
    for (let index = 10; index < 44; index++) {
      data['col' + index] = null;
    }
    data['FGR_NO_BIEN'] = dataPgr.pgrGoodNumber; // SET CLAVE UNICA
    if (dataPgr.pgrTypeGoodVeh) {
      // CONDICION VEH
      data.clasif = dataPgr.pgrTypeGoodVeh;
      data.descripcion = dataPgr.pgrDescrGoodVeh;
      data.cantidad = dataPgr.pgrAmountVeh;
      data.unidad =
        dataPgr.pgrUnitMeasureVeh == 'PZ' ? 'PIEZA' : dataPgr.pgrUnitMeasureVeh;
      data.edofisico = dataPgr.pgrEdoPhysicalVeh;
      // DATA EXTRA
      data['marca'] = dataPgr.pgrVehBrand;
      data['submarca'] = dataPgr.pgrVehsubBrand;
      data['modelo'] = dataPgr.pgrVehModel;
      data['serie'] = dataPgr.pgrVehnoserie;
      data['numero de motor'] = dataPgr.pgrVehnoEngine;
      data['procedencia'] = dataPgr.pgrVehOrigin;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalVeh;
      // Data params
      let dataInfo: any = {};
      dataInfo['marca'] = 'MARCA';
      dataInfo['submarca'] = 'SUBMARCA';
      dataInfo['modelo'] = 'MODELO';
      dataInfo['serie'] = 'NUMERO DE SERIE';
      dataInfo['numero_motor'] = 'NUMERO DE MOTOR';
      dataInfo['procedencia'] = 'PROCEDENCIA';
      dataInfo['edofisico'] = 'ESTADO FISICO';
      dataInfo['clasif'] = dataPgr.pgrTypeGoodVeh;
      let dataInfoRow: any = {};
      dataInfoRow['marca'] = dataPgr.pgrVehBrand;
      dataInfoRow['submarca'] = dataPgr.pgrVehsubBrand;
      dataInfoRow['modelo'] = dataPgr.pgrVehModel;
      dataInfoRow['serie'] = dataPgr.pgrVehnoserie;
      dataInfoRow['numero_motor'] = dataPgr.pgrVehnoEngine;
      dataInfoRow['procedencia'] = dataPgr.pgrVehOrigin;
      dataInfoRow['edofisico'] = dataPgr.pgrEdoPhysicalVeh;
      this.getValData(this.pgrData[count], count, data, dataInfo, dataInfoRow); // Siguiente registro
    } else if (dataPgr.pgrTypeGoodAer) {
      // CONDICION AER
      data.clasif = dataPgr.pgrTypeGoodAer;
      data.descripcion = dataPgr.pgrDescrGoodAer;
      data.cantidad = dataPgr.pgrAmountAer;
      data.unidad =
        dataPgr.pgrUniMeasureAer == 'PZ' ? 'PIEZA' : dataPgr.pgrUniMeasureAer;
      data.edofisico = dataPgr.pgrEdoPhysicalAer;
      // DATA EXTRA
      data['marca'] = dataPgr.pgrAerBrand;
      data['modelo'] = dataPgr.pgrAerModel;
      data['numero de motor'] = dataPgr.pgrAernoEngine;
      data['numero de motor'] = dataPgr.pgrAernoEngine2;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalAer;
      data['matricula'] = dataPgr.pgrAermatriactu;
      // Data params
      let dataInfo: any = {};
      dataInfo['marca'] = 'MARCA';
      dataInfo['modelo'] = 'MODELO';
      dataInfo['numero_motor_1'] = 'NUMERO DE MOTOR1';
      dataInfo['numero_motor_2'] = 'NUMERO DE MOTOR2';
      dataInfo['procedencia'] = 'PROCEDENCIA';
      dataInfo['edofisico'] = 'ESTADO FISICO';
      dataInfo['matricula'] = 'MATRICULA';
      dataInfo['clasif'] = dataPgr.pgrTypeGoodAer;
      let dataInfoRow: any = {};
      dataInfoRow['marca'] = dataPgr.pgrAerBrand;
      dataInfoRow['modelo'] = dataPgr.pgrAerModel;
      dataInfoRow['numero_motor_1'] = dataPgr.pgrAernoEngine;
      dataInfoRow['numero_motor_2'] = dataPgr.pgrAernoEngine2;
      dataInfoRow['procedencia'] = dataPgr.pgrEdoPhysicalAer;
      dataInfoRow['edofisico'] = dataPgr.pgrEdoPhysicalAer;
      dataInfoRow['matricula'] = dataPgr.pgrAermatriactu;
      this.getValData(this.pgrData[count], count, data, dataInfo, dataInfoRow); // Siguiente registro
    } else if (dataPgr.pgrTypeGoodEmb) {
      // CONDICION EMB
      data.clasif = dataPgr.pgrTypeGoodEmb;
      data.descripcion = dataPgr.pgrDescrGoodEmb;
      data.cantidad = dataPgr.pgrAmountEmb;
      data.unidad =
        dataPgr.pgrUniMeasureEmb == 'PZ' ? 'PIEZA' : dataPgr.pgrUniMeasureEmb;
      data.edofisico = dataPgr.pgrEdoPhysicalEmb;
      // DATA EXTRA
      data['modelo'] = dataPgr.pgrEmbModel;
      data['procedencia'] = dataPgr.pgrEmbOrigin;
      data['matricula'] = dataPgr.pgrEmbnoTuition;
      data['motor'] = dataPgr.pgrEmbnoEngine;
      data['estado operativo'] = dataPgr.pgrEdoPhysicalEmb;
      data['nombre de la embarcacion'] = dataPgr.pgrEmbName;
      // Data params
      let dataInfo: any = {};
      dataInfo['modelo'] = 'MODELO';
      dataInfo['procedencia'] = 'PROCEDENCIA';
      dataInfo['matricula'] = 'MATRICULA';
      dataInfo['numero_motor'] = 'NUMERO DE MOTOR';
      dataInfo['estado_operativo'] = 'ESTADO OPERATIVO';
      dataInfo['nombre_embarcacion'] = 'NOMBRE DE LA EMBARCACION';
      dataInfo['clasif'] = dataPgr.pgrTypeGoodEmb;
      let dataInfoRow: any = {};
      dataInfoRow['modelo'] = dataPgr.pgrEmbModel;
      dataInfoRow['procedencia'] = dataPgr.pgrEmbOrigin;
      dataInfoRow['matricula'] = dataPgr.pgrEmbnoTuition;
      dataInfoRow['numero_motor'] = dataPgr.pgrEmbnoEngine;
      dataInfoRow['estado_operativo'] = dataPgr.pgrEdoPhysicalEmb;
      dataInfoRow['nombre_embarcacion'] = dataPgr.pgrEmbName;
      this.getValData(this.pgrData[count], count, data, dataInfo, dataInfoRow); // Siguiente registro
    } else if (dataPgr.pgrTypeGoodInm) {
      // CONDICION INM
      data.clasif = dataPgr.pgrTypeGoodInm;
      data.descripcion = dataPgr.pgrDescrGoodInm;
      data.cantidad = dataPgr.pgrAmountInm;
      data.unidad =
        dataPgr.pgrUniMeasureInm == 'PZ' ? 'PIEZA' : dataPgr.pgrUniMeasureInm;
      data.edofisico = dataPgr.pgrEdoPhysicalInm;
      // DATA EXTRA
      data['calle'] = dataPgr.pgrInmcalle;
      data['colonia'] = dataPgr.pgrInmSuburb;
      data['delegacion o municipio'] = dataPgr.pgrInmdelegmuni;
      data['estado'] = dataPgr.pgrInmentfed;
      data['numero exterior'] = dataPgr.pgrInmnoofi;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalInm;
      // Data params
      let dataInfo: any = {};
      dataInfo['calle'] = 'CALLE';
      dataInfo['colonia'] = 'COLONIA';
      dataInfo['delegacion_municipio'] = 'DELEGACION O MUNICIPIO';
      dataInfo['estado'] = 'ESTADO';
      dataInfo['numero_exterior'] = 'NUMERO EXTERIOR';
      dataInfo['edofisico'] = 'ESTADO FISICO';
      dataInfo['clasif'] = dataPgr.pgrTypeGoodInm;
      let dataInfoRow: any = {};
      dataInfoRow['calle'] = dataPgr.pgrInmcalle;
      dataInfoRow['colonia'] = dataPgr.pgrInmSuburb;
      dataInfoRow['delegacion_municipio'] = dataPgr.pgrInmdelegmuni;
      dataInfoRow['estado'] = dataPgr.pgrInmentfed;
      dataInfoRow['numero_exterior'] = dataPgr.pgrInmnoofi;
      dataInfoRow['edofisico'] = dataPgr.pgrEdoPhysicalInm;
      this.getValData(this.pgrData[count], count, data, dataInfo, dataInfoRow); // Siguiente registro
    } else if (dataPgr.pgrTypeGoodNum) {
      // CONDICION NUM
      data.clasif = dataPgr.pgrTypeGoodNum;
      data.descripcion = dataPgr.pgrDescrGoodNum;
      data.cantidad = dataPgr.pgrAmountNum;
      data.unidad =
        dataPgr.pgrUniMeasureNum == 'PZ' ? 'PIEZA' : dataPgr.pgrUniMeasureNum;
      data.edofisico = dataPgr.pgrEdoPhysicalNum;
      // DATA EXTRA
      data['importe'] = dataPgr.pgrNueimport;
      data['cuenta'] = dataPgr.pgrNuenoBill;
      data['moneda'] = dataPgr.pgrNueTypemon;
      data['ficha'] = dataPgr.pgrNuefolficdep;
      data['banco'] = dataPgr.pgrNumofictransf;
      let fechaParse = this.datePipe.transform(
        dataPgr.pgrNuefedepos,
        'dd/MM/yyyy'
      );
      data['fecha'] = fechaParse;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalNum;
      // Data params
      let dataInfo: any = {};
      dataInfo['importe'] = 'IMPORTE';
      dataInfo['cuenta'] = 'CUENTA';
      dataInfo['moneda'] = 'MONEDA';
      dataInfo['ficha'] = 'FICHA';
      dataInfo['banco'] = 'BANCO';
      dataInfo['edofisico'] = 'ESTADO FISICO';
      dataInfo['clasif'] = dataPgr.pgrTypeGoodNum;
      let dataInfoRow: any = {};
      dataInfoRow['importe'] = dataPgr.pgrNueimport;
      dataInfoRow['cuenta'] = dataPgr.pgrNuenoBill;
      dataInfoRow['moneda'] = dataPgr.pgrNueTypemon;
      dataInfoRow['ficha'] = dataPgr.pgrNuefolficdep;
      dataInfoRow['banco'] = dataPgr.pgrNumofictransf;
      dataInfoRow['edofisico'] = dataPgr.pgrEdoPhysicalNum;
      this.getValData(this.pgrData[count], count, data, dataInfo, dataInfoRow); // Siguiente registro
    } else if (dataPgr.pgrTypeGoodJoy) {
      // CONDICION JOY
      data.clasif = dataPgr.pgrTypeGoodJoy;
      data.descripcion = dataPgr.pgrDescrGoodJoy;
      data.cantidad = dataPgr.pgrAmountJoy;
      data.unidad =
        dataPgr.pgrUniMeasureJoy == 'PZ' ? 'PIEZA' : dataPgr.pgrUniMeasureJoy;
      data.edofisico = dataPgr.pgrEdoPhysicalJoy;
      // DATA EXTRA
      data['marca'] = dataPgr.pgrAerBrand;
      data['modelo'] = dataPgr.pgrJoyModel;
      data['marca_joy'] = dataPgr.pgrJoyBrand;
      data['material'] = dataPgr.pgrJoyMaterial;
      data['kilataje'] = dataPgr.pgrJoykilataje;
      data['edofisico1'] = dataPgr.pgrEdoPhysicalJoy;
      // Data params
      let dataInfo: any = {};
      dataInfo['marca'] = 'MARCA';
      dataInfo['modelo'] = 'MODELO';
      dataInfo['material'] = 'MATERIAL';
      dataInfo['kilataje'] = 'KILATAJE';
      dataInfo['edofisico'] = 'ESTADO FISICO';
      dataInfo['clasif'] = dataPgr.pgrTypeGoodJoy;
      let dataInfoRow: any = {};
      dataInfoRow['marca'] = dataPgr.pgrAerBrand;
      dataInfoRow['modelo'] = dataPgr.pgrJoyModel;
      dataInfoRow['marca_joy'] = dataPgr.pgrJoyBrand;
      dataInfoRow['material'] = dataPgr.pgrJoyMaterial;
      dataInfoRow['kilataje'] = dataPgr.pgrJoykilataje;
      dataInfoRow['edofisico'] = dataPgr.pgrEdoPhysicalJoy;
      this.getValData(this.pgrData[count], count, data, dataInfo, dataInfoRow); // Siguiente registro
    } else if (dataPgr.pgrTypeGoodDiv) {
      // CONDICION DIV
      data.clasif = dataPgr.pgrTypeGoodDiv;
      data.descripcion = dataPgr.pgrDescrGoodDiv;
      data.cantidad = dataPgr.pgrAmountDiv;
      data.unidad =
        dataPgr.pgrUniMeasureDiv == 'PZ' ? 'PIEZA' : dataPgr.pgrUniMeasureDiv;
      data.edofisico = dataPgr.pgrEdoPhysicalDiv;
      // DATA EXTRA
      data['edofisico1'] = dataPgr.pgrEdoPhysicalDiv;
      // Data params
      let dataInfo: any = {};
      dataInfo['edofisico'] = 'ESTADO FISICO';
      dataInfo['clasif'] = dataPgr.pgrTypeGoodDiv;
      let dataInfoRow: any = {};
      dataInfoRow['edofisico'] = dataPgr.pgrEdoPhysicalDiv;
      this.getValData(this.pgrData[count], count, data, dataInfo, dataInfoRow); // Siguiente registro
    } else if (dataPgr.pgrTypeGoodMen) {
      // CONDICION MEN
      data.clasif = dataPgr.pgrTypeGoodMen;
      data.descripcion = dataPgr.pgrDescrGoodMen;
      data.cantidad = dataPgr.pgrAmountMen;
      data.unidad =
        dataPgr.pgrUniMeasureMen == 'PZ' ? 'PIEZA' : dataPgr.pgrUniMeasureMen;
      data.edofisico = dataPgr.pgrEdoPhysicalMen;
      // DATA EXTRA
      data['edofisico1'] = dataPgr.pgrEdoPhysicalMen;
      // Data params
      let dataInfo: any = {};
      dataInfo['edofisico'] = 'ESTADO FISICO';
      dataInfo['clasif'] = dataPgr.pgrTypeGoodMen;
      let dataInfoRow: any = {};
      dataInfoRow['edofisico'] = dataPgr.pgrEdoPhysicalMen;
      this.getValData(this.pgrData[count], count, data, dataInfo, dataInfoRow); // Siguiente registro
    }
    // return data;
    // this.loadDataPgr(this.pgrData[count], count, data); // Siguiente registro
  }

  getValData(
    pgrData: IPgrTransfer,
    count: number = 0,
    response: any,
    body: any,
    dataInfo: any
  ) {
    console.log(body);
    this.goodsBulkService.getFaValAtributo1(body).subscribe({
      next: res => {
        let dataResponse: any = res;
        console.log('GET_VAL_DATA', res);
        for (const key in dataResponse) {
          if (Object.prototype.hasOwnProperty.call(dataResponse, key)) {
            const element = dataResponse[key];
            if (element) {
              response['col' + element] = dataInfo[key];
            }
          }
        }
        this.loadDataPgr(this.pgrData[count], count, response); // Siguiente registro
      },
      error: err => {
        this.cargandoPgr = false;
        this.onLoadToast(
          'warning',
          'Datos del bien',
          'Ocurrió un error al cargar la información de los atributos del bien'
        );
      },
    });
  }

  loadDataPgr(pgrData: IPgrTransfer, count: number = 0, response: any) {
    // console.log(response);
    let objReplace: any = {};
    for (const key in response) {
      if (Object.prototype.hasOwnProperty.call(response, key)) {
        if (key) {
          objReplace[key.toLowerCase()] = response[key];
        }
      }
    }
    if (objReplace) {
      this.tableSource.push(objReplace);
    }
    let obj: any = {};
    let object: any = this.tableSource[0];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (key) {
          obj[key] = APPLY_DATA_COLUMNS(key);
          // obj[key] = {
          //   title: key.toLocaleUpperCase(),
          //   type: 'string',
          //   sort: false,
          // };
        }
      }
    }
    // console.log('COMPLETOS', this.pgrData.length, count);
    if (this.pgrData.length <= count + 1) {
      // console.log(this.tableSource);
      const _settings = { columns: obj, actions: false };
      this.settings = { ...this.settings, ..._settings };
      this.cargandoPgr = false;
    } else {
      count++; // Aumentar contador
      this.getDataVolanteData(this.pgrData[count], count); // Inicia proceso de carga y validacion
    }
  }

  goPageVolante() {
    // this.msDocumentsReceptionDataService.flyersRegistrationParams =
    //   this.flyersRegistrationParams;
    // this.msDocumentsReceptionDataService.documentsReceptionRegisterForm =
    //   this.documentsReceptionRegisterForm;
    this.router
      .navigateByUrl('/pages/documents-reception/flyers-registration')
      .then(() => {
        // localStorage.removeItem('_flyersRegistrationParams');
        // localStorage.removeItem('_documentsReceptionRegisterForm');
      });
  }

  /**
   * Proceso de validación de carga masiva para la opción SAT_SAE
   */
  validatorPreloadMassiveSat() {
    if (this.validActionType()) {
      this.startVariables();
      this.startVariables(true);
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

  /**
   * Iniciar el proceso de preload
   * @param count Posicion registro actual
   * @param row Datos del registro actual
   */
  processValidFileSat(count: number = 0, row: any) {
    console.log(row);
    this.resetValidationDataPreload();
    this.tableSourceActualPreload = [row]; // Insertar registro actual en revision
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
        'Validando la unidad de medida';
      console.log(this.DeclarationsValidationMassive.message_progress);
      // Validar Unidad
      if (!data.unidad) {
        error = this.agregarError(error, ERROR_UNIDAD(data.unidad));
      }
      // Validar Estatus
      // if (data.status) {
      this.validStatusColumnaPRE(this.infoDataValidation);
    }
  }

  /**
   * Funciones para validar el proceso de SAT_SAE
   */

  /**
   * Obtener identificador del expediente por el no_expediente
   * @param infoData
   * @param opcionValid
   */
  async validExpedientColumnaPRE(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el Expediente';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Validar Expediente
    if (infoData.dataRow.expediente) {
      await this.goodsBulkService
        .getExpedientById(infoData.dataRow.expediente)
        .subscribe({
          next: res => {
            if (res) {
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
              }
            } else {
              infoData.error = this.agregarError(
                infoData.error,
                ERROR_EXPEDIENTE_IDENTIFICADOR(infoData.dataRow.identificador)
              );
              this.infoDataValidation.error = infoData.error; // Setear error
              infoData.validLastRequest = false; // Respuesta incorrecta
            }
            this.validStatusColumnaPRE(infoData, opcionValid);
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_EXPEDIENTE(infoData.dataRow.status)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            this.validStatusColumnaPRE(infoData, opcionValid);
          },
        });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_EXPEDIENTE(infoData.dataRow.status)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      this.validStatusColumnaPRE(infoData, opcionValid);
    }
  }

  /**
   * Obtener el no_expediente repetido
   * @param infoData
   * @param opcionValid
   */
  async validExpedientByNotificationColumnaPRE(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando las Notificaciones de Transferente, Indiciado y Ciudad';
    console.log(this.DeclarationsValidationMassive.message_progress);
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
            this.validIndicatorByIdPRE(this.infoDataValidation, opcionValid);
          },
          error: err => {
            console.log(err);
            // Validar Indicator
            this.validIndicatorByIdPRE(this.infoDataValidation, opcionValid);
          },
        });
    } else {
      // Validar Indicator
      this.validIndicatorByIdPRE(this.infoDataValidation, opcionValid);
    }
  }

  /**
   * Obtener el número de transferente de la autoridad emisora si es la tansferente mayor a 10000
   * @param infoData
   * @param opcionValid
   */
  async getTransferenteMayorDiezMilPRE(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obteneniendo el Transferente por Transferente Autoridad Emisora';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Validar Notificaciones de Transferente, Indiciado y Ciudad
    if (infoData.dataRow.transferente) {
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: 100,
      };
      this.params.getValue().getParams();
      params['filter.idAuthorityIssuerTransferor'] =
        '$eq:' + infoData.dataRow.transferente + '';
      // Obtener autoridad transferente
      await this.goodsBulkService
        .getEmisoraAutoridadTransferente(params)
        .subscribe({
          next: res => {
            console.log(res);
            infoData.objInsertResponse['LNU_NO_TRANSFERENTE'] =
              res.data[0].idTransferer;
            // Validar Status
            this.validStatusColumnaPRE(this.infoDataValidation, opcionValid);
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              'Error obteneniendo el Transferente ' +
                infoData.dataRow.transferente +
                ' por Transferente Autoridad Emisora.'
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            // Validar Status
            this.validStatusColumnaPRE(this.infoDataValidation, opcionValid);
          },
        });
    } else {
      // Validar Status
      this.validStatusColumnaPRE(this.infoDataValidation, opcionValid);
    }
  }

  async validIndicatorByIdPRE(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el indicador';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Validar el indicador
    if (infoData.dataRow.contribuyente) {
      await this.goodsBulkService
        .getIndicatorById(infoData.dataRow.contribuyente)
        .subscribe({
          next: res => {
            console.log(res);
            // Validar Status
            this.validStatusColumnaPRE(this.infoDataValidation, opcionValid);
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_INDICATOR(infoData.dataRow.contribuyente)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            // Validar Status
            this.validStatusColumnaPRE(this.infoDataValidation, opcionValid);
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
      this.validStatusColumnaPRE(this.infoDataValidation, opcionValid);
    }
  }

  /**
   * Validar el estatus del bien por el estatus
   * @param infoData
   * @param opcionValid
   */
  async validStatusColumnaPRE(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el Estatus del Bien';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let status = '';
    if (this.proceso == 3) {
      status = infoData.dataRow.estatus;
    } else {
      status = infoData.dataRow.status;
    }
    console.log(status, infoData.dataRow);
    // Validar Estatus
    if (status) {
      await this.goodsBulkService.getGoodStatus(status).subscribe({
        next: res => {
          console.log(res);
          infoData.validLastRequest = true; // Respuesta correcta
          this.validClasificationGoodPRE(infoData, opcionValid);
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_ESTATUS(infoData.dataRow.status)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.validClasificationGoodPRE(infoData, opcionValid);
        },
      });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_ESTATUS(infoData.dataRow.status)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      this.validClasificationGoodPRE(infoData, opcionValid);
    }
  }

  /**
   * Obtener clasificador del bien por el no_clasif_bien de cat_sssubtipo_bien
   * @param infoData
   * @param opcionValid
   */
  async validClasificationGoodPRE(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando la clasificación del bien';
    console.log(
      this.DeclarationsValidationMassive.message_progress,
      infoData.dataRow.clasif,
      infoData.contadorRegistro
    );
    let clasif: number = null;
    if (this.proceso == 3) {
      clasif = infoData.dataRow.clasificador;
    } else {
      clasif = infoData.dataRow.clasif;
    }
    // Validar Clasificación de bien
    if (clasif) {
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: this.params.getValue().limit,
      };
      this.params.getValue().getParams();
      params['filter.numClasifGoods'] = '$eq:' + clasif + '';
      await this.goodsBulkService.getGoodssSubtype(params).subscribe({
        next: res => {
          infoData.validLastRequest = true; // Respuesta correcta
          if (res.data.length == 0) {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_CLASS_GOOD(clasif)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
          }
          this.validUnityByClasificationGoodPRE(infoData, opcionValid);
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_CLASS_GOOD(clasif)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.validUnityByClasificationGoodPRE(infoData, opcionValid);
        },
      });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_CLASS_GOOD(clasif)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      this.validUnityByClasificationGoodPRE(infoData, opcionValid);
    }
  }

  /**
   * INCIDENCIA 623 --- NO SE CAMBIA EL MS Y SE SETEAN LAS UNIDADES MANUALMENTE EN EL CODIGO
   * Obtener la unidad de medida de UNIDXCLASIF por el no_clasif_bien
   * @param infoData
   * @param opcionValid
   */
  async validUnityByClasificationGoodPRE(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando la unidad de medida de acuerdo a la clasificación del bien';
    console.log(
      this.DeclarationsValidationMassive.message_progress,
      infoData.dataRow.clasif,
      infoData.contadorRegistro
    );
    let clasif: number = null;
    if (this.proceso == 3) {
      clasif = infoData.dataRow.clasificador;
    } else {
      clasif = infoData.dataRow.clasif;
    }
    // Validar Unidad de acuerdo al número de Clasificación de bien
    if (clasif) {
      await this.goodsBulkService
        .getUnityByUnityAndClasifGood(clasif)
        .subscribe({
          next: res => {
            infoData.validLastRequest = true; // Respuesta correcta
            console.log(res);
            if (res.data.length > 0) {
              let comparacion = '';
              if (infoData.dataRow.unidad == 'PZ') {
                comparacion = 'PIEZA';
              } else {
                comparacion = infoData.dataRow.unidad;
              }
              const found = res.data.find(
                element => element.unit == comparacion
              );
              console.log(found, infoData.dataRow);
              if (!found) {
                infoData.error = this.agregarError(
                  infoData.error,
                  ERROR_UNITY_CLASS_GOOD(infoData.dataRow.unidad, clasif)
                );
                this.infoDataValidation.error = infoData.error; // Setear error
                infoData.validLastRequest = false; // Respuesta incorrecta
              }
            } else {
              infoData.error = this.agregarError(
                infoData.error,
                ERROR_UNITY_CLASS_GOOD(infoData.dataRow.unidad, clasif)
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
            } else if (opcionValid == FGR_OPCION) {
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
                this.processEndGeneral(infoData);
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
              ERROR_UNITY_CLASS_GOOD(infoData.dataRow.unidad, clasif)
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
            } else if (opcionValid == FGR_OPCION) {
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
                this.processEndGeneral(infoData);
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
        ERROR_UNITY_CLASS_GOOD(infoData.dataRow.unidad, clasif)
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
      } else if (opcionValid == FGR_OPCION) {
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
        'Validando el identificador';
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
        this.validTransferentePRE(infoData);
      }
    }
  }

  async validTransferentePRE(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando el Transferente';
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
      'Validando los datos requeridos para el Mueble';
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
            let dataResponse = this.validateAttributeClassificationgoodPRE(
              res.data,
              SAT_SAE_MUEBLES_PROCESO_4
            );
            console.log('VALIDAR MUEBLES CLASIF GOOD', dataResponse);
          }
          if (opcionValid == 'sat') {
            this.processEndSat(infoData);
          } else {
            this.processEndGeneral(infoData);
          }
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_ATRIBUTE_CLASS_GOOD(infoData.dataRow.clasif)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          if (opcionValid == 'sat') {
            this.processEndSat(infoData);
          } else {
            this.processEndGeneral(infoData);
          }
        },
      });
  }

  async validInmuebleSat(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Validando los datos requeridos para el Inmueble';
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
            let dataResponse = this.validateAttributeClassificationgoodPRE(
              res.data,
              SAT_SAE_INMUEBLES_PROCESO_4
            );
            console.log('VALIDAR INMUEBLES CLASIF GOOD', dataResponse);
          }
          if (opcionValid == 'sat') {
            this.processEndSat(infoData);
          } else {
            this.processEndGeneral(infoData);
          }
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_ATRIBUTE_CLASS_GOOD(infoData.dataRow.clasif)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          if (opcionValid == 'sat') {
            this.processEndSat(infoData);
          } else {
            this.processEndGeneral(infoData);
          }
        },
      });
  }

  /**
   * TERMINA PROCESO DE VALIDACION DE ARCHIVO
   */

  /**
   * Preload fin del proceso o continuar con siguiente registro
   * @param infoData Infodata
   * @returns
   */
  processEndSat(infoData: IValidInfoData) {
    // Agregar contador de error para el registro
    if (this.DeclarationsValidationMassive.common_general.total_errores > 0) {
      this.DeclarationsValidationMassive.common_general.registro_errores++;
      infoData.error[1].push(infoData.dataRow);
      this.DeclarationsValidationMassive.data_error.push(infoData.error);
      console.log(this.DeclarationsValidationMassive.message_progress);
    }
    if (this.stopProcess) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Se detuvo el proceso por el usuario para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '"';
      this.reviewStopProcess();
      return;
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_END_MESSAGE;
      // Termina proceso de preload
      this.procesandoPreload = false;
      // SI NO SE ENCUENTRAN ERRORES COMENZAR CARGA DE DATOS
      if (
        this.DeclarationsValidationMassive.common_general.total_errores == 0 &&
        this.DeclarationsValidationMassive.common_general.registro_errores == 0
      ) {
        this.validDataUploadMassiveSat();
      }
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Se termino el proceso para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '"';
      // Fin del proceso para validar la carga SAT
      this.processValidFileSat(
        infoData.contadorRegistro + 1,
        this.tableSource[infoData.contadorRegistro + 1]
      ); // CONTINUAR PROCESO
    }
  }

  /**
   * Preload fin del proceso o continuar con siguiente registro
   * @param infoData Infodata
   * @returns
   */
  processEndGeneral(infoData: IValidInfoData) {
    // Agregar contador de error para el registro
    if (this.DeclarationsValidationMassive.common_general.total_errores > 0) {
      this.DeclarationsValidationMassive.common_general.registro_errores++;
      infoData.error[1].push(infoData.dataRow);
      this.DeclarationsValidationMassive.data_error.push(infoData.error);
      console.log(this.DeclarationsValidationMassive.message_progress);
    }
    if (this.stopProcess) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Se detuvo el proceso por el usuario para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      this.reviewStopProcess();
      return;
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      console.log(this.DeclarationsValidationMassive);
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_END_MESSAGE;
      // Termina proceso de preload
      this.procesandoPreload = false;
      // SI NO SE ENCUENTRAN ERRORES COMENZAR CARGA DE DATOS
      if (
        this.DeclarationsValidationMassive.common_general.total_errores == 0 &&
        this.DeclarationsValidationMassive.common_general.registro_errores == 0
      ) {
        this.validDataUploadMassiveGeneral();
      }
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

  /**
   * Preload fin del proceso o continuar con siguiente registro
   * @param infoData Infodata
   * @returns
   */
  processEndPgr(infoData: IValidInfoData) {
    // Agregar contador de error para el registro
    if (this.DeclarationsValidationMassive.common_general.total_errores > 0) {
      this.DeclarationsValidationMassive.common_general.registro_errores++;
      infoData.error[1].push(infoData.dataRow);
      this.DeclarationsValidationMassive.data_error.push(infoData.error);
      console.log(this.DeclarationsValidationMassive.message_progress);
    }
    if (this.stopProcess) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        'Se detuvo el proceso por el usuario para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      this.reviewStopProcess();
      return;
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsValidationMassive.message_progress =
        VALIDATION_END_MESSAGE;
      // Termina proceso de preload
      this.procesandoPreload = false;
      // SI NO SE ENCUENTRAN ERRORES COMENZAR CARGA DE DATOS
      if (
        this.DeclarationsValidationMassive.common_general.total_errores == 0 &&
        this.DeclarationsValidationMassive.common_general.registro_errores == 0
      ) {
        this.blockErrors(false); // OCULTAR MENSAJES DEL INTERCEPTOR
        this.getTempPgrExpedientByFilter(true); // Crear expediente y volante para continuar
        // this.validDataUploadMassivePgr(); // Comenzar la cargar de la información
      }
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

  /**
   * TERMINA PROCESO DE VALIDACION DE ARCHIVO
   */

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
  validateAttributeClassificationgoodPRE(
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
          } else if (opcionValid == FGR_OPCION) {
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
          } else if (opcionValid == FGR_OPCION) {
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
    if (this.validActionType()) {
      this.startVariables();
      this.startVariables(true);
      this.proceso = 4; // Setear proceso 4 para PGR
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

  /**
   * Iniciar el proceso de preload
   * @param count Posicion registro actual
   * @param row Datos del registro actual
   */
  processValidFilePgr(count: number = 0, row: any) {
    console.log(row);
    this.resetValidationDataPreload();
    this.tableSourceActualPreload = [row]; // Insertar registro actual en revision
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      VALIDATION_PROCESS_MESSAGE(count + 1);
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
    this.validStatusColumnaPRE(this.infoDataValidation, FGR_OPCION);
  }

  /**
   * Proceso de validación de carga masiva para la opción GENERAL
   */
  validatorPreloadMassiveGeneral() {
    if (this.validIdCarga() && this.validActionType()) {
      this.startVariables();
      this.startVariables(true);
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
        this.assetsForm.get('actionType').value
        //   &&
        // (this.assetsForm.get('cars').value ||
        //   this.assetsForm.get('inmuebles').value)
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

  /**
   * Iniciar el proceso de preload para general
   * @param count Posicion registro actual
   * @param row Datos del registro actual
   */
  async processValidFileGeneral(count: number = 0, row: any) {
    console.log(row);
    this.resetValidationDataPreload();
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      VALIDATION_PROCESS_MESSAGE(count + 1);
    this.tableSourceActualPreload = [row]; // Insertar registro actual en revision
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
      objInsertResponse: {},
      validLastRequest: false,
    };
    console.log(this.infoDataValidation);
    // Llenar campo de valid estatus
    if (
      (this.proceso == 1 && this.infoDataValidation.dataRow.status != 'ROP') ||
      (this.proceso == 2 && this.infoDataValidation.dataRow.status != 'ROP') ||
      (this.proceso == 4 && this.infoDataValidation.dataRow.status != 'ROP')
    ) {
      this.infoDataValidation.dataRow['valida_status'] = 0;
    } else if (this.infoDataValidation.dataRow.estatus) {
      if (
        this.proceso == 3 &&
        this.infoDataValidation.dataRow.estatus != 'ROP'
      ) {
        this.infoDataValidation.validLastRequest = true;
      } else {
        this.infoDataValidation.objInsertResponse['valida_status'] = 1;
      }
    } else {
      this.infoDataValidation.objInsertResponse['valida_status'] = 1;
    }
    // --- PROCESO 1 Inserción de bienes
    // --- PROCESO 2 Inserción de menaje
    // --- PROCESO 3 Actualización de bienes
    // --- PROCESO 4 Inserción de volantes
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
      if (this.infoDataValidation.dataRow['valida_status'] == 0) {
        error = this.agregarError(
          error,
          ERROR_ESTATUS_GENERAL(count + 1, this.proceso)
        );
        this.infoDataValidation.error = this.infoDataValidation.error; // Setear error
        this.infoDataValidation.validLastRequest = false; // Respuesta incorrecta
        this.processEndGeneral(this.infoDataValidation);
      } else {
        // Mensaje de proceso de validación actual
        this.DeclarationsValidationMassive.message_progress =
          'Validando la cantidad.';
        console.log(this.DeclarationsValidationMassive.message_progress);
        // Validar Cantidad
        if (!data.cantidad) {
          error = this.agregarError(error, ERROR_CANTIDAD(data.cantidad));
          this.infoDataValidation.error = this.infoDataValidation.error; // Setear error
          this.infoDataValidation.validLastRequest = false; // Respuesta incorrecta
        }
        if (this.proceso == 4) {
          // --- PROCESO 4 Inserción de volantes
          // Validar notificaciones del expediente
          this.validExpedientByNotificationColumnaPRE(
            this.infoDataValidation,
            'general'
          );
        } else {
          console.log(this.infoDataValidation);
          if (this.infoDataValidation.validLastRequest) {
            await this.goodsBulkService
              .getZStatusCatPhasePart(this.infoDataValidation.dataRow.estatus)
              .subscribe({
                next: res => {
                  console.log(res);
                  if (res.count > 0) {
                    this.infoDataValidation.objInsertResponse[
                      'valida_status'
                    ] = 1;
                    // Validar Estatus
                    this.validStatusColumnaPRE(
                      this.infoDataValidation,
                      'general'
                    );
                  } else {
                    this.infoDataValidation.objInsertResponse[
                      'valida_status'
                    ] = 0;
                    this.infoDataValidation.error = this.agregarError(
                      this.infoDataValidation.error,
                      'No se realizo la inserción del bien con la posición ' +
                        (this.infoDataValidation.contadorRegistro + 1) +
                        ' debido a que su estatus no es permitido para actualización.'
                    );
                    this.infoDataValidation.error =
                      this.infoDataValidation.error; // Setear error
                    this.infoDataValidation.validLastRequest = false; // Respuesta incorrecta
                    // Finalizar proceso
                    this.processEndGeneral(this.infoDataValidation);
                  }
                },
                error: err => {
                  this.infoDataValidation.error = this.agregarError(
                    this.infoDataValidation.error,
                    'Error al validar el estatus: ' +
                      this.infoDataValidation.dataRow.estatus
                  );
                  this.infoDataValidation.error = this.infoDataValidation.error; // Setear error
                  this.infoDataValidation.validLastRequest = false; // Respuesta incorrecta
                  // Validar Estatus
                  this.validStatusColumnaPRE(
                    this.infoDataValidation,
                    'general'
                  );
                },
              });
          } else {
            if (this.proceso == 3) {
              // --- PROCESO 3 Actualización de bienes
              this.infoDataValidation.error = this.agregarError(
                this.infoDataValidation.error,
                'No se realizo la inserción del bien con la posición ' +
                  (this.infoDataValidation.contadorRegistro + 1) +
                  ' debido a que su estatus no es permitido para actualización.'
              );
              this.infoDataValidation.error = this.infoDataValidation.error; // Setear error
              this.infoDataValidation.validLastRequest = false; // Respuesta incorrecta
              // Finalizar proceso
              this.processEndGeneral(this.infoDataValidation);
            } else if (this.proceso == 2) {
              // --- PROCESO 2 Inserción de menaje
              // Mensaje de proceso de validación actual
              this.DeclarationsValidationMassive.message_progress =
                'Validando el número de Bien Menaje.';
              console.log(this.DeclarationsValidationMassive.message_progress);
              // Validar bien menaje
              if (!data.nobienmenaje) {
                error = this.agregarError(
                  error,
                  'Falta el número de bien padre menaje: ' + data.nobienmenaje
                );
                this.infoDataValidation.error = this.infoDataValidation.error; // Setear error
                this.infoDataValidation.validLastRequest = false; // Respuesta incorrecta
              }
              // Validar Estatus
              this.validStatusColumnaPRE(this.infoDataValidation, 'general');
            } else {
              // --- PROCESO 1 Inserción de bienes
              // Validar Expediente
              this.validExpedientColumnaPRE(this.infoDataValidation, 'general');
            }
          }
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
      this.alert('warning', 'Reporte', ERROR_EXPORT);
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
      this.alert('warning', 'Reporte', ERROR_EXPORT);
    }
    // El type no es necesario ya que por defecto toma 'xlsx'
    this.excelService.export(errores, {
      filename: `errores_${
        this.DeclarationsUploadValidationMassive.common_general.proceso
      }${new Date().getTime()}`,
    });
  }

  // FUNCIONES PARA CARGA

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
          if (opcionValid == 'general') {
            this.getVolanteNotificacion(infoData, opcionValid); // Obtener volantes de notificaciones
          } else {
            // BUSCAR CLAVE UNICA
            this.searchSatUniqueKey(infoData, opcionValid); // Buscar clave sat
          }
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_GOOD_INMUEBLE(infoData.dataRow.transferente)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta
          if (opcionValid == 'general') {
            this.processUploadEndGeneral(infoData); // Termina proceso general
          } else {
            // BUSCAR CLAVE UNICA
            this.searchSatUniqueKey(infoData, opcionValid); // Buscar clave sat
          }
        },
      });
  }

  // INCIDENCIA: 602 --- PENDIENTE DESPLIEGUE
  // Obtenber volante de acuerdo al numero de bien
  async getVolanteNotificacionByNoGood(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obteniendo volante de notificaciones.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    //Obtener volante de notificaciones
    await this.goodsBulkService
      .getVolanteNotificacionesByNoExpedient(infoData.dataRow.expediente)
      .subscribe({
        next: res => {
          console.log(res);
          infoData.validLastRequest = true; // Respuesta
          infoData.objInsertResponse['lnu_no_volante'] = res.data[0].wheel; // Obtener el volante
          this.getNotificacionByVolante(infoData, opcionValid);
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            'Error al obtener el volante de acuerdo al número de bien.'
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta
          this.getNotificacionByVolante(infoData, opcionValid);
        },
      });
  }

  // Obtenber volante de acuerdo al expediente
  async getVolanteNotificacion(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obteniendo volante de notificaciones.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    //Obtener volante de notificaciones
    await this.goodsBulkService
      .getVolanteNotificacionesByNoExpedient(infoData.dataRow.expediente)
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data.length > 0) {
            infoData.objInsertResponse['lnu_no_volante'] = res.data[0].wheel; // Obtener el volante
          } else {
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              'Error al obtener el volante de acuerdo al expediente.'
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta
          }
          if (this.proceso == 4 && opcionValid == 'general') {
            this.validExpedient(infoData, opcionValid);
          } else {
            this.getNotificacionByVolante(infoData, opcionValid);
          }
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            'Error al obtener el volante de acuerdo al expediente.'
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta

          if (this.proceso == 4 && opcionValid == 'general') {
            this.validExpedient(infoData, opcionValid);
          } else {
            this.getNotificacionByVolante(infoData, opcionValid);
          }
        },
      });
  }

  async getNotificacionByVolante(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obtener notificacion por volante.';
    console.log(
      this.DeclarationsValidationMassive.message_progress,
      infoData.objInsertResponse
    );
    if (!infoData.objInsertResponse['lnu_no_volante']) {
      infoData.error = this.agregarError(
        infoData.error,
        'Error al Obtener notificacion por volante'
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      if (this.proceso == 3) {
        this.setGoodDataUpload(infoData, opcionValid); // Actualizar bien
      } else {
        this.getTagXClassif(infoData, opcionValid); // Obtener etiqueta por clasif
      }
    } else {
      // Parametros para consulta
      const params: ListParams = {
        page: this.params.getValue().page,
        limit: 100,
      };
      this.params.getValue().getParams();
      params['filter.wheelNumber'] =
        '$eq:' + infoData.objInsertResponse['lnu_no_volante'] + '';
      await this.goodsBulkService
        .getGetNotificacionByVolante(params)
        .subscribe({
          next: res => {
            console.log(res);
            if (res.data) {
              infoData.objInsertResponse['lnu_TRANSFERENTE'] =
                res.data[0].transference;
            }
            if (this.proceso == 3) {
              this.setGoodDataUpload(infoData, opcionValid); // Actualizar bien
            } else {
              this.getTagXClassif(infoData, opcionValid); // Obtener etiqueta por clasif
            }
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              'Error al Obtener notificacion por volante'
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            if (this.proceso == 3) {
              this.setGoodDataUpload(infoData, opcionValid); // Actualizar bien
            } else {
              this.getTagXClassif(infoData, opcionValid); // Obtener etiqueta por clasif
            }
          },
        });
    }
  }

  revisarAvaluo(infoData: IValidInfoData, opcionValid: string = 'sat') {
    let exp = [1424, 1426, 62];
    infoData.objInsertResponse['vVALOR_AVALUO'] = null;
    if (exp.includes(infoData.dataRow.expediente)) {
      // Revisar quitar cero
    }
    this.getTagXClassif(infoData, opcionValid); // Obtener clasif
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
          if (opcionValid == FGR_OPCION) {
            infoData.objInsertResponse['FGR_NO_BIEN'] = res.satOnlyKey; // Obtener FGR CVE Unica
          } else {
            infoData.objInsertResponse['SAT_CVE_UNICA'] = res.satOnlyKey; // Obtener SAT CVE Unica
          }
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
      'Obteniendo la clave de la Ciudad.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let dataFilter = '';
    if (opcionValid == 'sat') {
      dataFilter = this.paramsGeneral.asunto_sat;
    } else if (opcionValid == FGR_OPCION) {
      dataFilter = this.paramsGeneral.p_av_previa;
    }
    // Creacion del bien
    if (infoData.dataRow.descripcion || opcionValid == FGR_OPCION) {
      // Obtener la clave de la ciudad apartir de la clave Asunto SAT
      await this.goodsBulkService
        .searchCityByAsuntoSat(dataFilter, opcionValid)
        .subscribe({
          next: res => {
            if (res.no_ciudad) {
              infoData.objInsertResponse.no_ciudad = res.no_ciudad;
            } else {
              infoData.objInsertResponse.no_ciudad = res.citynumber;
            }
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
    await this.goodsBulkService
      .getIssuingInstitutionById(
        opcionValid == 'general' ? infoData.dataRow.contribuyente : '200'
      )
      .subscribe({
        next: res => {
          infoData.objInsertResponse['LST_NOMBRE_INTITUCION'] =
            res.authorityName;
          this.getEmisoraAutoridad(infoData, opcionValid);
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            ERROR_ISSUING_INSTITUTION(
              opcionValid == 'general' ? infoData.dataRow.contribuyente : '200'
            )
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.getEmisoraAutoridad(infoData, opcionValid);
        },
      });
  }

  async getEmisoraAutoridadTransferente(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obteniendo Transferente, Emisora y Autoridad.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Parametros para consulta
    const params: ListParams = {
      page: this.params.getValue().page,
      limit: 100,
    };
    this.params.getValue().getParams();
    params['filter.idAuthorityIssuerTransferor'] =
      '$eq:' + infoData.dataRow.clasif + '';
    // Obtener institucion emisora EMISORA Y AUTORIDAD
    await this.goodsBulkService
      .getEmisoraAutoridadTransferente(params)
      .subscribe({
        next: res => {
          console.log('emisora autoridad', res);
          if (res.data.length == 0) {
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              'Error Obteniendo Transferente, Emisora y Autoridad. Para el id: ' +
                infoData.dataRow.clasif
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
          } else {
            infoData.objInsertResponse['LNU_NO_TRANSFERENTE'] =
              res.data[0].idTransferer;
            infoData.objInsertResponse['LNU_NO_EMISORA'] =
              res.data[0].idAuthorityIssuerTransferor;
            infoData.objInsertResponse['LNU_AUTORIDAD'] =
              res.data[0].idAuthority;
          }
          this.insertExpedient(infoData, opcionValid); // Insertar en expedientes
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            'Error Obteniendo Transferente, Emisora y Autoridad. Para el id: ' +
              infoData.dataRow.clasif
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.insertExpedient(infoData, opcionValid); // Insertar en expedientes
        },
      });
  }

  // INCIDENCIA 643 --
  async getEmisoraAutoridad(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    if (this.proceso == 4 && opcionValid == 'general') {
      this.getEmisoraAutoridadTransferente(infoData, opcionValid);
    } else {
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
      } else if (opcionValid == FGR_OPCION) {
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

            if (res.count == 1) {
              infoData.objInsertResponse.no_autoridad =
                res.data[0].no_autoridad; // SET AUTORIDAD
              infoData.objInsertResponse.no_emisora = res.data[0].no_emisora; // SET EMISORA
            } else {
              infoData.error = this.agregarErrorUploadValidation(
                infoData.error,
                ERROR_TRANSFERENTE_PARAMS(
                  1,
                  opcionValid,
                  issuingParams.expedientSat
                    ? issuingParams.expedientSat
                    : issuingParams.office,
                  issuingParams.transferent,
                  issuingParams.city
                )
              );
              this.infoDataValidation.error = infoData.error; // Setear error
              infoData.validLastRequest = false; // Respuesta incorrecta
            }
            this.getOTClaveEnt(infoData, opcionValid); // Obtener clave entidad federativa
          },
          error: err => {
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              ERROR_TRANSFERENTE_PARAMS(
                0,
                opcionValid,
                issuingParams.expedientSat
                  ? issuingParams.expedientSat
                  : issuingParams.office,
                issuingParams.transferent,
                issuingParams.city
              )
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            this.getOTClaveEnt(infoData, opcionValid); // Obtener clave entidad federativa
          },
        });
    }
  }

  async getOTClaveEnt(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obteniendo clave de la entidad federativa.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let dataFilter: any;
    if (opcionValid == 'sat') {
      dataFilter = encodeURIComponent(this.paramsGeneral.asunto_sat);
      // Obtener la clave de la entidad federativa apartir de la clave Asunto SAT
      await this.goodsBulkService
        .getEntityFederativeByAsuntoSat(dataFilter)
        .subscribe({
          next: res => {
            console.log(res);
            infoData.objInsertResponse.otclave_federative_entity = res.otclave;
            this.validExpedient(infoData, opcionValid); // Validar expediente
          },
          error: err => {
            console.log(err);
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              ERROR_CITY_ASUNTO_SAT(dataFilter)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            this.validExpedient(infoData, opcionValid); // Validar expediente
          },
        });
    } else {
      dataFilter = this.paramsGeneral.p_av_previa;
      // Obtener la clave de la entidad federativa apartir de la clave Asunto SAT
      await this.goodsBulkService
        .getOTClaveEntityFederativeByAvePrevia(dataFilter)
        .subscribe({
          next: res => {
            console.log(res);
            infoData.objInsertResponse.otclave_federative_entity = res.otclave;
            if (opcionValid == 'general') {
              this.validExpedient(infoData, opcionValid); // Validar expediente
            } else {
              if (this.infoDataValidation.dataRow.tipovolante) {
                // COL1 IS NOT NULL
                this.validExpedient(infoData, opcionValid); // Validar expediente
              } else {
                this.getTagXClassif(infoData, opcionValid); // Validar emisoras
              }
            }
          },
          error: err => {
            console.log(err);
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              ERROR_CITY_ASUNTO_SAT(dataFilter)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            if (opcionValid == 'general') {
              this.validExpedient(infoData, opcionValid); // Validar expediente
            } else {
              if (this.infoDataValidation.dataRow.tipovolante) {
                // COL1 IS NOT NULL
                this.validExpedient(infoData, opcionValid); // Validar expediente
              } else {
                this.getTagXClassif(infoData, opcionValid); // Validar emisoras
              }
            }
          },
        });
    }
    console.log(dataFilter);
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
            if (this.proceso == 4 && opcionValid == 'general') {
              this.getInstitucionesEmisoras(infoData, opcionValid);
            } else {
              this.getTagXClassif(infoData, opcionValid); // Obtener etiqueta de clasificacion del bien
            }
          }
        },
        error: err => {
          console.log(err);
          if (
            err.status == 400 &&
            err.error.message == 'Data no encontrada' &&
            opcionValid == FGR_OPCION
          ) {
            this.insertExpedient(infoData, opcionValid);
          } else {
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              ERROR_EXPEDIENTE(infoData.dataRow.expediente)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            if (this.proceso == 4 && opcionValid == 'general') {
              this.getInstitucionesEmisoras(infoData, opcionValid);
            } else {
              this.getTagXClassif(infoData, opcionValid); // Obtener etiqueta de clasificacion del bien
            }
          }
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
      insertedBy: this.userId.toUpperCase(), //'USER', // USUARIO SETEADO MANUALMENTE
      insertMethod: 'CARGA MASIVA VOLANTES', // TIPO DE CARGA MASIVA
      insertDate: dateNowParse, // FECHA ACTUAL PARA CARGAR
      nameInstitution: infoData.objInsertResponse['LST_NOMBRE_INSTITUCION'], // NOMBRE DE LA INSTITUCION EMISORA
      indicatedName: null, // SE PASA EL VALOR EN NULL
      federalEntityKey: infoData.objInsertResponse['otclave_federative_entity'], // ENTIDAD FEDERATIVA CLAVE
      identifier: infoData.dataRow.identificador, // IDENTIFICADOR
      transferNumber: infoData.dataRow.transferente, // NUMERO DE TRANSFERENTE
      expTransferNumber:
        opcionValid == FGR_OPCION
          ? infoData.dataRow.exptrans
          : infoData.dataRow.expediente, // EXPEDIENTE TRANSFER NUMBER
      expedientType: opcionValid == 'sat' ? 'T' : 'P', // TIPO DE EXPEDIENTE
      authorityNumber: infoData.objInsertResponse['no_autoridad'], // NUMERO DE AUTORIDAD
      stationNumber: infoData.objInsertResponse['no_emisora'], // NUMERO EMISORA
    };
    let messageExtra = '';
    if (!expedienteData.nameInstitution) {
      messageExtra =
        messageExtra +
        ' -Error al obtener el Nombre de la Institución Emisora.';
    }
    if (!expedienteData.federalEntityKey) {
      messageExtra =
        messageExtra + ' -Error al obtener la Clave de la Entidad Federativa.';
    }
    if (!expedienteData.authorityNumber) {
      messageExtra =
        messageExtra + ' -Error al obtener el Número de Autoridad.';
    }
    if (!expedienteData.stationNumber) {
      messageExtra = messageExtra + ' -Error al obtener el Número de Emisora.';
    }
    console.log('Data del expediente', expedienteData);
    // if (this.proceso == 4 && opcionValid == 'general') {
    //   this.getInstitucionesEmisoras(infoData, opcionValid);
    // } else {
    //   this.getTagXClassif(infoData, opcionValid); // Obtener la etiqueta de acuerdo a la clasificacion
    // }
    // Crear un expediente
    await this.goodsBulkService.createExpedient(expedienteData).subscribe({
      next: res => {
        console.log(res);
        infoData.objInsertResponse['idExpediente'] = res.id; // Setear id del expediente
        infoData = this.createdGoodsWheelsExpedients(
          res.id.toString(),
          'expedientes',
          infoData
        ); // Guardar expediente insertado
        if (this.proceso == 4 && opcionValid == 'general') {
          this.getInstitucionesEmisoras(infoData, opcionValid);
        } else {
          this.getTagXClassif(infoData, opcionValid); // Obtener la etiqueta de acuerdo a la clasificacion
        }
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          ERROR_CREATE_EXPEDIENT + ' ' + err.error.message + ' ' + messageExtra
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        if (this.proceso == 4 && opcionValid == 'general') {
          this.getInstitucionesEmisoras(infoData, opcionValid);
        } else {
          this.getTagXClassif(infoData, opcionValid); // Obtener la etiqueta de acuerdo a la clasificacion
        }
      },
    });
  }

  async getTagXClassif(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Obtener etiqueta por clasificacion del bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let trans =
      opcionValid == FGR_OPCION
        ? infoData.dataRow.transferente
        : infoData.objInsertResponse.manualvar_no_transferente;
    if (!infoData.dataRow.clasif || !trans) {
      infoData.error = this.agregarErrorUploadValidation(
        infoData.error,
        'Error al obtener la etiqueta por clasificacion del bien'
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      if (opcionValid == 'general') {
        this.validExpedientColumna(infoData, opcionValid); // Expediente
      } else {
        if (opcionValid == FGR_OPCION) {
          this.processUploadEndPgr(infoData); // Termina proceso
        } else {
          // this.createGood(infoData, opcionValid); // Crear bien
          this.processUploadEndGeneral(infoData); // Termina proceso
        }
      }
    } else {
      let transfNumber =
        opcionValid == FGR_OPCION
          ? infoData.dataRow.transferente
          : infoData.objInsertResponse['lnu_TRANSFERENTE']
          ? parseInt(infoData.objInsertResponse['lnu_TRANSFERENTE'])
          : parseInt(infoData.objInsertResponse.manualvar_no_transferente);
      let dataTag: ITagXClasif = {
        col6: infoData.dataRow.clasif,
        lnuTransfereeNumber: transfNumber,
      };
      // Obtener el numero de etiqueta
      await this.goodsBulkService
        .getTagXClasifByCol6Transfer(dataTag)
        .subscribe({
          next: res => {
            console.log(res);
            infoData.objInsertResponse['vno_etiqueta'] = res.vno_label; // Setear la etiqueta
            if (opcionValid == 'general') {
              if (this.proceso == 2) {
                this.createGood(infoData, opcionValid); // Crear bien
              } else {
                this.validExpedientColumna(infoData, opcionValid); // Expediente
              }
            } else {
              this.createGood(infoData, opcionValid); // Crear bien
            }
          },
          error: err => {
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              'Error al obtener la etiqueta por clasificacion del bien'
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            if (opcionValid == 'general') {
              if (this.proceso == 2) {
                this.createGood(infoData, opcionValid); // Crear bien
              } else {
                this.validExpedientColumna(infoData, opcionValid); // Expediente
              }
            } else {
              this.createGood(infoData, opcionValid); // Crear bien
            }
          },
        });
    }
  }

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
            if (this.proceso == 1 && opcionValid == 'general') {
              if (res.identifier) {
                this.createGood(infoData, opcionValid, 1); // Crear bien
              } else {
                this.processUploadEndGeneral(infoData); // Se termina el proceso ya que no se encuentra identificador
              }
            } else {
              if (res.identifier != infoData.dataRow.identificador) {
                infoData.error = this.agregarError(
                  infoData.error,
                  ERROR_EXPEDIENTE_IDENTIFICADOR(res.identifier)
                );
                this.infoDataValidation.error = infoData.error; // Setear error
                infoData.validLastRequest = false; // Respuesta incorrecta
              } else {
                infoData.validLastRequest = true; // Respuesta correcta
                if (opcionValid == 'general') {
                  infoData.objInsertResponse['V_IDEN'] = res.identifier;
                  this.createGood(infoData, opcionValid, 1); // Crear bien
                } else {
                  this.validStatusColumnaPRE(infoData, opcionValid);
                }
              }
            }
          },
          error: err => {
            infoData.error = this.agregarError(
              infoData.error,
              ERROR_EXPEDIENTE(infoData.dataRow.expediente)
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta

            if (opcionValid == 'general') {
              if (this.proceso == 1) {
                this.processUploadEndGeneral(infoData); // Se termina el proceso ya que no se encuentra identificador
              } else {
                this.createGood(infoData, opcionValid, 1); // Crear bien
              }
            } else {
              this.validStatusColumnaPRE(infoData, opcionValid);
            }
          },
        });
    } else {
      infoData.error = this.agregarError(
        infoData.error,
        ERROR_EXPEDIENTE(infoData.dataRow.expediente)
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta

      if (opcionValid == 'general') {
        if (this.proceso == 1) {
          this.processUploadEndGeneral(infoData); // Se termina el proceso ya que no se encuentra identificador
        } else {
          this.createGood(infoData, opcionValid, 1); // Crear bien
        }
      } else {
        this.validStatusColumnaPRE(infoData, opcionValid);
      }
    }
  }

  async createGood(
    infoData: IValidInfoData,
    opcionValid: string = 'sat',
    good1: number = 0 // SE PASA 1 CUANDO ES PARA GENERAL y proceso 1
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress = 'Creando el bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let dataGood: any;
    let messageExtra = '';
    if (opcionValid == 'general') {
      if (this.proceso == 2) {
        // PROCESO 2
        console.log(infoData);
        dataGood = {
          id: '', // ID
          fileNumber: infoData.dataRow.expediente, // NO_EXPEDIENTE
          description: infoData.dataRow.descripcion, // Descripcion
          quantity: infoData.dataRow.cantidad, // Cantidad
          status: infoData.dataRow.status, // Status
          identifier: infoData.dataRow.identificador, // Identificador
          goodClassNumber: infoData.dataRow.clasif, // Numero de clasificacion del bien
          val50: infoData.dataRow.nobienmenaje, // Numero de Menaje
          subDelegationNumber: infoData.objInsertResponse['vNO_SUBDELEGACION'], // Sub delegacion
          delegationNumber: infoData.objInsertResponse['vNO_DELEGACION'], // Delegacion
          labelNumber: infoData.objInsertResponse['vno_etiqueta'], // Numero de etiqueta
          flyerNumber: infoData.objInsertResponse['lnu_no_volante'], // Número de volante
          unit: infoData.dataRow.unidad, // Unidad
        };
      } else {
        // PROCESO 1
        console.log(infoData);
        dataGood = {
          id: '', // ID
          fileNumber: infoData.dataRow.expediente, // NO_EXPEDIENTE
          description: infoData.dataRow.descripcion, // Descripcion
          quantity: infoData.dataRow.cantidad, // Cantidad
          unit: infoData.dataRow.unidad, // Unidad
          status: infoData.dataRow.status, // Status
          identifier: infoData.dataRow.identificador, // Identificador
          goodClassNumber: infoData.dataRow.clasif, // Numero de clasificacion del bien
          val1: infoData.dataRow['numero de placas'], // Valor 1
          val2: infoData.dataRow['serie'], // Valor 2
          subDelegationNumber: infoData.dataRow.subDele, // Sub delegacion
        };
      }
    } else {
      dataGood = {
        id: '', // ID
        // satUniqueKey: '', // SAT_CVE_UNICA
        siabiInventoryId:
          opcionValid != FGR_OPCION
            ? infoData.dataRow['sat_cve_unica']
            : infoData.dataRow['fgr_no_bien'], // SIAB_INVENTORY ES PGR_NO_BIEN
        inventoryNumber:
          opcionValid != FGR_OPCION
            ? infoData.dataRow['sat_cve_unica']
            : infoData.dataRow['fgr_no_bien'], // NUMERO DE INVENTARIO
        // associatedFileNumber: this.paramsGeneral.p_no_expediente, // NO_EXPEDIENTE ---- SE CAMBIO POR ESTE CAMPO EL DATOS DEL EXPEDIENTE YA QUE CON EL OTRO MANDA ERROR EL MS
        fileNumber: this.paramsGeneral.p_no_expediente, // NO_EXPEDIENTE
        description: infoData.dataRow.descripcion, // Descripcion
        quantity: infoData.dataRow.cantidad, // Cantidad
        unit: infoData.dataRow.unidad, // Unidad
        status: infoData.dataRow.status, // Status
        identifier: infoData.dataRow.identificador, // Identificador
        goodClassNumber: infoData.dataRow.clasif, // Numero de clasificacion del bien
        subDelegationNumber: this.userSubdelegation, //infoData.objInsertResponse['vNO_SUBDELEGACION'], // Sub delegacion --- TOOLBAR DATA
        delegationNumber: this.userDelegation, //infoData.objInsertResponse['vNO_DELEGACION'], // Delegacion --- TOOLBAR DATA
        labelNumber: infoData.objInsertResponse['vno_etiqueta'], // Numero de etiqueta
        flyerNumber: this.paramsGeneral.p_no_volante, // No volante
        observations: infoData.dataRow.observaciones, // Observaciones
      };
      // Lenar la data de los valores para el bien
      let contadorCol = 10;
      for (let index = 10; index < 44; index++) {
        console.log(infoData.dataRow['COL' + contadorCol]);
        dataGood['val' + index] = infoData.dataRow['col' + contadorCol];
        contadorCol++;
      }
      if (!dataGood.siabiInventoryId) {
        messageExtra =
          messageExtra + ' -Error al obtener el dato SIAB_INVENTORY.';
      }
      if (!dataGood.inventoryNumber) {
        messageExtra =
          messageExtra + ' -Error al obtener el dato Número de Inventario.';
      }
      if (!dataGood.labelNumber) {
        messageExtra =
          messageExtra + ' -Error al obtener el Número de Etiqueta.';
      }
    }
    console.log('DATA_GOOD', dataGood, infoData.dataRow);
    this.pgrGoodNumber = '';
    // this.processUploadEndPgr(infoData); // Termina proceso
    // Crear el bien
    await this.goodsBulkService.createGood(dataGood).subscribe({
      next: res => {
        console.log(res);
        infoData.objInsertResponse['LNU_NO_BIEN'] = res.id;
        this.pgrGoodNumber = res.id;
        infoData.validLastRequest = true; // Respuesta correcta
        infoData = this.createdGoodsWheelsExpedients(
          res.idGood,
          'bienes',
          infoData
        ); // Guardar bien insertado
        this.createMassiveChargeGood(infoData, opcionValid); // Crear registro carga masiva
      },
      error: err => {
        console.log(err);
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el bien. ' + err.error.message + ' ' + messageExtra
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        if (opcionValid == FGR_OPCION) {
          this.processUploadEndPgr(infoData); // Termina proceso
        } else if (opcionValid == 'general') {
          this.processUploadEndGeneral(infoData); // Terminar proceso
        } else {
          this.processUploadEndSat(infoData); // Termina proceso
        }
      },
    });
  }

  async setGoodDataUpload(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Actualizando el registro del bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let dataGood: any = {
      idGood: infoData.dataRow['no bien'], // NO bien
      description: infoData.dataRow.descripcion, // Descripcion
      quantity: infoData.dataRow.cantidad, // Cantidad
      unit: infoData.dataRow.unidad, // Unidad
      status: infoData.dataRow.status, // Status
      identifier: infoData.dataRow.identificador, // Identificador
      goodClassNumber: infoData.dataRow.clasificador, // Numero de clasificacion del bien
      labelNumber: infoData.objInsertResponse['vno_etiqueta'], // Numero de etiqueta
    };
    // Actualizar el bien
    await this.goodsBulkService.createGood(dataGood).subscribe({
      next: res => {
        console.log(res);
        infoData.objInsertResponse['LNU_NO_BIEN'] = res.id;
        infoData.validLastRequest = true; // Respuesta correcta
        this.processUploadEndGeneral(infoData); // Termina proceso 3 para actualizacion
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el bien'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        this.processUploadEndGeneral(infoData); // Termina proceso 3 para actualizacion
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
    let massiveGoodData: any = {};
    let messageExtra = '';
    if (this.proceso == 2) {
      massiveGoodData = {
        id: this.assetsForm.get('idCarga').value, // Id de la carga masiva
        goodNumber: infoData.objInsertResponse['LNU_NO_BIEN'], // Numero de bien
        // associatedFileNumber: infoData.dataRow.expediente, // Numero de expediente ---- SE CAMBIO POR ESTE CAMPO EL DATOS DEL EXPEDIENTE YA QUE CON EL OTRO MANDA ERROR EL MS
        fileNumber: infoData.dataRow.expediente, // Numero de expediente
        flyerNumber: infoData.objInsertResponse['lnu_no_volante'], // Número de volante
        user: this.userId.toUpperCase(), //'USER', // USER para que el back indique el valor
        massiveChargeDate: new Date(), // Fecha y hora actual
        daydayEviction: this.assetsForm.get('desalojo').value ? 1 : 0, //  Desalojo dia a dia
      };
    } else {
      massiveGoodData = {
        id: infoData.dataRow.tipovolante
          ? infoData.dataRow.identificador
          : infoData.objInsertResponse.identificador, // Identificador -- this.assetsForm.get('idCarga').value, // Id de la carga masiva
        goodNumber: infoData.objInsertResponse['LNU_NO_BIEN'], // Numero de bien
        // associatedFileNumber: infoData.dataRow.expediente, // Numero de expediente ---- SE CAMBIO POR ESTE CAMPO EL DATOS DEL EXPEDIENTE YA QUE CON EL OTRO MANDA ERROR EL MS
        fileNumber: this.paramsGeneral.p_no_expediente, // Numero de expediente
        flyerNumber: this.paramsGeneral.p_no_volante, // Numero de volante
        user: this.userId.toUpperCase(), //'USER', // USER para que el back indique el valor
        massiveChargeDate: new Date(), // Fecha y hora actual
        daydayEviction: this.assetsForm.get('desalojo').value ? 1 : 0, //  Desalojo dia a dia
      };
      if (!massiveGoodData.goodNumber) {
        messageExtra = messageExtra + ' -Error al obtener el Número de Bien.';
      }
      if (!massiveGoodData.associatedFileNumber) {
        messageExtra =
          messageExtra + ' -Error al obtener el Número de Expediente.';
      }
    }
    console.log('Massive', massiveGoodData);
    // Crear el bien
    await this.goodsBulkService.createMassiveGood(massiveGoodData).subscribe({
      next: res => {
        console.log(res);
        infoData.validLastRequest = true; // Respuesta correcta
        this.createHistoryGood(infoData, opcionValid); // Crear registro carga masiva
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el registro de la carga masiva. ' +
            err.error.message +
            ' ' +
            messageExtra
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
    } else if (opcionValid == FGR_OPCION) {
      this.idPantalla = 'FMASINSUPDBIENES_PGRSAE';
    } else if (opcionValid == 'general') {
      this.idPantalla = 'FMASINSUPDBIENES';
    }
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Creando registro en histórico del bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let goodHistory: IHistoryGood = {
      propertyNum: parseInt(infoData.objInsertResponse['LNU_NO_BIEN']), // Numero de bien
      status: 'ROP', // Estatus
      changeDate: new Date(), // Fecha
      userChange: this.userId.toUpperCase(), //'USER', // USER se indica el usuario
      statusChangeProgram: this.idPantalla, // Clave de la pantalla
      reasonForChange: 'Automatico masivo', // Razon del cambio
      registryNum: 1, // No se toma en el ms
      extDomProcess: '', // No se toma en el ms
    };
    let messageExtra = '';
    if (!goodHistory.propertyNum) {
      messageExtra = messageExtra + ' -Error al obtener el Número de Bien.';
    }
    console.log('HISTORICO', goodHistory);
    // Crear el historico del bien
    await this.goodsBulkService.createHistoryGood(goodHistory).subscribe({
      next: res => {
        console.log(res);
        infoData.validLastRequest = true; // Respuesta correcta
        if (opcionValid == 'general') {
          if (this.proceso == 2) {
            this.createMenaje(infoData, opcionValid); // Crear menaje y terminar flujo proceso 2 general
          } else {
            this.processUploadEndGeneral(infoData); //  Fin de proceso 2 para general
          }
        } else {
          if (opcionValid == FGR_OPCION) {
            this.updatePGRTransferencia(infoData, opcionValid); // Actualizar PGR Transferencia
          } else {
            this.updateSatTransferencia(infoData, opcionValid); // Crear registro carga masiva
          }
        }
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el historico del bien.' +
            err.error.message +
            ' ' +
            messageExtra
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        if (opcionValid == 'general') {
          this.processUploadEndGeneral(infoData); //  Fin de proceso para general
        } else {
          if (opcionValid == FGR_OPCION) {
            this.updatePGRTransferencia(infoData, opcionValid); // Actualizar PGR Transferencia
          } else {
            this.updateSatTransferencia(infoData, opcionValid); // Crear bien
          }
        }
      },
    });
  }

  // INCIDENCIA 611 --- RESUELTA
  async updatePGRTransferencia(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    let cve =
      opcionValid != FGR_OPCION
        ? infoData.dataRow['sat_cve_unica']
        : infoData.dataRow['fgr_no_bien'];
    // this.processUploadEndPgr(infoData);
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('pgrOffice', this.paramsGeneral.p_av_previa);
    params.addFilter('pgrGoodNumber', cve); // SET pgrGoodNumber from filter data
    this.goodsBulkService
      .getDataPGRFromParams(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log('UPDATE PGR DATA', res);

          let dataUpload: IPgrTransfer = res.data[0];
          // this.pgrData[infoData.contadorRegistro];
          dataUpload.saeNoGood = infoData.objInsertResponse['LNU_NO_BIEN']; // Set data
          console.log('UPDATE PGR DATA', dataUpload);
          try {
            this.goodsBulkService.updateDataPGR(dataUpload).subscribe({
              next: res => {
                console.log(res);
                this.processUploadEndPgr(infoData); //  Fin de proceso
              },
              error: err => {
                console.log(err);
                infoData.error = this.agregarErrorUploadValidation(
                  infoData.error,
                  'Error en el servidor al actualizar FGR Transferencia. ' +
                    ' Con el Oficio: ' +
                    this.paramsGeneral.p_av_previa +
                    ' y el Número de Bien: ' +
                    cve +
                    err.error.message
                );
                this.infoDataValidation.error = infoData.error; // Setear error
                infoData.validLastRequest = false; // Respuesta incorrecta
                this.processUploadEndPgr(infoData); //  Fin de proceso
              },
            });
          } catch (error) {
            console.log(error);
            infoData.error = this.agregarErrorUploadValidation(
              infoData.error,
              'Error en el servidor al actualizar FGR Transferencia. ' +
                ' Con el Oficio: ' +
                this.paramsGeneral.p_av_previa +
                ' y el Número de Bien: ' +
                cve +
                error
            );
            this.infoDataValidation.error = infoData.error; // Setear error
            infoData.validLastRequest = false; // Respuesta incorrecta
            this.processUploadEndPgr(infoData); //  Fin de proceso
          }
        },
        error: err => {
          console.log(err);
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            'Error al obtener la información de FGR Transferencia. ' +
              ' Con el Oficio: ' +
              this.paramsGeneral.p_av_previa +
              ' y el Número de Bien: ' +
              cve +
              err.error.message
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.processUploadEndPgr(infoData); //  Fin de proceso
        },
      });
  }

  async createMenaje(infoData: IValidInfoData, opcionValid: string = 'sat') {
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Creando registro de menaje.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    let menaje: IMenageWrite = {
      noGood: infoData.objInsertResponse['LNU_NO_BIEN'], // Numero de bien
      noGoodMenaje: infoData.dataRow.nobienmenaje, // Numero de Menaje
      noRegister: null, // registro
    };
    // Crear menaje
    await this.goodsBulkService.createMenaje(menaje).subscribe({
      next: res => {
        console.log(res);
        infoData.validLastRequest = true; // Respuesta correcta
        infoData = this.createdGoodsWheelsExpedients(
          infoData.dataRow.nobienmenaje,
          'menajes',
          infoData
        ); // Guardar bien insertado
        this.processUploadEndGeneral(infoData); //  Fin de proceso 2 para general
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el registro de menaje'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        this.processUploadEndGeneral(infoData); //  Fin de proceso 2 para general
      },
    });
  }

  async updateSatTransferencia(
    infoData: IValidInfoData,
    opcionValid: string = 'sat'
  ) {
    let cve =
      opcionValid != FGR_OPCION
        ? infoData.dataRow['sat_cve_unica']
          ? infoData.dataRow['sat_cve_unica']
          : infoData.objInsertResponse['SAT_CVE_UNICA']
        : infoData.dataRow['fgr_no_bien']
        ? infoData.dataRow['fgr_no_bien']
        : infoData.objInsertResponse['FGR_NO_BIEN'];
    // --************** ACTUALIZACION DE TABLA DE REGISTROS DEL SAT CON EL NO DE BIEN**-----------
    // Mensaje de proceso de validación actual
    this.DeclarationsValidationMassive.message_progress =
      'Actualización de tabla de registros del SAT con el número de bien.';
    console.log(this.DeclarationsValidationMassive.message_progress);
    // Crear el historico del bien
    await this.goodsBulkService.getSatTransferencia(cve).subscribe({
      next: async res => {
        console.log(res);
        infoData.validLastRequest = true; // Respuesta correcta
        let dataUpdate: ISatTransfer = res;
        if (opcionValid == 'sat') {
          dataUpdate.saeGoodNumber = infoData.objInsertResponse['LNU_NO_BIEN'];
          dataUpdate.saeStatusShipping = 'G'; // Cambiar el estatus del envio
        } else if (FGR_OPCION) {
          dataUpdate.saeGoodNumber = infoData.objInsertResponse['LNU_NO_BIEN'];
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
                } else if (opcionValid == FGR_OPCION) {
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
                } else if (opcionValid == FGR_OPCION) {
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
          } else if (opcionValid == FGR_OPCION) {
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
          this.setGoodMassive(infoData);
        },
        error: err => {
          infoData.error = this.agregarError(
            infoData.error,
            ERROR_ATRIBUTE_CLASS_GOOD(infoData.dataRow.clasif)
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          this.setGoodMassive(infoData);
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

  async setGoodMassive(infoData: IValidInfoData, opcionValid: string = 'sat') {
    let valData: any;
    for (let index = 0; index < 50; index++) {
      if (infoData.dataRow) {
        valData['VAL' + index + 1] = infoData.dataRow;
      } else {
        valData['VAL' + index + 1] = null;
        infoData.error = this.agregarError(
          infoData.error,
          'No fue posible obtener el campo: ' +
            ['VAL' + index + 1] +
            ' para actualizar el bien'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
      }
    }

    // Actualizar los datos del bien
    await this.goodsBulkService
      .updateGood(infoData.objInsertResponse['LNU_NO_BIEN'], valData)
      .subscribe({
        next: res => {
          console.log(res);
          if (opcionValid == 'sat') {
            this.processUploadEndSat(infoData); // Terminar proceso SAT
          } else if (opcionValid == FGR_OPCION) {
            this.processUploadEndPgr(infoData); // Terminar proceso PGR
          }
        },
        error: err => {
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            'Error al actualizar el bien: ' +
              infoData.objInsertResponse['LNU_NO_BIEN']
          );
          this.infoDataValidation.error = infoData.error; // Setear error
          infoData.validLastRequest = false; // Respuesta incorrecta
          if (opcionValid == 'sat') {
            this.processUploadEndSat(infoData); // Terminar proceso SAT
          } else if (opcionValid == FGR_OPCION) {
            this.processUploadEndPgr(infoData); // Terminar proceso PGR
          }
        },
      });
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
    if (this.stopProcess) {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        'Se detuvo el proceso por el usuario para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      this.reviewStopProcess();
      return;
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        VALIDATION_UPLOAD_END_MESSAGE;
      // Inicia proceso de upload
      this.procesandoUpload = false;
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        'Se término el proceso de carga de datos para el registro: "' +
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
    if (this.stopProcess) {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        'Se detuvo el proceso por el usuario para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      this.reviewStopProcess();
      return;
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        VALIDATION_UPLOAD_END_MESSAGE;
      // TERMINA PROCESO FGR
      this.procesandoUpload = false;
      this.globalVarsService.updateSingleGlobal('gCommit', 'S', this.globals);
      // Validar si se creo el expediente
      if (infoData.dataRow.expediente) {
        this.globalVarsService.updateSingleGlobal(
          'gOFFCommit',
          null,
          this.globals
        );
      } else {
        this.globalVarsService.updateSingleGlobal(
          'gOFFCommit',
          null,
          this.globals
        );
      }
      this.validarPGRMenaje(); // VALIDAR MENAJE
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        'Se término el proceso de carga de datos para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      // Fin del proceso para validar la carga PGR
      this.validDataUploadPGR(
        infoData.contadorRegistro + 1,
        this.tableSource[infoData.contadorRegistro + 1]
      ); // CONTINUAR PROCESO
    }
  }

  processUploadEndGeneral(infoData: IValidInfoData) {
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
    if (this.stopProcess) {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        'Se detuvo el proceso por el usuario para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      this.reviewStopProcess();
      return;
    }
    if (this.tableSource.length == infoData.contadorRegistro + 1) {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        VALIDATION_UPLOAD_END_MESSAGE;
      // Inicia proceso de upload
      this.procesandoUpload = false;
    } else {
      // Mensaje de proceso de validación actual
      this.DeclarationsUploadValidationMassive.message_progress =
        'Se término el proceso de carga de datos para el registro: "' +
        (infoData.contadorRegistro + 1) +
        '".';
      // Fin del proceso para validar la carga GENERAL
      this.validDataUploadGeneral(
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
    this.tableSourceActualUpload = [row]; // Guardar registro en proceso actual
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
        'No se encontró el Asunto SAT en los parámetros'
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
    // Total de registros
    this.DeclarationsUploadValidationMassive.common_general.total =
      this.tableSource.length;
    // Inicia proceso de validación para carga
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPLOAD_START_MESSAGE;
    this.DeclarationsUploadValidationMassive.common_general.proceso =
      this.assetsForm.get('actionType').value;
    // Inicia proceso de upload
    this.procesandoUpload = true;
    this.validDataUploadSAT(0, this.tableSource[0]);
  }

  /**
   * Validar el proceso de carga masiva PGR para subir los datos
   */
  validDataUploadPGR(count: number = 0, row: any) {
    // this.assetsForm.get('idCarga').setValue('ASEG');
    // this.assetsForm.get('idCarga').updateValueAndValidity();
    // Mensaje de proceso de validación actual
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPDATE_PROCESS_MESSAGE(count + 1);
    this.tableSourceActualUpload = [row]; // Guardar registro en proceso actual
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
        identificador: null,
      },
      validLastRequest: false,
    };
    if (this.proceso == 4) {
      // BUSCAR CLAVE UNICA
      if (this.infoDataValidation.dataRow.tipovolante) {
        // COL1 IS NOT NULL
        this.searchCityByAsuntoSat(this.infoDataValidation, FGR_OPCION);
      } else {
        // COL1 IS NULL
        this.getTagXClassif(this.infoDataValidation, FGR_OPCION);
      }
      // this.searchSatUniqueKey(this.infoDataValidation, FGR_OPCION); // Buscar clave sat
    } else {
      // COMMIT SILECIOSO PARA ACTUALIZAR LOS BIENES DE CARGA MASIVA CON EL USUARIO
      this.processUploadEndPgr(this.infoDataValidation);
    }
  }

  /**
   * Validar los registros a subir al sistema antes de cargar la información
   */
  async validDataUploadMassivePgr() {
    this.blockErrors(true); // OCULTAR MENSAJES DEL INTERCEPTOR
    this.startVariables(true);
    // Total de registros
    this.DeclarationsUploadValidationMassive.common_general.total =
      this.tableSource.length;
    // Inicia proceso de validación para carga
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPLOAD_START_MESSAGE;
    this.DeclarationsUploadValidationMassive.common_general.proceso =
      this.assetsForm.get('actionType').value;
    // Inicia proceso de upload
    this.procesandoUpload = true;
    this.validDataUploadPGR(0, this.tableSource[0]);
  }

  /**
   * Validar el proceso de carga masiva GENERAL para subir los datos
   */
  validDataUploadGeneral(count: number = 0, row: any) {
    // Mensaje de proceso de validación actual
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPDATE_PROCESS_MESSAGE(count + 1);
    this.tableSourceActualUpload = [row]; // Guardar registro en proceso actual
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
        T_identificador: this.assetsForm.get('idCarga').value,
        no_ciudad: null,
        otclave_federative_entity: null,
        name_institution: '',
        no_emisora: null,
        no_autoridad: null,
        manualvar_no_transferente: '120',
      },
      validLastRequest: false,
    };
    console.log(this.infoDataValidation, this.proceso);
    // Llenar campo de valid estatus
    if (
      (this.proceso == 1 && this.infoDataValidation.dataRow.status != 'ROP') ||
      (this.proceso == 2 && this.infoDataValidation.dataRow.status != 'ROP') ||
      (this.proceso == 4 && this.infoDataValidation.dataRow.status != 'ROP')
    ) {
      this.infoDataValidation.dataRow['valida_status'] = 0;
    } else if (this.infoDataValidation.dataRow.estatus) {
      if (
        this.proceso == 3 &&
        this.infoDataValidation.dataRow.estatus != 'ROP'
      ) {
        this.infoDataValidation.validLastRequest = true;
      } else {
        this.infoDataValidation.objInsertResponse['valida_status'] = 1;
      }
    } else {
      this.infoDataValidation.objInsertResponse['valida_status'] = 1;
    }
    // EXISTE ASUNTO SAT
    if (this.proceso == 2) {
      if (this.infoDataValidation.objInsertResponse['valida_status'] == 1) {
        this.getGoodById(this.infoDataValidation, 'general');
      } else {
        error = this.agregarError(
          error,
          ERROR_ESTATUS_GENERAL(count + 1, this.proceso)
        );
        this.infoDataValidation.error = this.infoDataValidation.error; // Setear error
        this.infoDataValidation.validLastRequest = false; // Respuesta incorrecta
        this.processUploadEndGeneral(this.infoDataValidation);
      }
    } else {
      if (this.proceso == 1 || this.proceso == 4) {
        this.getVolanteNotificacion(this.infoDataValidation, 'general'); // Obtener volantes de notificaciones
      } else {
        this.getVolanteNotificacionByNoGood(this.infoDataValidation, 'general'); // Obtener el volante por numero e bien
      }
    }
  }

  /**
   * Validar los registros a subir al sistema antes de cargar la información
   */
  async validDataUploadMassiveGeneral() {
    this.startVariables(true);
    console.log(this.DeclarationsUploadValidationMassive);
    // Total de registros
    this.DeclarationsUploadValidationMassive.common_general.total =
      this.tableSource.length;
    // Inicia proceso de validación para carga
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPLOAD_START_MESSAGE;
    this.DeclarationsUploadValidationMassive.common_general.proceso =
      this.assetsForm.get('actionType').value;
    // Inicia proceso de upload
    this.procesandoUpload = true;
    this.validDataUploadGeneral(0, this.tableSource[0]);
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

  createdGoodsWheelsExpedients(
    value: string,
    tipoContador: string,
    data?: IValidInfoData
  ) {
    if (tipoContador == 'bienes') {
      // Agregar contador de bienes
      this.DeclarationsUploadValidationMassive.common_general.bienes++;
      data.objInsertResponse['bien'] = value;
    } else if (tipoContador == 'volantes') {
      // Agregar contador de volantes
      this.DeclarationsUploadValidationMassive.common_general.volantes++;
      data.objInsertResponse['volante'] = value;
    } else if (tipoContador == 'expedientes') {
      // Agregar contador de expedientes
      this.DeclarationsUploadValidationMassive.common_general.expedientes++;
      data.objInsertResponse['expediente'] = value;
    } else if (tipoContador == 'menajes') {
      // Agregar contador de menajes
      this.DeclarationsUploadValidationMassive.common_general.menajes++;
      data.objInsertResponse['menajes'] = value;
    }
    return data;
  }

  validarPGRMenaje() {
    const params = new FilterParams();
    params.removeAllFilters();
    let oficio = encodeURIComponent(this.paramsGeneral.p_av_previa);
    params.addFilter('officeExternalKey', oficio);
    this.goodsBulkService
      .getDataPGRFromParams(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log('DATA MENAJE', res);
          let validCreateMenaje = false;
          res.data.forEach(element => {
            if (element.pgrInmcontMenage) {
              if (element.pgrInmcontMenage.toUpperCase()[0] == 'S') {
                validCreateMenaje = true;
              }
            }
          });
          if (validCreateMenaje) {
            this.alertInfo(
              'info',
              'Actualización de menaje',
              'Es un bien inmueble con Menaje, se van a asociar los bienes hijos al bien padre'
            ).then(() => {
              this.createMenajePGR(res.data, 0);
            });
          } else {
            // this.getDataVolanteTemp();
            this.endProcess = true;
          }
        },
        error: err => {
          this.endProcess = true;
          this.onLoadToast(
            'warning',
            'Actualización de menaje',
            'Ocurrió un error al cargar la información de los bienes para actualizar el Menaje'
          );
        },
      });
  }

  async createMenajePGR(dataResponse: IPgrTransfer[], count: number) {
    let menaje: IMenageWrite = {
      noGood: this.pgrGoodNumber, // Numero de bien
      noGoodMenaje: dataResponse[count].pgrInmcontMenage, // Numero de Menaje
      noRegister: null, // registro
    };
    // Crear menaje
    await this.goodsBulkService.createMenaje(menaje).subscribe({
      next: res => {
        console.log(res);
        if (dataResponse.length == count + 1) {
          // TERMINO PGR
          // this.getDataVolanteTemp();
          this.endProcess = true;
        } else {
          count++;
          this.createMenajePGR(res.data, count);
        }
      },
      error: err => {
        this.endProcess = true;
        console.log(err);
        if (dataResponse.length == count + 1) {
          // TERMINO PGR
          // this.getDataVolanteTemp();
          this.endProcess = true;
        }
        this.onLoadToast(
          'warning',
          'Actualización de menaje',
          'Ocurrió un error al cargar la información del Menaje'
        );
      },
    });
  }

  /**
   * Obtener información de la tabla temporal de volantes
   */

  getDataVolanteTemp(onlyCreate: boolean = false) {
    const params = new FilterParams();
    params.removeAllFilters();
    let volante = encodeURIComponent(this.paramsGeneral.p_no_volante);
    params.addFilter('wheelNumber', volante);
    this.goodsBulkService
      .getDataPgrNotificationByFilter(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log('DATA VOLANTE TEMPORAL', res);
          this.getDataVolante(res.data[0]);
        },
        error: err => {
          if (onlyCreate == false) {
            this.endProcess = true;
          } else {
            this.onLoadToast(
              'warning',
              'Información del Volante Temporal',
              'Ocurrió un error al cargar la información del Volante Temporal'
            );
          }
          console.log(err);
        },
      });
  }

  getDataVolante(volanteData: INotification, onlyCreate: boolean = false) {
    const params = new FilterParams();
    params.removeAllFilters();
    let volante = encodeURIComponent(this.paramsGeneral.p_no_volante);
    params.addFilter('wheelNumber', volante);
    this.goodsBulkService
      .getPgrNotificationByFilter(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log('DATA VOLANTE PRINCIPAL', res);
          if (onlyCreate == false) {
            this.endProcess = true;
            // let main = document.documentElement.querySelector('.fin-proceso');
            // main.scroll(0, 0);
          } else {
            // this.validDataUploadMassivePgr(); // Comenzar la cargar de la información
          }
          this.alertInfo(
            'info',
            'Datos del Volante',
            'Ya existe un registro del Volante. Se va a actualizar el registro para el Volante: ' +
              this.paramsGeneral.p_no_volante
          ).then(() => {
            this.createDataVolante(volanteData, onlyCreate, true);
          });
          // this.validDataUploadMassivePgr(); // Comenzar la cargar de la información
          // this.getTempPgrExpedientByFilter(onlyCreate); // Get Temp expedient
        },
        error: err => {
          console.log(err);
          if (err.status == 400) {
            console.log('SIN RESULTADOS', volanteData);
            this.createDataVolante(volanteData, onlyCreate);
          } else {
            if (onlyCreate == false) {
              this.endProcess = true;
            } else {
              this.onLoadToast(
                'warning',
                'Información del Volante',
                'Ocurrio un error al cargar la información del Volante. Intenta nuevamente'
              );
            }
          }
        },
      });
  }

  createDataVolante(
    body: INotification,
    onlyCreate: boolean = false,
    update: boolean = false
  ) {
    let numberInstitucion: any = body.institutionNumber;
    let institution: any = numberInstitucion.id
      ? numberInstitucion.id
      : numberInstitucion;
    let minpubNumber =
      typeof body.minpubNumber == 'number'
        ? body.minpubNumber
        : body.minpubNumber
        ? body.minpubNumber.id
        : body.minpubNumber;
    let bodyData = {
      wheelNumber: body.wheelNumber,
      receiptDate: body.receiptDate,
      captureDate: body.captureDate,
      officeExternalKey: body.officeExternalKey,
      externalOfficeDate: body.externalOfficeDate,
      externalRemitter: body.externalRemitter,
      protectionKey: body.protectionKey,
      touchPenaltyKey: body.touchPenaltyKey,
      circumstantialRecord: body.circumstantialRecord,
      preliminaryInquiry: body.preliminaryInquiry,
      criminalCase: body.criminalCase,
      addressee: body.addressee,
      expedientNumber: body.expedientNumber,
      crimeKey: body.crimeKey,
      affairKey: body.affairKey,
      entFedKey: body.entFedKey,
      viaKey: body.viaKey,
      consecutiveNumber: body.consecutiveNumber,
      observations: body.observations,
      delegationNumber: body.delegationNumber,
      subDelegationNumber: body.subDelegationNumber,
      institutionNumber: institution,
      indiciadoNumber: body.indiciadoNumber,
      delDestinyNumber: body.delDestinyNumber,
      subDelDestinyNumber: body.subDelDestinyNumber,
      departamentDestinyNumber: body.departamentDestinyNumber,
      officeNumber: body.officeNumber,
      minpubNumber: minpubNumber,
      cityNumber: body.cityNumber,
      courtNumber: body.courtNumber,
      registerNumber: body.registerNumber,
      dictumKey: body.dictumKey,
      identifier: body.identifier,
      observationDictum: body.observationDictum,
      wheelStatus: body.wheelStatus,
      transference: body.transference,
      expedientTransferenceNumber: body.expedientTransferenceNumber,
      priority: body.priority,
      wheelType: body.wheelType,
      reserved: body.reserved,
      entryProcedureDate: body.entryProcedureDate,
      userInsert: body.userInsert,
      originNumber: body.originNumber,
      stationNumber: body.stationNumber,
      autorityNumber: body.autorityNumber,
      endTransferNumber: body.endTransferNumber,
      dailyEviction: body.dailyEviction,
      hcCaptureDate: body.hcCaptureDate,
      hcEntryProcedureDate: body.hcEntryProcedureDate,
      desKnowingDate: body.desKnowingDate,
      addressGeneral: body.addressGeneral,
    };
    console.log('DATA VOLANTE CREATE', bodyData);
    if (update) {
      this.goodsBulkService.updatePgrNotification(bodyData).subscribe({
        next: res => {
          console.log('DATA VOLANTE UPDATE', res);
          this.paramsGeneral.p_no_volante = bodyData.wheelNumber.toString();
          this.alertInfo(
            'info',
            'Datos del Volante',
            'Se actualizó correctamente el Volante: ' +
              this.paramsGeneral.p_no_volante
          ).then(() => {
            this.validDataUploadMassivePgr(); // Comenzar la cargar de la información
          });
          // mensaje update volante
        },
        error: err => {
          console.log(err);
          if (onlyCreate == false) {
            // this.getTempPgrExpedientByFilter(onlyCreate);
          } else {
            this.onLoadToast(
              'warning',
              'Información del Volante Temporal',
              'Ocurrió un error al CREAR el Volante con la información del Volante Temporal.' +
                err.error.message
            );
          }
        },
      });
    } else {
      this.goodsBulkService.createPgrNotification(bodyData).subscribe({
        next: res => {
          console.log('DATA VOLANTE CREATE', res);
          this.paramsGeneral.p_no_volante = res.wheelNumber.toString();
          // if (onlyCreate == false && this.DeclarationsUploadValidationMassive) {
          //   // Agregar contador de volantes
          //   this.DeclarationsUploadValidationMassive.common_general.volantes++;
          //   this.getTempPgrExpedientByFilter(onlyCreate);
          // } else {
          //   this.wheelCount++;
          // }
          // this.getTempPgrExpedientByFilter(onlyCreate);
          this.wheelCount++;
          this.alertInfo(
            'info',
            'Datos del Volante',
            'Se creó correctamente el Volante: ' +
              this.paramsGeneral.p_no_volante
          ).then(() => {
            this.validDataUploadMassivePgr(); // Comenzar la cargar de la información
          });
        },
        error: err => {
          console.log(err);
          if (onlyCreate == false) {
            // this.getTempPgrExpedientByFilter(onlyCreate);
          } else {
            this.onLoadToast(
              'warning',
              'Información del Volante Temporal',
              'Ocurrió un error al CREAR el Volante con la información del Volante Temporal.' +
                err.error.message
            );
          }
        },
      });
    }
  }

  /**
   * Obtener información de la tabla temporal de expedientes
   */

  getTempPgrExpedientByFilter(onlyCreate: boolean = false) {
    let expedient = encodeURIComponent(this.paramsGeneral.p_no_expediente);
    this.goodsBulkService.getTempPgrExpedientByFilter(expedient).subscribe({
      next: res => {
        console.log('DATA EXPEDIENTE', res);
        this.getDataExpediente(res, onlyCreate);
      },
      error: err => {
        this.onLoadToast(
          'warning',
          'Información del Expediente Temporal',
          'Ocurrió un error al cargar la información del Expediente Temporal.'
        );
        console.log(err);
      },
    });
  }

  getDataExpediente(
    expedientData: ITempExpedient,
    onlyCreate: boolean = false
  ) {
    const params = new FilterParams();
    params.removeAllFilters();
    let expedient = encodeURIComponent(this.paramsGeneral.p_no_expediente);
    // params.addFilter('identifier', expedient);
    this.goodsBulkService.getPgrExpedientByFilter(expedient).subscribe({
      next: res => {
        console.log('DATA EXPEDIENTE', res);
        this.alertInfo(
          'info',
          'Datos del Expediente',
          'Ya existe un registro del expediente. Se va a actualizar el registro para el Expediente: ' +
            this.paramsGeneral.p_no_expediente
        ).then(() => {
          this.createDataExpediente(expedientData, onlyCreate, true);
        });
        // this.validDataUploadMassivePgr(); // Comenzar la cargar de la información
        // this.getDataVolanteTemp(onlyCreate); // Get Temp expedient
      },
      error: err => {
        console.log(err);
        if (err.status == 400) {
          console.log('SIN RESULTADOS', expedientData);
          this.createDataExpediente(expedientData, onlyCreate);
        } else {
          if (onlyCreate == false) {
            this.endProcess = true;
          } else {
            this.onLoadToast(
              'warning',
              'Información del Expediente',
              'Ocurrió un error al cargar la información del Expediente, para validar si se creo previamnete. Intenta nuevamente'
            );
          }
        }
      },
    });
  }

  createDataExpediente(
    body: ITempExpedient,
    onlyCreate: boolean = false,
    update: boolean = false
  ) {
    let expedient: IExpedientMassiveFromTmp = {
      id: body.id,
      dateAgreementAssurance: body.agreementSecureDate,
      foresight: body.forecast,
      dateForesight: body.forecastDate,
      articleValidated: body.articleValidated,
      ministerialDate: body.faithMinisterialDate,
      ministerialActOfFaith: body.recordFaithMinisterial,
      date_Dictamines: body.dictamineDate,
      batteryNumber: body.batteryNumber,
      lockerNumber: body.lockerNumber,
      shelfNumber: body.shelfNumber,
      courtNumber: body.courtNumber,
      observationsForecast: body.observationsForecast,
      insertedBy: body.insertedBy,
      observations: body.observations,
      insertMethod: 'CARGA MASIVA VOLANTES',
      insertDate: new Date(), // Fecha,
      receptionDate: body.receptionSeraDate,
      criminalCase: body.causePenal,
      preliminaryInquiry: body.ascertainmentPrevious,
      protectionKey: body.cveProtection,
      crimeKey: body.cveCrime,
      circumstantialRecord: body.recordCircumstanced,
      keyPenalty: body.cvetouchPenal,
      nameInstitution: body.institutionName,
      courtName: body.courtName,
      mpName: body.nameMp,
      keySaveValue: body.cveguardavalor,
      indicatedName: body.nameIndexed,
      authorityOrdersDictum: body.authorityOrderOpinion,
      notificationDate: body.notificationDate,
      notifiedTo: body.notifiedTo,
      placeNotification: body.placeNotification,
      confiscateDictamineDate: body.forfeitureRulingDate, // INCIDENCIA 638 --- RESUELTA
      dictaminationReturnDate: body.returnRulingDate,
      alienationDate: body.alienationDate,
      federalEntityKey: body.cveEntfed,
      dictaminationDate: body.recrevRulingDate,
      registerNumber: body.recordNumber,
      destructionDate: body.destructionDate,
      donationDate: body.donationDate,
      initialAgreementDate: body.agreementInitialDate,
      initialAgreement: body.agreementInitial,
      expedientStatus: body.statusProceedings,
      identifier: body.identifier,
      crimeStatus: body.isCrime,
      transferNumber: body.transfereeNumber,
      expTransferNumber: body.expTransferorsNumber,
      expedientType: 'T',
      stationNumber: body.stationNumber,
      authorityNumber: body.authorityNumber,
      insertionDatehc: body.insertionHcDate,
    };
    console.log(expedient);
    this.goodsBulkService.createExpedient(expedient, update).subscribe({
      next: res => {
        console.log('DATA EXPEDIENTE CREATE UPDATE', res);
        this.paramsGeneral.p_no_expediente = body.id.toString();
        // Agregar contador de expedientes
        // this.DeclarationsUploadValidationMassive.common_general.expedientes++;
        if (update == false) {
          this.fileNumberCount++;
          this.alertInfo(
            'info',
            'Datos del Expediente',
            'Se creó correctamente el Expediente: ' +
              this.paramsGeneral.p_no_expediente
          ).then(() => {
            this.getDataVolanteTemp(onlyCreate); // Get Temp expedient
          });
        } else {
          this.alertInfo(
            'info',
            'Datos del Expediente',
            'Se actualizó correctamente el Expediente: ' +
              this.paramsGeneral.p_no_expediente
          ).then(() => {
            this.getDataVolanteTemp(onlyCreate); // Get Temp expedient
          });
        }
        // this.validDataUploadMassivePgr(); // Comenzar la cargar de la información
      },
      error: err => {
        console.log(err);
        this.onLoadToast(
          'warning',
          'Información del Expediente Temporal',
          'Ocurrió un error al CREAR el Expediente con la información del Expediente Temporal.' +
            err.error.message
        );
      },
    });
  }
}
