import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//BasePage
import { DatePipe } from '@angular/common';
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
      date3: [null, Validators.required],
      noBien: [null, Validators.required],
      // PC_INDI: [null],
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
      PF_FECUNO: new DatePipe('en-EN').transform(this.event, 'dd/MM/yyyy'),
      PF_FECDOS: new DatePipe('en-EN').transform(this.event, 'dd/MM/yyyy'),
      PN_BIEN: this.form.controls['noBien'].value,
      PF_FECTRE: new DatePipe('en-EN').transform(this.event, 'dd/MM/yyyy'),
      // PC_INDI: this.form.controls['PC_INDI'].value,
    };

    //this.showSearch = true;
    console.log(params);

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONADBINFORFINAN.pdf?PF_FECUNO=${params.PF_FECUNO}&PF_FECDOS=${params.PF_FECDOS}&PN_BIEN=${params.PN_BIEN}&PF_FECTRE=${params.PF_FECTRE}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdfttps://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'RCONADBINFORFINAN.pdf');
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
