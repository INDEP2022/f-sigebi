import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//BasePage

import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-financial-information-report',
  templateUrl: './financial-information-report.component.html',
  styles: [],
})
export class FinancialInformationReportComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      date1: [null, Validators.required],
      date2: [null, Validators.required],
      // date3: [null, Validators.required],
      noBien: [null, Validators.required],
      // PC_INDI: [null, Validators.required],
    });
  }
  confirm(): void {
    let params = {
      PF_FECUNO: this.form.controls['date1'].value,
      PF_FECDOS: this.form.controls['date2'].value,
      PN_BIEN: this.form.controls['noBien'].value,
      // PC_ATRI: this.form.controls['date3'].value,
      // PC_INDI: this.form.controls['PC_INDI'].value,
    };

    //this.showSearch = true;
    console.log(params);
    const start = new Date(this.form.get('date1').value);
    const end = new Date(this.form.get('date2').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    if (end < start) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Fecha final no puede ser menor a fecha de inicio'
      );
      return;
    }

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONADBRESUMFIAN.pdf?PF_FECUNO=${params.PF_FECUNO}&PF_FECDOS=${paramsPF_FECDOS}&PN_BIEN=${params.PN_BIEN}&PC_ATRI=${params.PC_ATRI}&PC_INDI=${params.PC_INDI}`;
    const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'RCONADBRESUMFIAN.pdf');
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }

  cleanForm(): void {
    this.form.reset();
  }
}
