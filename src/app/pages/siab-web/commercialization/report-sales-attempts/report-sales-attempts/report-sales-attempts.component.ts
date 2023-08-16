import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExcelService } from 'src/app/common/services/excel.service';
import { BasePage } from 'src/app/core/shared';

interface IExcelToJson {
  id: number;
  utf8: string;
  column1: string;
  column2: number;
  column3: string;
}

@Component({
  selector: 'app-report-sales-attempts',
  templateUrl: './report-sales-attempts.component.html',
  styles: [],
})
export class ReportSalesAttemptsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: IExcelToJson[] = [];
  get filterGoods() {
    return this.form.get('filterGoods');
  }

  get filterText() {
    return this.form.get('filterText');
  }

  constructor(private fb: FormBuilder, private excelService: ExcelService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm2();
  }

  private prepareForm2() {
    this.form = this.fb.group({
      typeGood: [],
      filterGoods: [],
      filterText: [],
    });
  }

  chargeFile(event: any) {}

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData<IExcelToJson>(binaryExcel);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }
}
