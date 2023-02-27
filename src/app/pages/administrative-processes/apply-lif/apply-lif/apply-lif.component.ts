import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-apply-lif',
  templateUrl: './apply-lif.component.html',
  styles: [],
})
export class ApplyLifComponent extends BasePage implements OnInit {
  public form: FormGroup;
  public disabled: boolean = true;

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.handleForm();
  }

  public handleForm(): void {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      description: [
        '',
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      status: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      noRecord: [null, Validators.required],
      identifier: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      processExtDom: [
        '',
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      noConversions: [null, Validators.required],
      noBienNum: [null, Validators.required],
      statusBien: ['', Validators.required, Validators.pattern(STRING_PATTERN)],
      date: ['', [Validators.required]],
      price: [null, Validators.required],
      spend: [null, [Validators.required]],
      totalIva: [null],
      total: [null],
    });
  }

  public send() {
    console.log(this.form.value);
    this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/s.pdf?NO_BIEN=` + this.form.controls['noBien'].value +
    //   `&DESCRIPCION=` + this.form.controls['description'].value +
    //   `&ESTATUS=` + this.form.controls['status'].value +
    //   `&NO_EXPEDIENTE=` + this.form.controls['noRecord'].value +
    //   `&IDENTIFICADOR=` + this.form.controls['identifier'].value +
    //   `&PROCESO_EXT_DOM=` + this.form.controls['processExtDom'].value +
    //   `&CONT_CONV=` + this.form.controls['noConversions'].value +
    //   `&NO_BIEN=` + this.form.controls['noBienNum'].value +
    //   `&ESTATUS=` + this.form.controls['statusBien'].value +
    //   `&FEC_CAMBIO=` +
    //   this.datePipe.transform(
    //     this.form.controls['date'].value,
    //     'dd-mm-yyyy'
    //   ) +
    //   `&VAL2=` + this.form.controls['price'].value;
    // `&VAL13=` + this.form.controls['spend'].value;
    // `&VAL10=` + this.form.controls['totalIva'].value;
    // `&T_TOTAL=` + this.form.controls['total'].value;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }
}
