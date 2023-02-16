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
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { BasePage } from 'src/app/core/shared/base-page';
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
  ERROR_CLASS_GOOD,
  ERROR_ESTATUS,
  ERROR_EXPORT,
  ERROR_GOOD_INMUEBLE,
  ERROR_IDENTIFICADOR_MENAJE,
  ERROR_TRANSFERENTE,
  ERROR_UNIDAD,
  ERROR_UNITY_CLASS_GOOD,
  FORM_ACTION_TYPE_NULL,
  FORM_ACTION_TYPE_WITH_CHECK_ERROR,
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

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodsBulkService: GoodsBulkLoadService
  ) {
    super();
    const _settings = { columns: GOODS_BULK_LOAD_COLUMNS, actions: false };
    this.settings = { ...this.settings, ..._settings };
  }

  ngOnInit(): void {
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
      preloadFile.forEach((data: any) => {
        let objReplace: any = {};
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (key) {
              objReplace[key.toLowerCase()] = data[key];
            }
          }
        }
        this.tableSource.push(objReplace);
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
  startVariables() {
    this.DeclarationsSatSaeMassive = new DeclarationsSatSaeMassive();
    this.DeclarationsSatSaeMassive.common_general = {
      total_errores: 0,
      valid: false,
      count: 0,
      total: 0,
      proceso: '',
    };
    this.DeclarationsSatSaeMassive.data_error = [];
    this.DeclarationsSatSaeMassive.message_progress = '';
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
      this.validatorPreloadMassive();
    } else if (this.target.value == 'pgr') {
      console.log('PGR');
      this.validatorPreloadMassive();
      // this.validatorPgrMassive();
    } else if (this.target.value == 'general') {
      console.log('GENERAL');
      this.validatorPreloadMassive();
      // this.validatorGeneralMassive();
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
      if (
        GOODS_BULK_LOAD_ACTIONS.sat[0].value !=
          this.assetsForm.get('actionType').value &&
        (this.assetsForm.get('cars').value ||
          this.assetsForm.get('inmuebles').value)
      ) {
        this.onLoadToast(
          'warning',
          FORM_ACTION_TYPE_WITH_CHECK_ERROR(
            GOODS_BULK_LOAD_ACTIONS.sat[0].value
          ),
          'Error'
        );
        return false;
      } else {
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
      }
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
   * Proceso de validación de carga masiva para la opción SAT
   */
  validatorPreloadMassive() {
    console.log('SAT VALID');
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
      } else if (
        GOODS_BULK_LOAD_ACTIONS.sat[0].value ==
          this.assetsForm.get('actionType').value &&
        this.assetsForm.get('cars').value &&
        this.assetsForm.get('inmuebles').value
      ) {
        // --- PROCESO 4
        this.proceso = 4;
      }
      // Total de registros
      this.DeclarationsSatSaeMassive.common_general.total =
        this.tableSource.length;
      // Inicia proceso de validación
      this.DeclarationsSatSaeMassive.message_progress =
        VALIDATION_START_MESSAGE;
      // Setear arreglo de lista de errores
      this.listError = [];
      // Se inicia proceso de carga masiva
      this.inicioProceso = true;
      this.DeclarationsSatSaeMassive.common_general.proceso =
        this.assetsForm.get('actionType').value;
      from(this.tableSource)
        .pipe(
          switchMap(async (row: any, count: number) => {
            // Mensaje de proceso de validación actual
            this.DeclarationsSatSaeMassive.message_progress =
              VALIDATION_PROCESS_MESSAGE(count + 1);
            if (count <= 5) {
              let error: any[] = [[], []];
              // Indice actual del contador
              this.DeclarationsSatSaeMassive.common_general.count = count;
              let data: any = row;
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
                // Validar Unidad
                if (!data.unidad) {
                  error = this.agregarError(error, ERROR_UNIDAD(data.unidad));
                }
                // Validar Estatus
                if (data.status) {
                  await this.goodsBulkService
                    .getGoodStatus(data.status)
                    .subscribe({
                      next: res => res,
                      error: err => {
                        error = this.agregarError(
                          error,
                          ERROR_ESTATUS(data.status)
                        );
                      },
                    });
                } else {
                  error = this.agregarError(error, ERROR_ESTATUS(data.status));
                }
                // Validar Clasificación de bien
                if (data.clasif) {
                  const params: ListParams = {
                    page: this.params.getValue().page,
                    limit: this.params.getValue().limit,
                  };
                  this.params.getValue().getParams();
                  params['filter.numClasifGoods'] = '$eq:' + data.clasif + '';
                  await this.goodsBulkService
                    .getGoodssSubtype(params)
                    .subscribe({
                      next: res => {
                        if (res.data.length == 0) {
                          error = this.agregarError(
                            error,
                            ERROR_CLASS_GOOD(data.clasif)
                          );
                        }
                      },
                      error: err => {
                        error = this.agregarError(
                          error,
                          ERROR_CLASS_GOOD(data.clasif)
                        );
                      },
                    });
                } else {
                  error = this.agregarError(
                    error,
                    ERROR_CLASS_GOOD(data.clasif)
                  );
                }
                // Validar Unidad de acuerdo al número de Clasificación de bien
                if (data.clasif) {
                  await this.goodsBulkService
                    .getUnityByUnityAndClasifGood(data.clasif)
                    .subscribe({
                      next: (res: any) => {
                        if (res.minunit != data.unidad) {
                          error = this.agregarError(
                            error,
                            ERROR_UNITY_CLASS_GOOD(data.unidad, data.clasif)
                          );
                        }
                      },
                      error: err => {
                        error = this.agregarError(
                          error,
                          ERROR_UNITY_CLASS_GOOD(data.unidad, data.clasif)
                        );
                      },
                    });
                } else {
                  error = this.agregarError(
                    error,
                    ERROR_UNITY_CLASS_GOOD(data.unidad, data.clasif)
                  );
                }
              }
              // --- PROCESO 2
              if (this.proceso == 2) {
                // Validar Identificador padre de menaje
                if (!data.identificador) {
                  error = this.agregarError(
                    error,
                    ERROR_IDENTIFICADOR_MENAJE(data.identificador)
                  );
                }
              }
              // --- PROCESO 4
              if (this.proceso == 4) {
                // Validar transferente para revisar si el transferente es mayor a 10000 y existe en la base de datos
                if (data.transferente > 10000) {
                  const params: ListParams = {
                    page: this.params.getValue().page,
                    limit: this.params.getValue().limit,
                  };
                  this.params.getValue().getParams();
                  params['filter.idAuthorityIssuerTransferor'] =
                    '$eq:' + data.transferente + '';
                  await this.goodsBulkService
                    .getNumberTransferenteAuthority(data.transferente)
                    .subscribe({
                      next: res => {
                        if (res.data.length == 0) {
                          error = this.agregarError(
                            error,
                            ERROR_TRANSFERENTE(data.transferente)
                          );
                        }
                      },
                      error: err => {
                        error = this.agregarError(
                          error,
                          ERROR_TRANSFERENTE(data.transferente)
                        );
                      },
                    });
                }
                // Opción del check para sólo autos
                if (this.assetsForm.get('cars').value) {
                  const params: ListParams = {
                    page: this.params.getValue().page,
                    limit: this.params.getValue().limit,
                  };
                  this.params.getValue().getParams();
                  params['filter.classifGoodNumber'] =
                    '$eq:' + data.clasif + '';
                  await this.goodsBulkService
                    .getAtributeClassificationGood(data.clasif)
                    .subscribe({
                      next: res => {
                        console.log(res);
                        if (res.data) {
                          let dataResponse =
                            this.validateAttributeClassificationgood(
                              res.data,
                              SAT_SAE_MUEBLES_PROCESO_4
                            );
                          console.log(dataResponse);
                        }
                      },
                      error: err => {
                        error = this.agregarError(
                          error,
                          ERROR_ATRIBUTE_CLASS_GOOD(data.clasif)
                        );
                      },
                    });
                }
                // Opción del check para sólo inmuebles
                if (this.assetsForm.get('inmuebles').value) {
                  const params: ListParams = {
                    page: this.params.getValue().page,
                    limit: this.params.getValue().limit,
                  };
                  this.params.getValue().getParams();
                  params['filter.classifGoodNumber'] =
                    '$eq:' + data.clasif + '';
                  await this.goodsBulkService
                    .getAtributeClassificationGood(data.clasif)
                    .subscribe({
                      next: res => {
                        console.log(res);
                        if (res.data) {
                          let dataResponse =
                            this.validateAttributeClassificationgood(
                              res.data,
                              SAT_SAE_INMUEBLES_PROCESO_4
                            );
                          console.log(dataResponse);
                        }
                      },
                      error: err => {
                        error = this.agregarError(
                          error,
                          ERROR_ATRIBUTE_CLASS_GOOD(data.clasif)
                        );
                      },
                    });
                }
              }
              error[1].push(row);
              // let obj: any = {};
              // obj = { ...row };
              // for (let index = 0; index < error[0].length; index++) {
              //   obj['errores'] = obj['errores'] + ' --- ' + error[0][index];
              //   console.log(error[0][index], obj);
              // }
              // this.listError.push(obj);
              // console.log(obj, error, this.listError);
              this.DeclarationsSatSaeMassive.data_error.push(error);
            }
          })
        )
        .subscribe(val => {
          // Fin del proceso de validación
          this.DeclarationsSatSaeMassive.message_progress =
            VALIDATION_END_MESSAGE;
          console.log(this.DeclarationsSatSaeMassive, this.listError);
          console.log(val);
        });
    }
  }

  agregarError(error: any[], messageError: string) {
    // Agregar contador de error
    this.DeclarationsSatSaeMassive.common_general.total_errores++;
    // Cambiar validador de proceso
    this.DeclarationsSatSaeMassive.common_general.valid = false;
    // Guardar error y mensaje
    error[0].push(messageError);
    return error;
  }

  /**
   * Validar la respuesta de atributos de clasificacion del bien con los registros cargados
   * @param dataResponse Respuesta con el listado de Atributos de clasificacion del bien
   */
  validateAttributeClassificationgood(
    dataResponse: IAttribClassifGoods[],
    listCompare: any
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
          if (element == info.attribute) {
            likeVar = 1;
          }
        }
        for (
          let index = 0;
          index < listCompare.listEqualExist.length;
          index++
        ) {
          const element = listCompare.listEqualExist[index];
          if (element == info.attribute) {
            equalVar = 1;
          }
        }
      }
    }
    console.log(likeVar, equalVar);
    return { likeVar: likeVar, equalVar: equalVar };
  }

  /**
   * Exportar a XLSX
   */
  exportXlsx() {
    let errores = [];
    for (
      let index = 0;
      index < this.DeclarationsSatSaeMassive.data_error.length;
      index++
    ) {
      const element = this.DeclarationsSatSaeMassive.data_error[index];
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
        this.DeclarationsSatSaeMassive.common_general.proceso
      }${new Date().getTime()}`,
    });
  }

  /**
   * Validar los registros de los archivos cargados y subir los datos al servidor
   */

  /**
   * Validar los registros a subir al sistema antes de cargar la información
   */
  validDataUploadMassive() {
    // Inicia proceso de validación para carga
    this.DeclarationsSatSaeMassive.message_progress =
      VALIDATION_UPLOAD_START_MESSAGE;
    from(this.tableSource)
      .pipe(
        switchMap(async (row: any, count: number) => {
          // Mensaje de proceso de validación actual
          this.DeclarationsSatSaeMassive.message_progress =
            VALIDATION_UPDATE_PROCESS_MESSAGE(count + 1);
          // if (count <= 5) {
          let error: any[] = [[], []];
          // Indice actual del contador
          this.DeclarationsSatSaeMassive.common_general.count = count;
          let data: any = row;
          if (count <= 5) {
            // Validacion 5 registros
            // Validar menaje de acuerdo al identificador
            if (this.proceso == 2 && this.assetsForm.get('inmuebles').value) {
              if (!data.transferente) {
                error = this.agregarError(
                  error,
                  ERROR_GOOD_INMUEBLE(data.transferente)
                );
              } else {
                await this.goodsBulkService
                  .getGoodById(data.transferente)
                  .subscribe({
                    next: res => res,
                    error: err => {
                      error = this.agregarError(
                        error,
                        ERROR_GOOD_INMUEBLE(data.transferente)
                      );
                    },
                  });
              }
            } // Validar menaje de acuerdo al identificador
            // #### REVISAR EL MS PARA OBTENER CVE_UNICA
            if (
              this.assetsForm.get('inmuebles').value ||
              this.assetsForm.get('cars').value
            ) {
              const params: ListParams = {
                page: this.params.getValue().page,
                limit: this.params.getValue().limit,
              };
              this.params.getValue().getParams();
              // params['filter.classifGoodNumber'] = '$eq:' + data.clasif + '';
              if (data.transferente == null) {
                await this.goodsBulkService.searchForSatOnlyKey(params);
                // .subscribe({
                //   next: res => res,
                //   error: err => {
                //     error = this.agregarError(
                //       error,
                //       ERROR_CVE_SAT(data.transferente)
                //     );
                //   },
                // });
              }
            }
            // PROCESO --- 4
            // GENERACION DE VOLANTES
            if (this.proceso == 4) {
              if (data.descripcion != null && data.descripcion == '') {
                const params: ListParams = {
                  page: this.params.getValue().page,
                  limit: this.params.getValue().limit,
                };
                this.params.getValue().getParams();
                // params['filter.classifGoodNumber'] = '$eq:' + data.clasif + '';
                await this.goodsBulkService.searchCityByDescripction(params);
                // .subscribe({
                //   next: res => res,
                //   error: err => {
                //     error = this.agregarError(
                //       error,
                //       ERROR_CVE_SAT(data.transferente)
                //     );
                //   },
                // });              }
                // CREANDO EXPEDIENTE
                if (data.descripcion) {
                  // Inicia proceso de validación para carga
                  this.DeclarationsSatSaeMassive.message_progress =
                    VALIDATION_UPLOAD_CREATION_EXPEDIENTE_MESSAGE;
                  // Obtener institucion emisora EMISORA Y AUTORIDAD
                  await this.goodsBulkService
                    .getIssuingInstitutionById('120')
                    .subscribe({
                      next: res => res,
                      error: err => {
                        error = this.agregarError(
                          error,
                          ERROR_TRANSFERENTE(data.transferente)
                        );
                      },
                    });
                  // Obtener entidad federativa
                  await this.goodsBulkService
                    .getEntityFederativeByAsuntoSat(data.expediente)
                    .subscribe({
                      next: res => res,
                      error: err => {
                        error = this.agregarError(
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
          // Insertar errores encontrados a los anteriores
          this.DeclarationsSatSaeMassive.data_error[count][0].splice(
            this.DeclarationsSatSaeMassive.data_error[count][0],
            ...error[0]
          );
        })
      )
      .subscribe(val => {
        // Fin del proceso de validación
        this.DeclarationsSatSaeMassive.message_progress =
          VALIDATION_END_MESSAGE;
        console.log(this.DeclarationsSatSaeMassive, this.listError);
        console.log(val);
      });
  }
}
