import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { from, switchMap } from 'rxjs';
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
  FORM_ACTION_TYPE_NULL,
  FORM_IDENTIFICATOR_NULL,
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
      assetType: [null, [Validators.required]],
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
   * Proceso de validación de carga masiva para la opción SAT
   */
  validatorSatMassive() {
    console.log('SAT VALID');
    if (this.validIdCarga() && this.validActionType()) {
      this.startVariables();
      // Total de registros
      this.DeclarationsSatSaeMassive.common_general.total =
        this.tableSource.length;
      let flujo = false;

      from(this.tableSource)
        .pipe(
          switchMap(async (row: any, count: number) => {
            if (count <= 5) {
              console.log(row);
              let error: any[] = [[], []];
              // Indice actual del contador
              this.DeclarationsSatSaeMassive.common_general.count = count;
              // --- PROCESO 1
              if (
                GOODS_BULK_LOAD_ACTIONS.sat[0].value ==
                this.assetsForm.get('actionType').value
              ) {
                // Validar Unidad
                if (!row.unidad) {
                  error = this.agregarError(
                    error,
                    'La cantidad es inválida. En el campo: UNIDAD'
                  );
                }
                // Validar Estatus
                if (row.status) {
                  this.goodsBulkService
                    .getGoodStatus('no')
                    .subscribe(res => console.log(res));
                }
              }
            }
          })
        )
        .subscribe(val => {
          console.log(val);
        });
      return;
      this.tableSource.forEach(async (object: any, count) => {
        if (count <= 5) {
          let error: any[] = [[], []];
          // Indice actual del contador
          this.DeclarationsSatSaeMassive.common_general.count = count;
          console.log(
            GOODS_BULK_LOAD_ACTIONS.sat[0].value,
            this.assetsForm.get('actionType').value
          );
          // --- PROCESO 1
          if (
            GOODS_BULK_LOAD_ACTIONS.sat[0].value ==
            this.assetsForm.get('actionType').value
          ) {
            // Validar Unidad
            if (!object.unidad) {
              error = this.agregarError(
                error,
                'La cantidad es inválida. En el campo: UNIDAD'
              );
            }
            console.log(object.status, 'Campo');
            this.goodsBulkService.getGoodStatus(object.status).subscribe({
              next: res => console.log(res),
              error: error => {
                console.log(error);
              },
            });
            // if (object.status) {
            // var estatus_bien = await
            // this.goodsBulkService
            //   .getGoodStatus(object.status)
            //   // .pipe(
            //   //   switchMap(res => {
            //   //     console.log('RESPONSE', res);
            //   //     return res;
            //   //   })
            //   // )
            //   .subscribe(ret => {
            //     console.log('Recd from switchMap : ', ret);
            //   });
            // if (estatus_bien) {
            //   // let res = estatus_bien.subscribe(ret => {
            //   //   console.log('Recd from switchMap : ', ret);
            //   // });
            //   console.log('Continuar...');
            //   error[0].push('La cantidad es invalida. En el campo: UNIDAD');
            //   console.log(estatus_bien);
            //   // Termino flujo
            //   flujo = true;
            // }
            // } else {
            //   error = this.agregarError(error, 'El estatus es inválido.');
            // }
          }
          // --- PROCESO 1
          if (flujo == true) {
            error[1].push(object);
            this.DeclarationsSatSaeMassive.data_error.push(error);
            // Reinicia flujo
            flujo = false;
          }
        }
      });
      console.log(this.DeclarationsSatSaeMassive);
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
  }
}
