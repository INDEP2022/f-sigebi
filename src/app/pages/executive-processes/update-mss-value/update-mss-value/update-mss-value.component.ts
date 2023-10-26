import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { UPDATE_MASS_VALUE_COLUMNS } from './update-mss-value-columns';

//XLSX
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';

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
  fileReader = new FileReader();

  constructor(private fb: FormBuilder, private excelService: ExcelService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...UPDATE_MASS_VALUE_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    //this.getPagination();
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
          this.readExcel(loadEvent.target.result);

          // Limpia el input de archivo para permitir cargar el mismo archivo nuevamente
          (event.target as HTMLInputElement).value = '';
        }
      };

      // Lee el contenido binario del archivo
      this.fileReader.readAsBinaryString(selectedFile);
    } catch (error) {}
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData(binaryExcel);
      const mappedData: any = [];
      for (let i = 0; i < this.dataExcel.length; i++) {
        mappedData.push({
          SOLICITANTE: this.dataExcel[i].SOLICITANTE,
          FECAVALUO: this.dataExcel[i].FECAVALUO,
          INSTITUCION: this.dataExcel[i].INSTITUCION,
          PERITO: this.dataExcel[i].PERITO,
          OBSERV: this.dataExcel[i].OBSERV,
          NOBIEN: this.dataExcel[i].NOBIEN,
          VALORAVALUO: this.dataExcel[i].VALORAVALUO,
          MONEDA: this.dataExcel[i].MONEDA,
        });
      }
      console.log(mappedData);
      this.source.load(mappedData);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  getPagination() {
    this.columns = this.ExcelData;
    this.totalItems = this.columns.length;
  }

  clean() {
    this.totalItems = 0;
    this.columns = [];
    this.ExcelData = [];
  }
}
