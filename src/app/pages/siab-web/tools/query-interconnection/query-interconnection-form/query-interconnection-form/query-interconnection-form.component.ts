import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-query-interconnection-form',
  templateUrl: './query-interconnection-form.component.html',
  styles: [
    `
      input[type='file']::file-selector-button {
        margin-right: 20px;
        border: none;
        background: #9d2449;
        padding: 10px 20px;
        border-radius: 5px;
        color: #fff;
        cursor: pointer;
        /* transition: background.2s ease-in-out; */
      }

      /* input[type = file]::file-selector-button:hover {
        background: #9D2449;
      } */
    `,
  ],
})
export class QueryInterconnectionFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  records: any[] = [];
  totalRepeated: number;
  totalExcelRecords: number;
  splitCveUnicas: any;
  nameFile: string;
  splitCve: any;
  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, []],
    });
  }

  chargeFile(event: any) {
    console.log(event.target.files[0]);
    this.nameFile = event.target.files[0].name;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        this.records = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(this.records);
      };
      reader.readAsArrayBuffer(file);
    }
  }
  consult() {
    if (this.form.get('file').value) {
      console.log(this.records);
      if (this.records.length === 0) {
        this.alert('warning', 'No se encontraron registros', ``);
      } else {
        this.totalRepeated = this.findDuplicateKeys(this.records);
        this.totalExcelRecords = this.records.length;
        let totCve = this.totalABuscar(this.records);
        this.splitCve = totCve.split(',');
        this.splitCveUnicas = this.splitCve.length;
        console.log(this.splitCve);
        /*let result = 
        console.log(result);*/
      }
    } else {
      this.alert('warning', 'Debe cargar un archivo de excel', '');
    }

    //console.log(this.records);
  }

  download() {
    if (this.splitCve) {
      this.Report();
    } else {
      this.alert('warning', 'No se puede descargar el archivo', '');
    }
  }

  findDuplicateKeys(dtCveUnicas: any) {
    let ClavesRepetidasFinal = '';
    let resultado = 0;
    let CveUnicaExcel = '';
    let CveUnicaRecorrido = '';
    let PosicionActual = 0;
    let yaexiste = false;

    for (let i = 0; i < dtCveUnicas.length; i++) {
      yaexiste = false;
      PosicionActual = i;
      CveUnicaExcel = dtCveUnicas[i][0].toString();
      //console.log(CveUnicaExcel);

      for (let r = 0; r < dtCveUnicas.length; r++) {
        CveUnicaRecorrido = dtCveUnicas[r][0].toString();
        console.log(CveUnicaRecorrido);
        if (r !== i) {
          console.log(CveUnicaExcel, CveUnicaRecorrido);
          if (CveUnicaExcel === CveUnicaRecorrido) {
            if (ClavesRepetidasFinal === '') {
              ClavesRepetidasFinal = CveUnicaExcel;
            } else {
              const subs = ClavesRepetidasFinal.split(',');
              for (const sub of subs) {
                if (sub === CveUnicaExcel) {
                  yaexiste = true;
                }
              }
            }

            if (!yaexiste) {
              ClavesRepetidasFinal = ClavesRepetidasFinal + ',' + CveUnicaExcel;
              resultado = resultado + 1;
            }
          }
        }
      }
    }
    return resultado;
  }

  private totalABuscar(dt: any): string {
    let resultado = 0;
    let strClavesUnicas = '';
    let yaExiste = false;

    for (const item of dt) {
      yaExiste = false;

      if (!strClavesUnicas) {
        strClavesUnicas = item[0].toString();
        yaExiste = true;
      } else {
        const splitCveUnicas = strClavesUnicas.split(',');
        for (const sub of splitCveUnicas) {
          if (sub === item[0].toString()) {
            yaExiste = true;
          }
        }
      }

      if (!yaExiste) {
        strClavesUnicas += ',' + item[0].toString();
      }
    }

    const splitCveUnicas3 = strClavesUnicas.split(',');
    resultado = splitCveUnicas3.length;

    return strClavesUnicas;
  }

  Report() {
    /*this.massiveGoodService.getObtnGoodExcel(this.array).subscribe({
      next: resp => {
        console.log(resp.nameFile);
        const date = new Date(Date());
        var formatted = new DatePipe('en-EN').transform(
          date,
          'dd/MM/yyyy',
          'UTC'
        );
        this.downloadDocument(
          `Informacion del Bien - ${formatted}`,
          'excel',
          resp.base64File
        );
      },
      error: err => {
        console.log(err);
      },
    });*/

    const date = new Date(Date());
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    const name = `Resultado_CveUnicas_Busqueda_${formattedTime}`;
    const nameFile = `Resultado del archivo(${name})`;
    console.log(nameFile);
  }

  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loading = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
