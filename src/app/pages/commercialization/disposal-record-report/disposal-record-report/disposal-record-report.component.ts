import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
@Component({
  selector: 'app-disposal-record-report',
  templateUrl: './disposal-record-report.component.html',
  styles: [],
})
export class DisposalRecordReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  today: Date;
  maxDate: Date;
  minDate: Date;

  pdfurl =
    'http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf';

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      // noFile: [null],
      PN_EXPINI: [null, [Validators.required]],
      PN_EXPFIN: [null, [Validators.required]],
      noActa: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      PF_ELABIN: [null, [Validators.required]],
      PF_ELABFIN: [null, [Validators.required]],
      PN_ACTAINI: [null, [Validators.required]],
      PN_ACTAFIN: [null, [Validators.required]],
    });
  }
  confirm() {
    let params = {
      PN_DELEGACION: this.form.controls['delegation'].value,
      PN_SUBDELEGACION: this.form.controls['subdelegation'].value,
      PN_EXPINI: this.form.controls['PN_EXPINI'].value,
      PN_EXPFIN: this.form.controls['PN_EXPFIN'].value,
      PC_ACTA: this.form.controls['noActa'].value,
      PF_ELABIN: this.form.controls['PF_ELABIN'].value,
      PF_ELABFIN: this.form.controls['PF_ELABFIN'].value,
      PN_ACTAINI: this.form.controls['PN_ACTAINI'].value,
      PN_ACTAFIN: this.form.controls['PN_ACTAFIN'].value,
      // noFile: this.form.controls['noFile'].value,
    };

    console.log(params);
    const startEx = new Date(this.form.get('PN_EXPINI').value);
    const endEx = new Date(this.form.get('PN_EXPFIN').value);

    const startAc = new Date(this.form.get('PN_ACTAINI').value);
    const endAc = new Date(this.form.get('PN_ACTAFIN').value);

    const startEl = new Date(this.form.get('PF_ELABIN').value);
    const endEl = new Date(this.form.get('PF_ELABFIN').value);

    if (endEx < startEx) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'fecha final de expediente debe ser mayor a la fecha inicial'
      );
      return;
    }

    if (endAc < startAc) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'fecha final de acta debe ser mayor a la fecha inicial'
      );
      return;
    }

    if (endEl < startEl) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'fecha final de elaboración debe ser mayor a la fecha inicial'
      );
      return;
    }

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FGERDESACTAENAJEN.pdf?PN_DELEGACION=${params.PN_DELEGACION}&PN_SUBDELEGACION=${paramsPN_SUBDELEGACION}&PN_EXPINI=${params.PN_EXPINI}&PN_EXPFIN=${params.PN_EXPFIN}&PC_ACTA=${params.PC_ACTA}&PF_ELABIN=${params.PF_ELABIN}&PF_ELABFIN=${params.PF_ELABFIN}&PN_ACTAINI=${params.PN_ACTAINI}&PN_ACTAFIN=${params.PN_ACTAFIN}&PN_ACTAFIN=${params.PN_ACTAFIN}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'FGERDESACTAENAJEN.pdf');
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }

  cleanForm(): void {
    this.form.reset();
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }
}
