import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  IDocumentDetails,
  IRDictationDoc,
} from 'src/app/core/models/ms-dictation/r-dictation-doc.model';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-edit-documents-modal',
  templateUrl: './edit-documents-modal.component.html',
  styles: [],
})
export class EditDocumentsModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  documents: IRDictationDoc;

  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('info de los documentos', this.documents);
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      key: [this.documents.cveDocument],
      description: [
        (this.documents.documentDetails as IDocumentDetails).description,
      ],
      dateReceipt: [null, Validators.required],
    });
    if (this.documents != null) {
      this.edit = true;
      this.form.patchValue(this.documents);
    }
  }

  close() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  save() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
