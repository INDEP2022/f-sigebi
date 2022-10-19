import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CsvToArrayService {
  constructor() {}

  public async csvToArray(
    input: HTMLInputElement,
    delimiter: string = ','
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const file = input.files[0];
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
}
