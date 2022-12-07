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
import { IGoodsBulkLoadExampleData } from '../interfaces/goods-bulk-load-table';

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
  assetsForm: FormGroup;
  tableSource: IGoodsBulkLoadExampleData[] = [];
  actions = GOODS_BULK_LOAD_ACTIONS.general;
  target = new FormControl<'general' | 'sat' | 'pgr'>('general');
  targets = GOODS_BULK_LOAD_TARGETS;
  get bulkId() {
    return this.assetsForm.get('idCarga');
  }

  constructor(private fb: FormBuilder, private excelService: ExcelService) {
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
      this.tableSource =
        this.excelService.getData<IGoodsBulkLoadExampleData>(binaryExcel);
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
}
