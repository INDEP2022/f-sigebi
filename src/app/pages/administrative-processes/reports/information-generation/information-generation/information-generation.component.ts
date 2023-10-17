import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ReportgoodService } from 'src/app/core/services/ms-reportgood/reportgood.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-information-generation',
  templateUrl: './information-generation.component.html',
  styles: [],
})
export class InformationGenerationComponent extends BasePage implements OnInit {
  //informationGenerationForm: ModelForm<any>;
  informationGenerationForm: FormGroup = new FormGroup({});
  minDate: Date;
  maxDate: Date = new Date();
  endDate: Date;
  constructor(
    private fb: FormBuilder,
    private siabService: SiabService,
    private reportgoodService: ReportgoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.informationGenerationForm = this.fb.group({
      dateDe: [null, [Validators.required]],
      dateA: [null, [Validators.required]],
    });
    this.informationGenerationForm.get('dateA').disable();
  }
  /*onSubmit() {
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
  }*/
  validateDate(event: Date) {
    //console.log(event);
    if (event) {
      this.minDate = event;
      this.informationGenerationForm.get('dateA').enable();
    }
  }

  async report() {
    this.endDate = this.informationGenerationForm.get('dateA').value;
    const dateFormat = this.obtenerFormatoDeseado();
    console.log(dateFormat);
    let count = await this.getReporReg(dateFormat, new ListParams());
    let countData: any = count;
    const resul = countData.count;
    if (resul != 0) {
      this.alertQuestion(
        'warning',
        'Eliminar',
        '¿El mes ya tiene un proceso, se regenera?'
      ).then(question => {
        if (question.isConfirmed) {
          this.launchProcess();
        }
      });
    } else {
      this.launchProcess();
    }
  }

  obtenerFormatoDeseado(): string {
    const anio = this.endDate.getFullYear();
    const mes = (this.endDate.getMonth() + 1).toString().padStart(2, '0');
    const format = anio + mes;
    return format;
  }

  /*async getReporReg(keyDate: string, params: ListParams){
    params['filter.process'] = `$eq:${keyDate}`;
    return firstValueFrom(
      this.reportgoodService.getReportGood(params).pipe(
        catchError(error => {
          return of(null);
        }),
        map(resp => resp.count)
      )
    );
  }*/

  async getReporReg(keyDate: string, params: ListParams) {
    return new Promise((resolve, reject) => {
      params['filter.process'] = `$eq:${keyDate}`;
      this.reportgoodService.getReportGood(params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  launchProcess() {}
}
