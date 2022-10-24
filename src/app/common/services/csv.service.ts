import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

const CSV_EXTENSION = '.csv';

@Injectable({
  providedIn: 'root',
})
export class CsvService {
  constructor() {}

  // La funcion recibe el evento de un input type="file", como el evento de change (change)="loadFile($event)" y regresa un arreglo.
  // Regresara un arreglo vacio si no encuentra archivos en el input.
  public async getData(e: Event): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const target = e.target as HTMLInputElement;
      const file = target.files[0];
      const delimiter: string = ',';
      if (file) {
        const reader = new FileReader();
        reader.onload = async e => {
          try {
            const str = e.target.result as string;
            const headers = str.slice(0, str.indexOf('\n')).split(delimiter);
            const rows = str.slice(str.indexOf('\n') + 1).split('\n');
            const arr = rows.map(function (row) {
              const values = row.split(delimiter);
              const el = headers.reduce(function (object: any, header, index) {
                object[header] = values[index];
                return object;
              }, {});
              return el;
            });
            resolve(arr);
          } catch (error) {
            reject([]);
          }
        };
        reader.onerror = () => {
          reject([]);
        };
        reader.readAsText(file);
      } else {
        reject([]);
      }
    });
  }

  // Esta funcion requiere un arreglo de objetos, si no regresara null
  public exportAsCsv(data: any[], fileName: string): void {
    let result: string,
      ctr: number,
      keys: any[],
      columnDelimiter: string,
      lineDelimiter: string,
      csv: any;

    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = ',';
    lineDelimiter = '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    this.saveAsCsv(result, fileName);
  }

  private saveAsCsv(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'text/csv',
    });
    FileSaver.saveAs(data, fileName + '_exported' + CSV_EXTENSION);
  }
}
