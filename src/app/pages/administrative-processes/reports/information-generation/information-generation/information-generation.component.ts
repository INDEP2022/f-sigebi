import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';

@Component({
  selector: 'app-information-generation',
  templateUrl: './information-generation.component.html',
  styles: [],
})
export class InformationGenerationComponent implements OnInit {
  informationGenerationForm: ModelForm<any>;
  constructor(private fb: FormBuilder, private siabService: SiabService) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.informationGenerationForm = this.fb.group({
      dateDe: [null, Validators.required],
      dateA: [null, Validators.required],
    });
  }
  onSubmit() {
    // Log y url con parámetros quemados
    console.log(this.informationGenerationForm.value);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGENADBSITPROCESB.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);

    // Crea enlace de etiqueta anchor con js
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';

    let params = { ...this.informationGenerationForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    setTimeout(() => {
      this.siabService
        .getReport(SiabReportEndpoints.FGENADBSITPROCESB, params)
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
