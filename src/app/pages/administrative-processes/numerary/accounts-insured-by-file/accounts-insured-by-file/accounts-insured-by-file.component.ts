import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { downloadReport, showToast } from 'src/app/common/helpers/helpers';

@Component({
  selector: 'app-accounts-insured-by-file',
  templateUrl: './accounts-insured-by-file.component.html',
  styles: [],
})
export class AccountsInsuredByFileComponent {
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
    fileFrom: new FormControl(null, Validators.required),
    fileTo: new FormControl(null, Validators.required),
  });
  isLoading = false;
  maxDate = new Date();
  constructor() {}

  print(): void {
    if (this.form.invalid) {
      showToast({
        icon: 'error',
        title: 'Error de validación',
        text: 'Favor de llenar los campos requeridos',
      });
      this.form.markAllAsTouched();
      return;
    }

    if (!this.isValidDates()) {
      return;
    }
    this.isLoading = true;
    downloadReport('SIAB/RCONCOGVOLANTESRE', this.form.value);
    this.isLoading = false;
  }

  validateDateRange(from: Date, to: Date): boolean {
    if (from && to) {
      return from <= to;
    }
    return true;
  }

  isValidDates(): boolean {
    const { fileFrom, fileTo, depositFrom, depositTo } = this.form.value;
    if (
      !this.validateDateRange(fileFrom, fileTo) ||
      !this.validateDateRange(depositFrom, depositTo)
    ) {
      showToast({
        icon: 'error',
        title: 'Error de fechas',
        text: 'Rango de fechas no válido',
      });
      return false;
    }
    return true;
  }
}
