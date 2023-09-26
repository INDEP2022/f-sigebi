import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodSpentService } from 'src/app/core/services/ms-spent/good-spent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-costs-resume',
  templateUrl: './costs-resume.component.html',
  styles: [],
})
export class CostsResumeComponent extends BasePage implements OnInit {
  form: FormGroup;
  public concepts = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private expenseService: GoodSpentService,
    private datePipe: DatePipe,
    private jasperService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      gasto: [null, Validators.required],
      al: [null, Validators.required],
      startDate: [null, Validators.required],
      finishDate: [null, Validators.required],
    });
  }

  getCostConcept(params: ListParams) {
    this.expenseService.getExpenseConcept(params).subscribe(data => {
      this.concepts = new DefaultSelect(data.data, data.count);
    });
  }
  /*send() {
    this.loading = true;
    const pdfurl =
      `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RRESUMENCOSTOS.pdf?PARAMFORM=NO&Concepto1=` +
      this.form.controls['gasto'].value +
      `&Concepto2=` +
      this.form.controls['al'].value +
      `&Fecha1=` +
      this.datePipe.transform(
        this.form.controls['startDate'].value,
        'dd-mm-yyyy'
      ) +
      `&Fecha2=` +
      this.datePipe.transform(
        this.form.controls['finishDate'].value,
        'dd-mm-yyyy'
      );
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    let params = { ...this.form.value };
    for (const key in params) {
      if (params[key] === null) delete params[key];
    }
    this.onLoadToast('success', '', 'Reporte generado');
    this.loading = false;
  }*/

  send() {
    let params = {
      Concepto1: this.form.controls['gasto'].value,
      Concepto2: this.form.controls['al'].value,
      Fecha1: this.datePipe.transform(
        this.form.controls['startDate'].value,
        'dd-MM-yyyy'
      ),
      Fecha2: this.datePipe.transform(
        this.form.controls['finishDate'].value,
        'dd-MM-yyyy'
      ),
    };

    console.log('param -> ', params);

    this.jasperService
      //.fetchReport('RRESUMENCOSTOS', params)
      .fetchReportBlank('blank')
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          // this.onLoadToast('success', '', 'Reporte generado');
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }
}
