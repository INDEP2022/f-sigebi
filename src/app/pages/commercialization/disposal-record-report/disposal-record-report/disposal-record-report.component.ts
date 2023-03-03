import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { BasePage } from 'src/app/core/shared/base-page';
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

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

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
      noFile: [null, [Validators.required]],
      PN_EXPINI: [null, [Validators.required]],
      PN_EXPFIN: [null, [Validators.required]],
      noActa: [null, [Validators.required]],
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
    };
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
