import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-numerary-operator',
  templateUrl: './numerary-operator.component.html',
  styles: [],
})
export class NumeraryOperatorComponent extends BasePage implements OnInit {
  public numeraryForm: FormGroup;

  public get startedDate(): AbstractControl {
    return this.numeraryForm.get('startedDate');
  }
  public get finishedDate(): AbstractControl {
    return this.numeraryForm.get('finishedDate');
  }

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  public buildForm(): void {
    this.numeraryForm = this.fb.group({
      startedDate: ['', Validators.required],
      finishedDate: ['', Validators.required],
    });
  }

  public send(): void {
    this.loading = true;
    console.log(this.numeraryForm.value);
    // const pdfurl =
    //   `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGENADBNUMERARIOP.pdf?PARAMFORM=NO&PF_INI=` +
    //   this.datePipe.transform(
    //     this.numeraryForm.controls['startedDate'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&PF_FIN=` +
    //   this.datePipe.transform(
    //     this.numeraryForm.controls['finishedDate'].value,
    //     'dd-mm-yyyy'
    //   );
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.numeraryForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }
}
