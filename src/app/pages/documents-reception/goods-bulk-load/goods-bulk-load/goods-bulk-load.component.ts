import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GOODS_BULK_LOAD_ACTIONS,
  GOODS_BULK_LOAD_TARGETS,
} from '../constants/good-bulk-load-data';
import { previewData } from '../interfaces/goods-bulk-load-table';
import { GoodsBulkLoadService } from '../services/goods-bulk-load.table';
import { DeclarationsSatSaeMassive } from '../utils/declarations-sat-massive';
import { FORM_IDENTIFICATOR_NULL } from '../utils/goods-bulk-load.message';

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
      this.tableSource = this.excelService.getData<previewData | any>(
        binaryExcel
      );
      console.log(this.tableSource);
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
    const target = this.target.value;
    this.actions = GOODS_BULK_LOAD_ACTIONS[target] ?? [];
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
   * Proceso de validación de carga masiva para la opción SAT
   */
  validatorSatMassive() {
    console.log('SAT VALID');
    if (this.validIdCarga()) {
      this.startVariables();
      // Total de registros
      this.DeclarationsSatSaeMassive.common_general.total =
        this.tableSource.length;
      this.tableSource.forEach(async (object: any, count) => {
        let error: any[] = [[], []];
        // Indice actual del contador
        this.DeclarationsSatSaeMassive.common_general.count = count;
        console.log(
          GOODS_BULK_LOAD_ACTIONS.sat[0].value,
          this.assetsForm.get('actionType').value
        );
        if (
          GOODS_BULK_LOAD_ACTIONS.sat[0].value ==
          this.assetsForm.get('actionType').value
        ) {
          // Validar Unidad
          if (!object.unidad) {
            // Agregar contador de error
            this.DeclarationsSatSaeMassive.common_general.total_erros++;
            // Cambiar validador de proceso
            this.DeclarationsSatSaeMassive.common_general.valid = false;
            // Guardar error y mensaje
            error[0].push('La cantidad es invalida. En el campo: UNIDAD');
          }
          // console.log('Espera...');
          // var estatus_bien = await this.goodsBulkService.getGoodStatus(
          //   object.status
          // );
          // console.log('Continuar...');
          // console.log(estatus_bien);
        }
        error[1].push(object);
        this.DeclarationsSatSaeMassive.data_error.push(error);
      });
      console.log(this.DeclarationsSatSaeMassive);
    }
  }

  validProccessSat() {}

  validatorPgrMassive() {
    console.log('PGR VALID');
  }
  validatorGeneralMassive() {
    console.log('GENERAL VALID');
  }
}
