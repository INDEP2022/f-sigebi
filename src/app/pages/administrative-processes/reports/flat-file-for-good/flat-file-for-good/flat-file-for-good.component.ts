import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private siabService: SiabService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.flatFileGoodForm = this.fb.group({
      delegationReceives: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegationManages: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      type: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      area: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
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

  onSubmit() {
    console.log(this.flatFileGoodForm.value);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGERADBFILEAEXCEL.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);

    // Crea enlace de etiqueta anchor con js
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';

    let params = { ...this.flatFileGoodForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }

    setTimeout(() => {
      this.siabService
        .getReport(SiabReportEndpoints.FGERADBFILEAEXCEL, params)
        .subscribe({
          next: response => {
            console.log(response);
            window.open(pdfurl, 'DOCUMENT');
          },
          error: () => {
            window.open(pdfurl, 'DOCUMENT');
          },
        });
    }, 4000);
  }
}
