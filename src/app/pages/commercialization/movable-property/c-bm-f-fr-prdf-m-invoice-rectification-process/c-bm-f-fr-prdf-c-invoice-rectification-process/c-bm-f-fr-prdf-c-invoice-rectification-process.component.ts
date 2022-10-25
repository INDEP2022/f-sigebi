import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { maxDate } from 'src/app/common/validations/date.validators';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { CBmFFrPrdfCNewImageModalComponent } from '../c-bm-f-fr-prdf-c-new-image-modal/c-bm-f-fr-prdf-c-new-image-modal.component';

@Component({
  selector: 'app-c-bm-f-fr-prdf-c-invoice-rectification-process',
  templateUrl: './c-bm-f-fr-prdf-c-invoice-rectification-process.component.html',
  styles: [
  ]
})
export class CBmFFrPrdfCInvoiceRectificationProcessComponent implements OnInit {

  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  form : FormGroup = new FormGroup ({});

  constructor(private modalRef: BsModalRef, private fb:FormBuilder, private modalService: BsModalService,  private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.form = this.fb.group({
      idOficio: [null, [Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),]],
      ExpDate: [null, [Validators.required, maxDate(new Date()),]],
      serie: [null, [Validators.required]],
      invoiceFolio: [null, [Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),]],
      name: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      motherlastName: [null, [Validators.required]],
      agent: [null, [Validators.required]],

      idInvoice: [null, [Validators.required,
          Validators.maxLength(10),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),]],
      time: [null, [Validators.required,  maxDate(new Date())]],
      paragraph1: [null, [Validators.required]],
      paragraph2: [null, [Validators.required]],
      paragraph3: [null, [Validators.required]],
      paragraph4: [null, [Validators.required]],
      paragraph5: [null, [Validators.required]],

      idCapture: ['', [Validators.required]],
      idAuth: ['', [Validators.required]],
      idSol: ['', [Validators.required]],
    })
  }

  openModal(): void {
    const modalRef = this.modalService.show(CBmFFrPrdfCNewImageModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
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
