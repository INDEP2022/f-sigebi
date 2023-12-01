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
  constructor(private fb: FormBuilder) {
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
        let splitCve = totCve.split(',');
        this.splitCveUnicas = splitCve.length;
        console.log(totCve, splitCve);
        /*let result = 
        console.log(result);*/
      }
    } else {
      this.alert('warning', 'Debe cargar un archivo de excel', '');
    }

    //console.log(this.records);
  }

  download() {
    if (this.form.get('file').value) {
    } else {
      this.alert('warning', 'Debe cargar un archivo de excel', '');
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
}
