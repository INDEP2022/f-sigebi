import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SiabReportEndpoints } from 'src/app/common/constants/endpoints/siab-reports-endpoints';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-concentrate-goods-type',
  templateUrl: './concentrate-goods-type.component.html',
  styles: [],
})
export class ConcentrateGoodsTypeComponent implements OnInit {
  concentrateGoodsTypeForm: ModelForm<any>;
  constructor(private fb: FormBuilder, private siabService: SiabService) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.concentrateGoodsTypeForm = this.fb.group({
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subDelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      area: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      type: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      initialFile: [null, Validators.required],
      finalFile: [null, Validators.required],
      ReceptionDateOf: [null, Validators.required],
      ReceptionDateTo: [null, Validators.required],
    });
  }
  onSubmit() {
    // Log y url con parámetros quemados
    console.log(this.concentrateGoodsTypeForm.value);
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGERADBDEVDECBIEN.pdf?PN_VOLANTEFIN=70646&P_IDENTIFICADOR=0`; //window.URL.createObjectURL(blob);

    // Crea enlace de etiqueta anchor con js
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';

    let params = { ...this.concentrateGoodsTypeForm.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }

    setTimeout(() => {
      this.siabService
        .getReport(SiabReportEndpoints.FGERADBDEVDECBIEN, params)
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
