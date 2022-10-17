import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared/base-page';

import { GOODS_BULK_LOAD_COLUMNS } from './goods-bulk-load-columns';

@Component({
  selector: 'app-dr-goods-bulk-load',
  templateUrl: './dr-goods-bulk-load.component.html',
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
export class DrGoodsBulkLoadComponent extends BasePage implements OnInit {
  assetsForm: FormGroup;
  actionsTypes = ACTION_TYPES;
  get bulkId() {
    return this.assetsForm.get('idCarga');
  }

  constructor(private fb: FormBuilder, private excelService: ExcelService) {
    super();
    this.settings.columns = GOODS_BULK_LOAD_COLUMNS;
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

  async readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      const data = await this.excelService.getData(binaryExcel);
      console.log(data);
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
}

const ACTION_TYPES = [
  {
    value: 'Inserción de bienes',
    title: 'Inserción de bienes',
  },
  {
    value: 'Inserción de mensaje',
    title: 'Inserción de mensaje',
  },
  {
    value: 'Actualización de datos de bienes',
    title: 'Actualización de datos de bienes',
  },
  {
    value: 'Inserción de volantes',
    title: 'Inserción de volantes',
  },
];
