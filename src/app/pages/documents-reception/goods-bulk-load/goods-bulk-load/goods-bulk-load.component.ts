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
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GOODS_BULK_LOAD_ACTIONS,
  GOODS_BULK_LOAD_TARGETS,
} from '../constants/good-bulk-load-data';
import { previewData } from '../interfaces/goods-bulk-load-table';
import { GoodsBulkLoadService } from '../services/goods-bulk-load.table';
import { DeclarationsSatSaeMassive } from '../utils/declarations-sat-massive';
import {
  ERROR_ATRIBUTE_CLASS_GOOD,
  ERROR_CLASS_GOOD,
  ERROR_ESTATUS,
  ERROR_IDENTIFICADOR_MENAJE,
  ERROR_TRANSFERENTE,
  ERROR_UNIDAD,
  ERROR_UNITY_CLASS_GOOD,
  FORM_ACTION_TYPE_NULL,
  FORM_IDENTIFICATOR_NULL,
  NOT_LOAD_FILE,
  VALIDATION_START_MESSAGE,
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

  save() {
    this.assetsForm.markAllAsTouched();
    this.reviewConditions();
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
      console.log(this.tableSource, this.tableSource[0]);
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
      console.log(this.tableSource[0]);
      let obj: any = {};
      let object: any = this.tableSource[0];
      // this.tableSource.forEach((object: any) => {
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (key) {
            obj[key] = {
              title: key,
              type: 'string',
              sort: false,
            };
          }
        }
      }
      // });

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
  }

  /**
   * Revisar las condiciones para comenzar el proceso de carga de registros
   */
  reviewConditions() {
    console.log(this.assetsForm.value, this.target.value);
    if (this.target.value == 'sat') {
      console.log('SAT');
      this.validatorSatMassive();
    } else if (this.target.value == 'pgr') {
      console.log('PGR');
      this.validatorPgrMassive();
    } else if (this.target.value == 'general') {
      console.log('GENERAL');
      this.validatorGeneralMassive();
    }
  }

  /**
   * Revisa si se tiene un id de carga ingresado
   * @returns Si la validacion es correcta
   */
  validIdCarga() {
    if (this.assetsForm.get('idCarga').value) {
      return true;
    } else {
      this.onLoadToast('error', FORM_IDENTIFICATOR_NULL, 'Error');
      return false;
    }
  }

  /**
   * Revisa si se tiene una opción de carga seleccionada
   * @returns Si la validacion es correcta
   */
  validActionType() {
    if (this.assetsForm.get('actionType').value) {
      return true;
    } else {
      this.onLoadToast('error', FORM_ACTION_TYPE_NULL, 'Error');
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
      this.onLoadToast('error', NOT_LOAD_FILE, 'Error');
      return false;
    }
  }

  /**
   * Proceso de validación de carga masiva para la opción SAT
   */
  validatorSatMassive() {
    console.log('SAT VALID');
    if (this.validIdCarga() && this.validActionType() && this.validLoadFile()) {
      this.startVariables();
      let proceso = 0;
      if (
        GOODS_BULK_LOAD_ACTIONS.sat[0].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 1
        proceso = 1;
      } else if (
        GOODS_BULK_LOAD_ACTIONS.sat[1].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 2
        proceso = 2;
      } else if (
        GOODS_BULK_LOAD_ACTIONS.sat[2].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 3
        proceso = 3;
      } else if (
        GOODS_BULK_LOAD_ACTIONS.sat[3].value ==
        this.assetsForm.get('actionType').value
      ) {
        // --- PROCESO 4
        proceso = 4;
      } else {
        return;
      }
      // Total de registros
      this.DeclarationsSatSaeMassive.common_general.total =
        this.tableSource.length;
      // Inicia proceso de validación
      this.DeclarationsSatSaeMassive.message_progress =
        VALIDATION_START_MESSAGE;

      from(this.tableSource)
        .pipe(
          switchMap(async (row: any, count: number) => {
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
                proceso == 1 ||
                proceso == 2 ||
                proceso == 3 ||
                proceso == 4
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
                // #### Falta que filtre por numero clasificacion bien
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
                      next: res => res,
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
              if (proceso == 2) {
                // Validar Identificador padre de menaje
                if (!data.identificador) {
                  error = this.agregarError(
                    error,
                    ERROR_IDENTIFICADOR_MENAJE(data.identificador)
                  );
                }
              }
              // --- PROCESO 4
              if (proceso == 4) {
                // Validar transferente
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
                      next: res => res,
                      error: err => {
                        error = this.agregarError(
                          error,
                          ERROR_TRANSFERENTE(data.transferente)
                        );
                      },
                    });
                }
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
              this.DeclarationsSatSaeMassive.data_error.push(error);
            }
          })
        )
        .subscribe(val => {
          console.log(this.DeclarationsSatSaeMassive);
          console.log(val);
        });
    }
  }

  agregarError(error: any[], messageError: string) {
    // Agregar contador de error
    this.DeclarationsSatSaeMassive.common_general.total_erros++;
    // Cambiar validador de proceso
    this.DeclarationsSatSaeMassive.common_general.valid = false;
    // Guardar error y mensaje
    error[0].push(messageError);
    return error;
  }

  validProccessSat() {}

  validatorPgrMassive() {
    console.log('PGR VALID');
  }
  validatorGeneralMassive() {
    console.log('GENERAL VALID');
    console.log(this.tableSource);
  }
}
