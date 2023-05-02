import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';

import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-report-doc-received',
  templateUrl: './report-doc-received.component.html',
  styles: [],
})
export class ReportDocReceivedComponent extends BasePage implements OnInit {
  today: Date;

  form: FormGroup = new FormGroup({});

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private siabService: SiabService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      report: [false],
    });
  }

  confirm(): void {
    this.loading = true;
    const rangeDate = this.form.controls['rangeDate'].value;
    const detailReport = this.form.controls['report'].value;

    const startTemp = `${rangeDate[0].getFullYear()}-${
      rangeDate[0].getUTCMonth() + 1 <= 9 ? 0 : ''
    }${rangeDate[0].getUTCMonth() + 1}-${
      rangeDate[0].getDate() <= 9 ? 0 : ''
    }${rangeDate[0].getDate()}`;

    const endTemp = `${rangeDate[1].getFullYear()}-${
      rangeDate[1].getUTCMonth() + 1 <= 9 ? 0 : ''
    }${rangeDate[1].getUTCMonth() + 1}-${
      rangeDate[1].getDate() <= 9 ? 0 : ''
    }${rangeDate[1].getDate()}`;

    const reportParams = {
      PF_FECINI: startTemp,
      PF_FECFIN: endTemp,
    };
    console.log(reportParams);
    //Todo: Get Real Report
    /*detailReport ? 
      this.getReport('RCONDIRREPORECDOD', reportParams) : 
      this.getReport('RCONDIRREPORECDOC', reportParams);*/
    this.getReportBlank('blank');
  }

  getReport(report: string, params: any): void {
    this.siabService.fetchReport(report, params).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No disponible', 'Reporte no disponible');
      },
    });
  }

  getReportBlank(report: string): void {
    this.siabService.fetchReportBlank(report).subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No disponible', 'Reporte no disponible');
      },
    });
  }

  cleanForm(): void {
    this.form.reset();
    this.form.controls['report'].setValue(false);
  }
}
