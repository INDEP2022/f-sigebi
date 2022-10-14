import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VALIDATION_EXEMPTED_GOODS_COLUMS } from './c-b-bedv-c-validation-exempted-goods-columns';

import { BasePage } from 'src/app/core/shared/base-page';
//XLSX
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-c-b-bedv-c-validation-exempted-goods',
  templateUrl: './c-b-bedv-c-validation-exempted-goods.component.html',
  styles: [],
})
export class CBBedvCValidationExemptedGoodsComponent
  extends BasePage
  implements OnInit
{
  ExcelData: any;
  CsvData: any;
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...VALIDATION_EXEMPTED_GOODS_COLUMS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.form = this.fb.group({
      idEvento: ['', [Validators.required]],
      blackList: ['', [Validators.required]],
      refundAmount: ['', [Validators.required]],
      penaltyAmount: ['', [Validators.required]],
    });
  }

  list = [
    {
      bien: '791',
      descripcion:
        'FREIGHTLINER 1987 AZUL 453BK6 SPF CON CAJA REFRIGERADA CON THERMOKING 1FUEYB',
      unidad: 'UNIDAD',
      proceso: 'REV',
    },
    {
      bien: '1773',
      descripcion: 'CARGADOR DE LA MARCA CANON, AL PARECER PARA CACULADORA',
      unidad: 'PIEZA',
      proceso: 'COMER',
    },
    {
      bien: '10230',
      descripcion: 'SEMIREMOLQUE TIPO CAJA CERRADA',
      unidad: 'PIEZA',
      proceso: 'REV',
    },
  ];

  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = e => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workbook.SheetNames;
      this.list = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.list);
    };
  }
}
