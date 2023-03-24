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
import { IPgrTransfer } from 'src/app/core/models/ms-interfacefgr/ms-interfacefgr.interface';
import {
  IMassiveParams,
  ISatTransfer,
} from 'src/app/core/models/ms-interfacesat/ms-interfacesat.interface';
import { IMenageWrite } from 'src/app/core/models/ms-menage/menage.model';
import { INotificationTransferentIndiciadoCityGetData } from 'src/app/core/models/ms-notification/notification.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import {
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
  tableSourceActualPreload: previewData[] = [];
  tableSourceActualUpload: previewData[] = [];
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
  procesandoPreload: Boolean = false;
  procesandoUpload: Boolean = false;
  pgrData: IPgrTransfer[] = [];

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodsBulkService: GoodsBulkLoadService,
    private authService: AuthService,
    private globalVarsService: GlobalVarsService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private LoasFileGoodsBulkService: LoasFileGoodsBulkService
  ) {
    super();
    const _settings = { columns: GOODS_BULK_LOAD_COLUMNS, actions: false };
    this.settings = { ...this.settings, ..._settings };
  }

  ngOnInit(): void {
    this.globalVarsService.loadGlobalVars();
    this.procesandoPreload = false; // Inicializar variables proceso
    this.procesandoUpload = false; // Inicializar variables proceso
    this.prepareForm();
    this.validParameters();
  }

  detenerProceso() {
    this.stopProcess = true;
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
          this.getDataPGRFromParams(); // Obtener PGR data
        }
      } else {
        this.stopProcess = true;
        this.alert(
          'warning',
          'La opción no corresponde a las permitidas.',
          'Revisa los parámetros que se cargaron en la pantalla.'
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
      idCarga: [
        null,
        [Validators.maxLength(300), Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  resetProcess() {
    this.tableSource = [];
    this.listError = [];
    // this.startVariables();
    this.DeclarationsSatSaeMassive = null;
    this.assetsForm.reset();
    this.targetChange();
    this.inicioProceso = false;
    if (this.tipoCarga == 'pgr') {
      this.assetsForm.get('idCarga').setValue('ASEG');
      this.assetsForm.updateValueAndValidity();
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
    this.validParameters();
    if (this.stopProcess) {
      return;
    }
    this.DeclarationsSatSaeMassive = undefined;
    setTimeout(() => {
      console.log(this.DeclarationsSatSaeMassive);
      this.assetsForm.markAllAsTouched();
      if (this.target.value == 'general') {
        if (this.validIdCarga()) {
          // Validar el identificador
          this.goodsBulkService
            .getUploadGoodIdentificador(this.assetsForm.get('idCarga').value)
            .subscribe({
              next: res => {
                console.log(res);
                if (res.data > 0) {
                  // this.reviewConditions();
                  this.alert(
                    'warning',
                    'Opción Carga Masiva',
                    'Ya existe un registro con este identificador.'
                  );
                } else {
                  this.reviewConditions();
                  // if (!res.data) {
                  //   this.alert(
                  //     'warning',
                  //     'Opción Carga Masiva',
                  //     'Ya existe un registro con este identificador.'
                  //   );
                  // }
                }
              },
              error: err => {
                console.log(err);
                this.alert(
                  'warning',
                  'Opción Carga Masiva',
                  'Ocurrio un error al validar el identificador, intentelo nuevamente.'
                );
              },
            });
        }
      } else {
        this.reviewConditions();
      }
    }, 500);
  }

  onFileChange(event: Event) {
    if (this.tipoCarga == 'pgr') {
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
      console.log(preloadFile);
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
            obj[key] = {
              title: key.toLocaleUpperCase(),
              type: 'string',
              sort: false,
            };
          }
        }
      }
      console.log(this.tableSource);
      const _settings = { columns: obj, actions: false };
      this.settings = { ...this.settings, ..._settings };
    } catch (error) {
      this.alert('error', 'Ocurrio un error al leer el archivo', 'Error');
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
      // setTimeout(() => {
      this.DeclarationsUploadValidationMassive.common_general = {
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
    console.log(this.assetsForm.value, this.target.value);
    if (!this.validLoadFile()) {
      return;
    }
    // Inicia proceso de preload
    this.procesandoPreload = true;
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
      // this.onLoadToast('warning', FORM_IDENTIFICATOR_NULL, 'Error');
      this.alert(
        'warning',
        FORM_IDENTIFICATOR_NULL,
        'Ocurrio un error al validar el identificador, intentelo nuevamente.'
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
      if (this.tipoCarga == 'pgr') {
        this.alert(
          'warning',
          'Error al cargar la información de los bienes, revisa los parámetros.',
          'Error'
        );
      } else {
        this.alert('warning', NOT_LOAD_FILE, 'Error');
      }
      return false;
    }
  }

  getDataPGRFromParams() {
    this.assetsForm.get('idCarga').setValue('ASEG');
    this.assetsForm.updateValueAndValidity();
    // this.assetsForm.get('idCarga').disable();
    this.assetsForm.disable();
    this.pgrData = [];
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('pgrOffice', this.paramsGeneral.p_av_previa);
    // Validar el identificador
    this.goodsBulkService
      .getDataPGRFromParams(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log(res);
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            if (element) {
              if (element.pgrTypeGoodNum || element.pgrTypeGoodNum == 0) {
                this.pgrData.push(element);
              }
            }
          }
          // this.pgrData = res.data;
          this.loadDataPgr();
        },
        error: err => {
          console.log(err);
          this.alert(
            'warning',
            'Carga Masiva FGR',
            'Ocurrio un error al cargar la información de los bienes.'
          );
        },
      });
  }

  loadDataPgr() {
    this.tableSource = [];
    for (let index = 0; index < this.pgrData.length; index++) {
      const element = this.pgrData[index];
      if (element) {
        let response = this.LoasFileGoodsBulkService.getFilterDataPgr(element);
        // this.tableSource.push(response);
        let objReplace: any = {};
        for (const key in response) {
          if (Object.prototype.hasOwnProperty.call(response, key)) {
            if (key) {
              objReplace[key.toLowerCase()] = response[key];
            }
          }
          // }
        }
        if (objReplace) {
          this.tableSource.push(objReplace);
        }
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
        console.log(this.tableSource);
        const _settings = { columns: obj, actions: false };
        this.settings = { ...this.settings, ..._settings };
      }
    }
    console.log(this.tableSource);
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
        'Validando la unidad de medida.';
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
      'Validando el Expediente.';
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
      'Validando las Notificaciones de Transferente, Indiciado y Ciudad.';
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
      'Obteneniendo el Transferente por Transferente Autoridad Emisora.';
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
      // Obtener institucion emisora EMISORA Y AUTORIDAD
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
      'Validando el indicador.';
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
      'Validando el Estatus.';
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
      'Validando la clasificación del bien.';
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
      'Validando la unidad de medida de acuerdo a la clasificación del bien.';
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
            if (res.data) {
              const found = res.data.find(
                element => element.unit == infoData.dataRow.unidad
              );
              if (!found.unit) {
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
        this.validDataUploadMassivePgr();
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
    this.validStatusColumnaPRE(this.infoDataValidation, 'pgr');
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
          this.validExpedient(infoData, opcionValid); // Validar expediente
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
            if (this.proceso == 4 && opcionValid == 'general') {
              this.getInstitucionesEmisoras(infoData, opcionValid);
            } else {
              this.getTagXClassif(infoData, opcionValid); // Obtener etiqueta de clasificacion del bien
            }
          }
        },
        error: err => {
          if (err.statusCode == 400 && err.message == 'Data no encontrada') {
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
      insertedBy: 'USER', // USUARIO SETEADO MANUALMENTE
      insertMethod: 'CARGA MASIVA VOLANTES', // TIPO DE CARGA MASIVA
      insertDate: dateNowParse, // FECHA ACTUAL PARA CARGAR
      nameInstitution: infoData.objInsertResponse['LST_NOMBRE_INSTITUCION'], // NOMBRE DE LA INSTITUCION EMISORA
      indicatedName: null, // SE PASA EL VALOR EN NULL
      federalEntityKey: infoData.objInsertResponse['otclave_federative_entity'], // ENTIDAD FEDERATIVA CLAVE
      identifier: infoData.dataRow.identificador, // IDENTIFICADOR
      transferNumber: infoData.dataRow.transferente, // NUMERO DE TRANSFERENTE
      expTransferNumber: infoData.dataRow.expediente, // EXPEDIENTE TRANSFER NUMBER
      expedientType: opcionValid == 'sat' ? 'T' : 'P', // TIPO DE EXPEDIENTE
      authorityNumber: infoData.objInsertResponse['no_autoridad'], // NUMERO DE AUTORIDAD
      stationNumber: infoData.objInsertResponse['no_emisora'], // NUMERO EMISORA
    };
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
          ERROR_CREATE_EXPEDIENT
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
    if (
      !infoData.dataRow.clasif ||
      !infoData.objInsertResponse.manualvar_no_transferente
    ) {
      infoData.error = this.agregarErrorUploadValidation(
        infoData.error,
        'Error al obtener la etiqueta por clasificacion del bien'
      );
      this.infoDataValidation.error = infoData.error; // Setear error
      infoData.validLastRequest = false; // Respuesta incorrecta
      if (opcionValid == 'general') {
        this.validExpedientColumna(infoData, opcionValid); // Expediente
      } else {
        this.createGood(infoData, opcionValid); // Crear bien
      }
    } else {
      let dataTag: ITagXClasif = {
        col6: infoData.dataRow.clasif,
        lnuTransfereeNumber: infoData.objInsertResponse['lnu_TRANSFERENTE']
          ? infoData.objInsertResponse['lnu_TRANSFERENTE']
          : infoData.objInsertResponse.manualvar_no_transferente,
      };
      // Obtener el numero de etiqueta
      await this.goodsBulkService
        .getTagXClasifByCol6Transfer(dataTag)
        .subscribe({
          next: res => {
            console.log(res);
            infoData.objInsertResponse['vno_etiqueta'] = res.vno_etiqueta; // Setear la etiqueta
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
    if (opcionValid == 'general') {
      // if (good1 == 0) {
      //   dataGood = {
      //     id: '', // ID
      //     fileNumber: this.paramsGeneral.p_no_expediente, // NO_EXPEDIENTE
      //     description: infoData.objInsertResponse.descripcion, // Descripcion
      //     quantity: infoData.objInsertResponse.cantidad, // Cantidad
      //     unit: infoData.objInsertResponse.unidad, // Unidad
      //     status: infoData.objInsertResponse.status, // Status
      //     identifier: infoData.objInsertResponse['V_IDEN'], // Identificador
      //     goodClassNumber: infoData.objInsertResponse.clasif, // Numero de clasificacion del bien
      //     subDelegationNumber: infoData.objInsertResponse['vNO_SUBDELEGACION'], // Sub delegacion
      //     delegationNumber: infoData.objInsertResponse['vNO_DELEGACION'], // Delegacion
      //     labelNumber: infoData.objInsertResponse['vno_etiqueta'], // Numero de etiqueta
      //     flyerNumber: this.paramsGeneral.p_no_volante, // No volante
      //     val50: infoData.dataRow.val50, // Valor 50
      //   };
      // } else {
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
        // }
      }
    } else {
      dataGood = {
        id: '', // ID
        // satUniqueKey: '', // SAT_CVE_UNICA
        siabiInventoryId: infoData.objInsertResponse['SAT_CVE_UNICA'], // SIAB_INVENTORY ES PGR_NO_BIEN
        inventoryNumber: infoData.objInsertResponse['SAT_CVE_UNICA'], // NUMERO DE INVENTARIO
        fileNumber: this.paramsGeneral.p_no_expediente, // NO_EXPEDIENTE
        description: infoData.objInsertResponse.descripcion, // Descripcion
        quantity: infoData.objInsertResponse.cantidad, // Cantidad
        unit: infoData.objInsertResponse.unidad, // Unidad
        status: infoData.objInsertResponse.status, // Status
        identifier: infoData.dataRow.tipovolante
          ? infoData.dataRow.identificador
          : infoData.objInsertResponse.identificador, // Identificador
        goodClassNumber: infoData.objInsertResponse.clasif, // Numero de clasificacion del bien
        val1: infoData.dataRow['numero de placas'], // Valor 1
        val2: infoData.dataRow['serie'], // Valor 2
        subDelegationNumber: infoData.objInsertResponse['vNO_SUBDELEGACION'], // Sub delegacion
        delegationNumber: infoData.objInsertResponse['vNO_DELEGACION'], // Delegacion
        labelNumber: infoData.objInsertResponse['vno_etiqueta'], // Numero de etiqueta
        flyerNumber: this.paramsGeneral.p_no_volante, // No volante
        observations: infoData.dataRow.observaciones, // Observaciones
      };
    }
    // Crear el bien
    await this.goodsBulkService.createGood(dataGood).subscribe({
      next: res => {
        console.log(res);
        infoData.objInsertResponse['LNU_NO_BIEN'] = res.idGood;
        infoData.validLastRequest = true; // Respuesta correcta
        infoData = this.createdGoodsWheelsExpedients(
          res.idGood,
          'bienes',
          infoData
        ); // Guardar bien insertado
        this.createMassiveChargeGood(infoData, opcionValid); // Crear registro carga masiva
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el bien'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        if (opcionValid == 'pgr') {
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
        infoData.objInsertResponse['LNU_NO_BIEN'] = res.idGood;
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
    if (this.proceso == 2) {
      massiveGoodData = {
        id: this.assetsForm.get('idCarga').value, // Id de la carga masiva
        goodNumber: infoData.objInsertResponse['LNU_NO_BIEN'], // Numero de bien
        fileNumber: infoData.dataRow.expediente, // Numero de expediente
        flyerNumber: infoData.objInsertResponse['lnu_no_volante'], // Número de volante
        user: 'USER', // USER para que el back indique el valor
        massiveChargeDate: this.datePipe.transform(new Date()), // Fecha y hora actual
        daydayEviction: this.assetsForm.get('idCarga').value ? 1 : 0, //  Desalojo dia a dia
      };
    } else {
      massiveGoodData = {
        id: infoData.dataRow.tipovolante
          ? infoData.dataRow.identificador
          : infoData.objInsertResponse.identificador, // Identificador -- this.assetsForm.get('idCarga').value, // Id de la carga masiva
        goodNumber: infoData.objInsertResponse['LNU_NO_BIEN'], // Numero de bien
        fileNumber: this.paramsGeneral.p_no_expediente, // Numero de expediente
        flyerNumber: this.paramsGeneral.p_no_volante, // Numero de volante
        user: 'USER', // USER para que el back indique el valor
        massiveChargeDate: this.datePipe.transform(new Date()), // Fecha y hora actual
        daydayEviction: this.assetsForm.get('idCarga').value ? 1 : 0, //  Desalojo dia a dia
      };
    }
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
    } else if (opcionValid == 'general') {
      this.idPantalla = 'FMASINSUPDBIENES';
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
        if (opcionValid == 'general') {
          if (this.proceso == 2) {
            this.createMenaje(infoData, opcionValid); // Crear menaje y terminar flujo proceso 2 general
          } else {
            this.processUploadEndGeneral(infoData); //  Fin de proceso 2 para general
          }
        } else {
          if (opcionValid == 'pgr') {
            this.updatePGRTransferencia(infoData, opcionValid); // Actualizar PGR Transferencia
          } else {
            this.updateSatTransferencia(infoData, opcionValid); // Crear registro carga masiva
          }
        }
      },
      error: err => {
        infoData.error = this.agregarErrorUploadValidation(
          infoData.error,
          'Error al crear el historico del bien'
        );
        this.infoDataValidation.error = infoData.error; // Setear error
        infoData.validLastRequest = false; // Respuesta incorrecta
        if (opcionValid == 'general') {
          this.processUploadEndGeneral(infoData); //  Fin de proceso para general
        } else {
          if (opcionValid == 'pgr') {
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
    // this.processUploadEndPgr(infoData);
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('pgrOffice', this.paramsGeneral.p_av_previa);
    params.addFilter('pgrGoodNumber', infoData.dataRow['SAT_CVE_UNICA']); // SET pgrGoodNumber from filter data
    this.goodsBulkService
      .getDataPGRFromParams(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log(res);

          let dataUpload: IPgrTransfer =
            this.pgrData[infoData.contadorRegistro];
          dataUpload.saeNoGood = infoData.objInsertResponse['LNU_NO_BIEN']; // Set data
          this.goodsBulkService
            .updateDataPGR(dataUpload.pgrGoodNumber, dataUpload)
            .subscribe({
              next: res => {
                console.log(res);
                this.processUploadEndPgr(infoData); //  Fin de proceso
              },
              error: err => {
                console.log(err);
              },
            });
        },
        error: err => {
          console.log(err);
          infoData.error = this.agregarErrorUploadValidation(
            infoData.error,
            'Error al actualizar FGR Transferencia'
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
          'Error al crear el registro de la carga masiva'
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
          } else if (opcionValid == 'pgr') {
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
          } else if (opcionValid == 'pgr') {
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
        'Se termino el proceso de carga de datos para el registro: "' +
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
        this.getOTClaveEnt(this.infoDataValidation, 'pgr');
      } else {
        // COL1 IS NULL
        this.getTagXClassif(this.infoDataValidation, 'pgr');
      }
      // this.searchSatUniqueKey(this.infoDataValidation, 'pgr'); // Buscar clave sat
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
    // Inicia proceso de validación para carga
    this.DeclarationsUploadValidationMassive.message_progress =
      VALIDATION_UPLOAD_START_MESSAGE;
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
    data: IValidInfoData
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
}
