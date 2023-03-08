import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-responsibility-letters-report',
  templateUrl: './responsibility-letters-report.component.html',
  styles: [],
})
export class ResponsibilityLettersReportComponent
  extends BasePage
  implements OnInit
{
  goodList: any;
  dataGood: any;
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      description: {
        title: 'Descripcion',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  setting2 = {
    ...this.settings,
    actions: false,
    columns: { ...PAY_RECEIPT_REPORT_COLUMNS },
  };

  data = EXAMPLE_DATA;
  form: FormGroup;

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getGood();
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      adjudicatorio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      domicilio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      colonia: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegacion: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      cp: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      // puesto: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      parrafo1: [null, [Validators.pattern(STRING_PATTERN)]],
      parrafo2: [null, [Validators.pattern(STRING_PATTERN)]],
      parrafo3: [null, [Validators.pattern(STRING_PATTERN)]],
      bienes: [null],
    });
  }

  confirm(): void {
    // console.log(this.reportForm.value);
    // let params = { ...this.form.value };
    // for (const key in params) {
    //   if (params[key] === null) delete params[key];
    // }
    let params = {
      DESTYPE: this.form.controls['evento'].value,
      DOMICILIO: this.form.controls['domicilio'].value,
      ID_LOTE: this.form.controls['lote'].value,
      COLONIA: this.form.controls['colonia'].value,
      DELEGACION: this.form.controls['delegacion'].value,
      ESTADO: this.form.controls['estado'].value,
      CP: this.form.controls['cp'].value,
      PARRAFO1: this.form.controls['parrafo1'].value,
      ADJUDICATARIO: this.form.controls['adjudicatorio'].value,
      PARRAFO2: this.form.controls['parrafo2'].value,
      PARRAFO3: this.form.controls['parrafo3'].value,
    };
    console.log(params);
    // open the window
    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);

    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FCOMERCARTARESP.pdf?DESTYPE=${params.DESTYPE}&DOMICILIO=${params.DOMICILIO}&ID_LOTE=${params.ID_LOTE}&COLONIA=${params.COLONIA}&DELEGACION=${params.DELEGACION}&ESTADO=${params.ESTADO}&CP=${params.CP}&PARRAFO1=${params.PARRAFO1}&ADJUDICATARIO=${params.ADJUDICATARIO}&PARRAFO2=${params.PARRAFO2}&PARRAFO3=${params.PARRAFO3}`;
    const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    window.open(pdfurl, 'FCOMERCARTARESP.pdf');
    this.loading = false;
    this.cleanForm();
  }
  cleanForm(): void {
    this.form.reset();
  }
  getGood() {
    this.loading = true;
    this.reportService.getGood().subscribe({
      next: data => {
        this.goodList = data;
        this.dataGood = this.goodList.data;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}

const EXAMPLE_DATA = [
  {
    description: 'Comercialización',
  },
  {
    description: 'Siap',
  },
  {
    description: 'Entrega de bienes',
  },
  {
    description: 'Inmuebles',
  },
  {
    description: 'Muebles',
  },
  {
    description: 'Importaciones',
  },
  {
    description: 'Enajenación',
  },
  {
    description: 'Lícito de bienes',
  },
];
export const PAY_RECEIPT_REPORT_COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción del Bien',
    sort: false,
  },
  numRegister: {
    title: 'Numero de registro',
    sort: false,
  },
};
