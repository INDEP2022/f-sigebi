import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { downloadReport, showToast } from 'src/app/common/helpers/helpers';

@Component({
  selector: 'app-bank-accounts-insured',
  templateUrl: './bank-accounts-insured.component.html',
  styles: [],
})
export class BankAccountsInsuredComponent {
  form = new FormGroup({
    delegation: new FormControl(null, [Validators.required]),
    subdelegation: new FormControl(null, [Validators.required]),
    currency: new FormControl(null, [Validators.required]),
    bank: new FormControl(null, [
      Validators.required,
      // Validators.pattern(STRING_PATTERN),
    ]),
    depositFrom: new FormControl(null, Validators.required),
    depositTo: new FormControl(null, Validators.required),
  });

  isLoading = false;
  maxDate = new Date();
  constructor() {}

  print(): void {
    if (this.form.invalid) {
      showToast({
        icon: 'error',
        title: 'Error de validacion',
        text: 'Favor de llenar los campos requeridos',
      });
      this.form.markAllAsTouched();
      return;
    }

    const { depositFrom, depositTo } = this.form.value;
    if (!this.validateDateRange(depositFrom, depositTo)) {
      showToast({
        icon: 'error',
        title: 'Error de fechas',
        text: 'Rango de fechas no válido',
      });
      return;
    }

    downloadReport('SIAB/RCONCOGVOLANTESRE', this.form.value);
    this.isLoading = false;
  }

  validateDateRange(from: Date, to: Date): boolean {
    if (from && to) {
      return from <= to;
    }
    return true;
  }
}
