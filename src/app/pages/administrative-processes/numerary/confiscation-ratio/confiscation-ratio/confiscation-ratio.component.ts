import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

@Component({
  selector: 'app-confiscation-ratio',
  templateUrl: './confiscation-ratio.component.html',
  styles: [],
})
export class ConfiscationRatioComponent implements OnInit {
  form: FormGroup;
  file: FormGroup;
  data: FormGroup;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      forfeitureKey: [null, Validators.required],
      check: [null, Validators.required],
      pgr: [null, Validators.required],
      ssa: [null, Validators.required],
      pjf: [null, Validators.required],
    });
    this.file = this.fb.group({
      recordRead: [null, Validators.required],
      recordsProcessed: [null, Validators.required],
      processed: [null, Validators.required],
      wrong: [null, Validators.required],
    });
    this.data = this.fb.group({
      noGood: [null, Validators.required],
      criminalCase: [null, Validators.required],
      preliminaryInvestigation: [null, Validators.required],
      dateTesofe: [null, Validators.required],
      jobTesofe: [null, Validators.required],
      authority: [null, Validators.required],
      dateTreasury: [null, Validators.required],
      dateJudgment: [null, Validators.required],
      appraisalValue: [null, Validators.required],
      interests: [null, Validators.required],
      results: [null, Validators.required],
      totalSeizures: [null, Validators.required],
    });
  }
  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }
}
