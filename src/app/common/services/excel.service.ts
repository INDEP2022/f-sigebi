import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { read, utils, WorkBook, WorkSheet, write } from 'xlsx';
import { FileSaverService } from './file-saver.service';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const XLSX_EXTENSIONS = {
  xlsx: '.xlsx',
  csv: '.csv',
};
const EXCEL_EXTENSION = '.xlsx';
interface IXLSXExportConfig {
  filename: string;
  type?: 'xlsx' | 'csv';
}

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(private fileSaverService: FileSaverService) {}

  getData<T = any>(binaryString: string | ArrayBuffer): T[] {
    const workbook = read(binaryString, { type: 'binary' });
    const sheetNames = workbook.SheetNames;
    return utils.sheet_to_json<T>(workbook.Sheets[sheetNames[0]]);
  }

  export(json: any[], { type = 'xlsx', filename }: IXLSXExportConfig) {
    const workSheet = utils.json_to_sheet(json);
    const workBook: WorkBook = {
      Sheets: { 'Hoja 1': workSheet },
      SheetNames: ['Hoja 1'],
    };
    const buffer = write(workBook, { bookType: type, type: 'array' });
    this.saveFile(buffer, filename, XLSX_EXTENSIONS[type]);
  }

  private saveFile(buffer: any, filename: string, extension: string): void {
    const saveFileOptions = { type: EXCEL_TYPE, filename, extension };
    this.fileSaverService.saveFromBuffer(buffer, saveFileOptions);
  }

  /**
   * @deprecated Cambiar por export
   */
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const myworksheet: WorkSheet = utils.json_to_sheet(json);
    const myworkbook: WorkBook = {
      Sheets: { data: myworksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = write(myworkbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
   * @deprecated Cambiar por saveFile
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + '_exported' + EXCEL_EXTENSION);
  }
}
