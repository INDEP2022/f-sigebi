import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styles: [],
})
export class VaultsComponent implements OnInit {
  vaultsForm: ModelForm<any>;
  constructor(private fb: FormBuilder, private siabService: SiabService) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.vaultsForm = this.fb.group({
      regional: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      vaults: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      statusGoods: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      entryDateFrom: [null, Validators.required],
      until: [null, Validators.required],
      departureDateOf: [null, Validators.required],
      until1: [null, Validators.required],
    });
  }
  onSubmit() {
    // Log y url con parámetros quemados
    console.log(this.vaultsForm.value);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGERADBBOVEDAS.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);

    // Crea enlace de etiqueta anchor con js
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';

    let params = { ...this.vaultsForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    setTimeout(() => {
      this.siabService
        .getReport(SiabReportEndpoints.FGERADBBOVEDAS, params)
        .subscribe({
          next: response => {
            console.log(response);
            window.open(pdfurl, 'DOCUMENT');
          },
          error: () => {
            window.open(pdfurl, 'DOCUMENT');
          },
        });
    }, 1000);
  }
}
