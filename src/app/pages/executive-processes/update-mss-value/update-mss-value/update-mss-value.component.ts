import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { UPDATE_MASS_VALUE_COLUMNS } from './update-mss-value-columns';

//XLSX
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';

@Component({
  selector: 'app-update-mss-value',
  templateUrl: './update-mss-value.component.html',
  styleUrls: ['./update-mss-value.scss'],
})
export class UpdateMssValueComponent extends BasePage implements OnInit {
  ExcelData: any;
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  source: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  dataExcel: any = [];
  columns: any[] = [];
  mappedData: any = [];
  fileReader = new FileReader();
  tRegProcesados: number = 0;
  tLeidos: number = 0;

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodProcessService: GoodProcessService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...UPDATE_MASS_VALUE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      readRecords: ['', []],
      processedRecords: ['', []],
    });
  }

  ReadExcel(event: any) {
    try {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length !== 1) {
        throw new Error('Please select one file.');
      }

      const selectedFile = files[0];
      console.log(selectedFile.name);

      // Limpia cualquier evento onload anterior
      this.fileReader.onload = null;

      // Asigna el evento onload para manejar la lectura del archivo
      this.fileReader.onload = loadEvent => {
        if (loadEvent.target && loadEvent.target.result) {
          // Llama a la función para procesar el archivo
          this.Excel(loadEvent.target.result);

          // Limpia el input de archivo para permitir cargar el mismo archivo nuevamente
          (event.target as HTMLInputElement).value = '';
        }
      };

      // Lee el contenido binario del archivo
      this.fileReader.readAsBinaryString(selectedFile);
    } catch (error) {}
  }

  Excel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData(binaryExcel);

      for (let i = 0; i < this.dataExcel.length; i++) {
        const fechaOriginal = this.dataExcel[i].FECAVALUO;

        // Convertir el número de fecha en una fecha de JavaScript
        const fechaExcel = parseFloat(fechaOriginal);
        const fechaJavaScript = new Date((fechaExcel - 25569) * 86400 * 1000);

        // Formatear la fecha en 'AAAA-MM-DD'
        const year = fechaJavaScript.getFullYear();
        const month = (fechaJavaScript.getMonth() + 1)
          .toString()
          .padStart(2, '0');
        const day = fechaJavaScript.getDate().toString().padStart(2, '0');
        const fechaForm = `${year}-${month}-${day}`;

        this.mappedData.push({
          proficientOpinion: this.dataExcel[i].SOLICITANTE,
          appraisalVigDate: fechaForm,
          valuerOpinion: this.dataExcel[i].PERITO,
          goodNumber: this.dataExcel[i].NOBIEN,
          appraisedValue: this.dataExcel[i].VALORAVALUO,
          appraisalCurrencyKey: this.dataExcel[i].MONEDA,
        });
      }
      console.log(this.dataExcel);
      this.source.load(this.mappedData);
      this.tLeidos = this.dataExcel.length;
      this.totalItems = this.tLeidos;
      this.columns = this.ExcelData;
    } catch (error) {
      this.onLoadToast('error', 'Ocurrió un error al leer el archivo', 'Error');
    }
  }

  clean() {
    this.totalItems = 0;
    this.tLeidos = 0;
    this.tRegProcesados = 0;
    this.columns = [];
    this.ExcelData = [];
    this.mappedData = [];
    this.source.load([]);
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  updateMassive() {
    console.log(this.mappedData);

    if (this.mappedData.length === 0) {
      this.alert('warning', 'Debe importar un archivo a excel', '');
      return;
    }

    const body = {
      blkPreview: this.mappedData,
    };

    console.log(body);

    this.goodProcessService.massiveUpdate(body).subscribe({
      next: resp => {
        console.log(resp);
        this.tRegProcesados = resp.T_REG_PROCESADOS;
        this.tLeidos = this.dataExcel.length;
        this.alert(
          'success',
          'Registros  procesados exitosamente:',
          resp.T_REG_PROCESADOS
        );
      },
      error: err => {
        console.log(err);
      },
    });
  }
}
