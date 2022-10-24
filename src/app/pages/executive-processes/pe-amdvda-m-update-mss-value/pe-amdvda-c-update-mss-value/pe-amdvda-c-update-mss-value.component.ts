import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { UPDATE_MASS_VALUE_COLUMNS } from './update-mss-value-columns';

//XLSX
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pe-amdvda-c-update-mss-value',
  templateUrl: './pe-amdvda-c-update-mss-value.component.html',
  styles: [],
})
export class PeAmdvdaCUpdateMssValueComponent
  extends BasePage
  implements OnInit
{
  ExcelData: any;
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...UPDATE_MASS_VALUE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      readRecords: ['', []],
      processedRecords: ['', []],
    });
  }

  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = e => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workbook.SheetNames;
      this.ExcelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.ExcelData);
    };
  }
}
