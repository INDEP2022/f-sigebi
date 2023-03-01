import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITvalTable5 } from 'src/app/core/models/catalogs/tval-Table5.model';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { SweetalertModel } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-bank-accounts-insured',
  templateUrl: './bank-accounts-insured.component.html',
  styles: [],
})
export class BankAccountsInsuredComponent {
  form = new FormGroup({
    delegation: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    subdelegation: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    currency: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    bank: new FormControl(null, [
      Validators.required,
      Validators.pattern(STRING_PATTERN),
    ]),
    depositFrom: new FormControl(null, Validators.required),
    depositTo: new FormControl(null, Validators.required),
  });

  // ngOnInit(): void {
  //   this.prepareForm();
  // }

  // prepareForm() {
  //   this.form = this.fb.group({
  //     delegation: [
  //       null,
  //       [Validators.required, Validators.pattern(STRING_PATTERN)],
  //     ],
  //     subdelegation: [
  //       null,
  //       [Validators.required, Validators.pattern(STRING_PATTERN)],
  //     ],

  //     currency: [
  //       null,
  //       [Validators.required, Validators.pattern(STRING_PATTERN)],
  //     ],
  //     bank: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],

  //     depositFrom: [null, Validators.required],
  //     depositTo: [null, Validators.required],
  //   });
  // }

  isLoading = false;
  maxDate = new Date();
  currencies = new DefaultSelect<ITvalTable5>([], 0);
  constructor(private tableServ: TvalTable5Service) {}

  print(): void {
    if (this.form.invalid) {
      this.onLoadToast('error', '', 'Favor de llenar los campos requeridos');
      this.form.markAllAsTouched();
      return;
    }

    const { depositFrom, depositTo } = this.form.value;
    if (!this.validateDateRange(depositFrom, depositTo)) {
      this.onLoadToast('error', '', 'Rango de fechas no válido');
      return;
    }

    const params = this.makeParams();
    console.log(params.toString());
    this.isLoading = true;
    const url = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCONCOGVOLANTESRE.pdf`;
    // ?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);
    const linkSource = `${url}?${params}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.click();
    this.onLoadToast('success', '', 'Reporte generado');
    this.isLoading = false;
  }

  makeParams(): string {
    return new URLSearchParams(this.form.value).toString();
  }

  onLoadToast(icon: SweetAlertIcon, title: string, text: string) {
    let sweetalert = new SweetalertModel();
    sweetalert.toast = true;
    sweetalert.position = 'top-end';
    sweetalert.timer = 6000;
    sweetalert.title = title;
    sweetalert.text = text;
    sweetalert.icon = icon;
    Swal.fire(sweetalert);
  }

  getCurrency(params: ListParams): void {
    this.tableServ.getById4(3, params).subscribe({
      next: res => {
        this.currencies = new DefaultSelect<ITvalTable5>(res.data, 0);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
    });
  }

  validateDateRange(from: Date, to: Date): boolean {
    if (from && to) {
      return from <= to;
    }
    return true;
  }
}
