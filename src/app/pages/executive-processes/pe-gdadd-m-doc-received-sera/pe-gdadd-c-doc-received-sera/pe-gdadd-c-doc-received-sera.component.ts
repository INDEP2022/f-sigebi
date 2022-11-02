import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

import { maxDate } from 'src/app/common/validations/date.validators';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pe-gdadd-c-doc-received-sera',
  templateUrl: './pe-gdadd-c-doc-received-sera.component.html',
  styles: [],
})
export class PeGdaddCDocReceivedSeraComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();
  today: Date;
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: [null],
      subdelegation: [null],
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
    });
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
