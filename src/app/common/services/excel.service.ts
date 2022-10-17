import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import { read, utils, WorkSheet, WorkBook, write } from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  getData<T = any>(binaryString: string | ArrayBuffer) {
    return new Promise<T[]>(resolve => {
      const workbook = read(binaryString, { type: 'binary' });
      const sheetNames = workbook.SheetNames;
      const data = utils.sheet_to_json<T>(workbook.Sheets[sheetNames[0]]);
      resolve(data);
    });
  }

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

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + '_exported' + EXCEL_EXTENSION);
  }
}
