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
  event: Date = new Date();
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
      date3: [null],
      noBien: [null, Validators.required],
      PC_INDI: [null],
    });
  }
  confirm(): void {
    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    let params = {
      PF_FECUNO: this.event.toLocaleDateString('es-ES'),
      PF_FECDOS: this.event.toLocaleDateString('es-ES'),
      PN_BIEN: this.form.controls['noBien'].value,
      PC_ATRI: this.form.controls['date3'].value,
      PC_INDI: this.form.controls['PC_INDI'].value,
    };

    //this.showSearch = true;
    console.log(params);

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONADBRESUMFIAN.pdf?PF_FECUNO=${params.PF_FECUNO}&PF_FECDOS=${params.PF_FECDOS}&PN_BIEN=${params.PN_BIEN}&PC_ATRI=${params.PC_ATRI}&PC_INDI=${params.PC_INDI}`;
    //const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
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
