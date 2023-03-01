import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SweetalertModel } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-effective-numerary-reconciliation',
  templateUrl: './effective-numerary-reconciliation.component.html',
  styles: [],
})
export class EffectiveNumeraryReconciliationComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  // total = '22,568.22';
  maxDate: Date = new Date();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subdelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      bank: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],

      fileFrom: [null, Validators.required],
      fileTo: [null, Validators.required, this.validateRangeDate('fileFrom')],
      from: [null, Validators.required],
      to: [null, Validators.required, this.validateRangeDate('from')],
      // total: [null, Validators.required],
    });
  }

  validateRangeDate(toName: string): ValidatorFn {
    return (abstractControl: AbstractControl): ValidationErrors | null => {
      const from = abstractControl.value;
      const to = this.form.get(toName).value;
      if (from && to && from > to) {
        return { rangeDate: true };
      }
      return null;
    };
  }

  print(): void {
    this.isLoading = true;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONCOGVOLANTESRE.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    //console.log(linkSource);
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();

    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.isLoading = false;
  }

  protected onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
    let sweetalert = new SweetalertModel();
    sweetalert.toast = true;
    sweetalert.position = 'top-end';
    sweetalert.timer = 6000;
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    Swal.fire(sweetalert);
  }
}
