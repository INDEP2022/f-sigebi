import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { downloadReport, showToast } from 'src/app/common/helpers/helpers';
// import { type ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITvalTable5 } from 'src/app/core/models/catalogs/tval-Table5.model';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-effective-numerary-reconciliation',
  templateUrl: './effective-numerary-reconciliation.component.html',
  styles: [],
})
export class EffectiveNumeraryReconciliationComponent {
  form: FormGroup = new FormGroup({
    delegation: new FormControl('', [
      Validators.required,
      // Validators.pattern(STRING_PATTERN),
    ]),
    subdelegation: new FormControl('', [
      Validators.required,
      // Validators.pattern(STRING_PATTERN),
    ]),
    currency: new FormControl('', [
      Validators.required,
      // Validators.pattern(STRING_PATTERN),
    ]),
    bank: new FormControl('', [
      Validators.required,
      // Validators.pattern(STRING_PATTERN),
    ]),
    fileFrom: new FormControl('', Validators.required),
    fileTo: new FormControl('', Validators.required),
    from: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
  });
  isLoading = false;
  maxDate = new Date();
  currencies = new DefaultSelect<ITvalTable5>([], 0);
  constructor(private tableServ: TvalTable5Service) {}

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

    const params = new URLSearchParams(this.form.value);
    console.log(params.toString());
    this.isLoading = true;
    // const url = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONCOGVOLANTESRE.pdf`
    // // ?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);
    // const linkSource = `${url}?${params.toString()}`;
    // const downloadLink = document.createElement('a');
    // downloadLink.href = linkSource;
    // downloadLink.target = '_blank';
    // downloadLink.click();
    // this.onLoadToast('success', '', 'Reporte generado');
    console.log(this.form.value);
    downloadReport('SIAB/RCONCOGVOLANTESRE', this.form.value);
    this.isLoading = false;
  }

  // getCurrency(params: ListParams): void {
  //   this.tableServ.getById4(3, params).subscribe({
  //     next: res => {
  //       this.currencies = new DefaultSelect<ITvalTable5>(res.data, 0);
  //     },
  //     error: err => {
  //       let error = '';
  //       if (err.status === 0) {
  //         error = 'Revise su conexión de Internet.';
  //       } else {
  //         error = err.message;
  //       }
  //       showToast({ icon: 'error', title: 'Error', text: error });
  //     },
  //   });
  // }

  // onCurrencyChange(event: any): void {}

  validateDateRange(from: Date, to: Date): boolean {
    if (from && to) {
      return from <= to;
    }
    return true;
  }

  isValidDates(): boolean {
    const { fileFrom, fileTo, from, to } = this.form.value;
    if (
      !this.validateDateRange(fileFrom, fileTo) ||
      !this.validateDateRange(from, to)
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
