import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { UPDATE_MASS_VALUE_COLUMNS } from './update-mss-value-columns';

//XLSX
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-update-mss-value',
  templateUrl: './update-mss-value.component.html',
  styleUrls: ['./update-mss-value.scss'],
})
export class UpdateMssValueComponent extends BasePage implements OnInit {
  ExcelData: any;
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columns: any[] = [];

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
    //this.getPagination();
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
      this.columns = this.ExcelData;
      this.totalItems = this.columns.length || 0;
      console.log(this.ExcelData);
    };
  }

  getPagination() {
    this.columns = this.ExcelData;
    this.totalItems = this.columns.length;
  }
}
