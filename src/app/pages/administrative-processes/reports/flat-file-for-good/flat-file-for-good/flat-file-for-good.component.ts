import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import * as XLSX from 'xlsx';
import { UsersService } from '../../../../../core/services/ms-users/users.service';

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
  dateI: string = '';
  dateF: string = '';
  showFileErrorMessage = false;
  showFileErrorMessage2 = false;
  titelFileDelivery: string = 'Nombre del Archivo Excel(Entrega)';
  titelFileForfeiture: string = 'Nombre del Archivo Excel(Decomiso)';
  proceduralHistoryForm: ModelForm<any>;
  proceduralHistoryForm2: ModelForm<any>;
  users$ = new DefaultSelect<ISegUsers>();
  fechaF: Date;
  FinalDate: string;
  headerString: string =
    'No_DELEGACION~DELEGACION~NO_SUBDELEGACION~SUBDELEGACION~EXPEDIENTE~CVE_ACTA~DELEGACION RECIBE~DELEGACION ADMINISTRA~NO_ACTA~ESTATUS_ACTA~ELABORO~CANTIDAD_RECIBIDA~INDICIADO~AVERIGUACION PREVIA~CAUSA PENAL~INSTITUCION~MINISTERIO PUBLICO~JUZGADO~RECEPCION FISICA_BIEN~RECEPCION_FISICA O ELABORO~FEC_ACUERDO_ASEG~FEC CAPTURA~NO_TIPO~TIPO~NO_SUBTIPO~SUBTIPO~NO_SSUBTIPO~SSUBTIPO~NO_SSSUBTIPO~SSSUBTIPO~CANTIDAD_NOTIFICADA~NO.BIEN~BIEN~IMPORTE~MONEDA~FEC_AVALUO_VIG~SITUACION~TIPO UBICACION~FECHA ENTRADA~FECHA SALIDA~VAL1~VAL2~VAL3~VAL4~VAL5~VAL6~VAL7~VAL8~VAL9~VAL10~VAL11~VAL12~VAL13~VAL14~VAL15~VAL16~VAL17~VAL18~VAL19~VAL20~VAL21~VAL22~VAL23~VAL24~VAL25~VAL26';
  nameFileA = document.getElementById('nameFileA') as HTMLInputElement;
  flag_report: boolean = false;
  reporte_flag: boolean = false;
  reporte_flag2: boolean = false;
  dataDelivery: any[] = [];
  dataForfeiture: any[] = [];

  filterForm: FormGroup = this.fb.group({
    user: [null],
  });

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private siabService: SiabService,
    private usersService: UsersService,
    private proceedingsService: ProceedingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareFormReci();
    this.prepareFormAdmin();
    this.prepareForm();
    const headerArray = this.headerString.split('~');
    this.dataDelivery.push(headerArray);
    this.dataForfeiture.push(headerArray);
  }

  private prepareFormReci() {
    this.proceduralHistoryForm = this.fb.group({
      delegation: [null, [Validators.required]],
    });
  }

  private prepareFormAdmin() {
    this.proceduralHistoryForm2 = this.fb.group({
      delegation: [null, [Validators.required]],
    });
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
      //file1: [null, Validators.required],
      //file2: [null, Validators.required],
    });
  }

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const archivo = files[0];
    this.titelFileForfeiture = archivo.name;
    this.showFileErrorMessage2 = false;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  onFileChangeDelivery(event: Event) {
    this.exportExcelEntrega();
  }

  exportExcelEntrega() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataDelivery, {
      skipHeader: true,
    });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Hoja1');
    this.cleanPlaceholder('nameFileA', 'reporteEntrega.xlsx');
    XLSX.writeFile(workBook, 'reporteEntrega.xlsx');
  }

  cleanPlaceholder(element: string, newMsg: string) {
    const nameFile = document.getElementById(element) as HTMLInputElement;
    nameFile.placeholder = `${newMsg}`;
  }

  exportExcelDecomiso() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataForfeiture, {
      skipHeader: true,
    });
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Hoja1');
    this.cleanPlaceholder('nameFileB', 'reporteDecomiso.xlsx');
    XLSX.writeFile(workBook, 'reporteDecomiso.xlsx');
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData<IExcelToJson>(binaryExcel);
      console.log('data excel: ', this.data);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  onSubmit() {
    this.cleanPlaceholder('nameFileA', 'Nombre del Archivo Excel (Entrega)');
    this.cleanPlaceholder('nameFileB', 'Nombre del Archivo Excel (Decomiso)');
    this.reporte_flag = false;
    this.reporte_flag2 = false;
    //Bandera cuando encuentre data
    //this.reporte_flag = true;

    this.flatFileGoodForm.patchValue({
      delegationReceives: this.proceduralHistoryForm.value.delegation,
      delegationManages: this.proceduralHistoryForm2.value.delegation,
    });

    if (this.isFormValid()) {
      if (this.flatFileGoodForm.valid) {
        this.fechaF = this.flatFileGoodForm.get('finalDate').value + 1;
        this.fechaF = new Date(this.flatFileGoodForm.get('finalDate').value);
        this.fechaF.setDate(this.fechaF.getDate() + 1);
        this.FinalDate = this.formatDate(this.fechaF);
      }
      if (!this.validarFechas()) {
        this.getPupLanzaReporte();
        this.getPupLanzaReporte2();
      }
    }
  }

  getPupLanzaReporte() {
    let data = {
      diParam2: this.flatFileGoodForm.get('area').value,
      tiParam1: this.flatFileGoodForm.get('type').value,
      tiParam5: this.formatDate(this.flatFileGoodForm.get('initialDate').value),
      tiParam6: this.formatDate(this.flatFileGoodForm.get('finalDate').value),
      fecFi: this.FinalDate,
      noDeleg: this.flatFileGoodForm.get('delegationReceives').value,
      noAdmin: this.flatFileGoodForm.get('delegationManages').value,
    };
    this.proceedingsService.pupLaunchesReport(data).subscribe({
      next: response => {
        if (response !== null) {
          //console.log('data resp -> ', response);
          //this.onLoadToast('success', 'success', response);
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i] != undefined) {
              this.reporte_flag = true;
              this.loading = true;
              const Array = response.data[i].uno.split('~');
              this.dataDelivery.push(Array);
            }
          }
          this.cleanPlaceholder('nameFileA', 'reporteEntrega.xlsx');
        }

        //console.log("dataDelivery -> ",this.dataDelivery);
      },
      error: err => {
        this.flag_report = false;
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast(
            'error',
            'Reporte Entrega',
            'No se encontró información'
          );
        }
      },
    });
  }

  getPupLanzaReporte2() {
    let data = {
      diParam2: this.flatFileGoodForm.get('area').value,
      tiParam1: this.flatFileGoodForm.get('type').value,
      tiParam5: this.formatDate(this.flatFileGoodForm.get('initialDate').value),
      tiParam6: this.formatDate(this.flatFileGoodForm.get('finalDate').value),
      fecFi: this.FinalDate,
      noDeleg: this.flatFileGoodForm.get('delegationReceives').value,
      noAdmin: this.flatFileGoodForm.get('delegationManages').value,
    };
    //console.log('data end -> ', data);
    this.proceedingsService.pupLaunchesReport2(data).subscribe({
      next: response => {
        if (response !== null) {
          //console.log('data resp 2 -> ', response);
          //this.onLoadToast('success', 'success', response);
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i] != undefined) {
              this.reporte_flag2 = true;
              this.loading = true;
              const Array = response.data[i].uno.split('~');
              this.dataForfeiture.push(Array);
            }
          }
          this.cleanPlaceholder('nameFileB', 'reporteDecomiso.xlsx');
        }

        //console.log("dataDelivery -> ",this.dataForfeiture);
      },
      error: err => {
        this.flag_report = false;
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
          this.onLoadToast('error', 'Error', error);
        } else {
          this.onLoadToast(
            'error',
            'Reporte Decomiso',
            'No se encontró información'
          );
        }
      },
    });
  }

  onSubmit2() {
    if (!this.validarFechas()) {
      if (this.flatFileGoodForm.valid) {
        console.log('data -> ', this.flatFileGoodForm.value);
      }
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
              //window.open(pdfurl, 'DOCUMENT');
            },
            error: () => {
              //window.open(pdfurl, 'DOCUMENT');
            },
          });
      }, 4000);
    }
  }

  validarFechas(): boolean {
    this.dateI = this.flatFileGoodForm.value.initialDate;
    this.dateF = this.flatFileGoodForm.value.finalDate;
    if (this.dateF < this.dateI) {
      this.onLoadToast('error', 'Rango de fechas erróneo');
      return true;
    }
    return false;
  }

  isFormValid(): boolean {
    const formControls = this.flatFileGoodForm.controls;
    let isValid = true;
    Object.keys(formControls).forEach(controlName => {
      const control = formControls[controlName];

      if (!control.valid) {
        control.markAsTouched();
        isValid = false;
      }
    });

    return isValid;
  }

  getUsers($params: ListParams) {
    console.log($params);
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    params.addFilter('name', $params.text, SearchFilter.LIKE);
    this.usersService.getAllSegUsers(params.getParams()).subscribe({
      next: data => {
        data.data.map(user => {
          user.userAndName = `${user.id}- ${user.name}`;
          user.id = user.id;
          //console.log('user ', user);
          return user;
        });
        this.users$ = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.users$ = new DefaultSelect();
      },
    });
  }

  loadDelegation(name: string) {
    if (name == 'Recibe') {
      this.flatFileGoodForm.patchValue({
        delegationReceives: this.proceduralHistoryForm.value.delegation,
      });
    }
    if (name == 'Administra') {
      this.flatFileGoodForm.patchValue({
        delegationManages: this.proceduralHistoryForm2.value.delegation,
      });
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }
}
