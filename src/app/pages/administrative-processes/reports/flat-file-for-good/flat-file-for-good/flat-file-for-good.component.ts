import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
interface IExcelToJson {
  id: number;
  utf8: string;
  column1: string;
  column2: number;
  column3: string;
}
@Component({
  selector: 'app-flat-file-for-good',
  templateUrl: './flat-file-for-good.component.html',
  styles: [],
})
export class FlatFileForGoodComponent extends BasePage implements OnInit {
  flatFileGoodForm: ModelForm<any>;
  data: IExcelToJson[] = [];
  constructor(private fb: FormBuilder, private excelService: ExcelService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.flatFileGoodForm = this.fb.group({
      delegationReceives: [null, Validators.required],
      delegationManages: [null, Validators.required],
      type: [null, Validators.required],
      area: [null, Validators.required],
      initialDate: [null, Validators.required],
      finalDate: [null, Validators.required],
    });
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
      this.data = this.excelService.getData<IExcelToJson>(binaryExcel);
      console.log(this.data);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }
}
