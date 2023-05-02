import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { REGULAR_BILLING_GENERATION_ASSETS_COLUMNS } from './regular-billing-generation-assets-columns';
//XLSX
import { ExcelService } from 'src/app/common/services/excel.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-regular-billing-generation-assets',
  templateUrl: './regular-billing-generation-assets.component.html',
  styles: [],
})
export class RegularBillingGenerationAssetsComponent
  extends BasePage
  implements OnInit
{
  constructor(private excelService: ExcelService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REGULAR_BILLING_GENERATION_ASSETS_COLUMNS },
    };
  }

  data = [
    {
      noBien: 207,
      serie: 54857,
      invoice: 2654,
      observation: 'Sin observaciones',
      event: 1321,
      allotment: 78,
      status: 'No disponible',
      validation: 'Incorrecto',
      dateProccess: '10/nov/2019',
      user: 'MIGUEL FERNANDEZ HERNANDEZ',
    },
  ];

  ngOnInit(): void {}

  ReadExcel(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = e => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workbook.SheetNames;
      this.data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      console.log(this.data);
    };
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.data, 'generacion_bienes_VNR');
  }
}
