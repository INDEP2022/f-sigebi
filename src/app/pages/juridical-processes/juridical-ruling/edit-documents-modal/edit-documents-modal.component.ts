import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  typeDictation: any;
  stateNumber: any;
  edit: boolean = false;
  dateValid: any;
  maxDate: any;
  minDate: any;
  @Output() dataText = new EventEmitter<any>();

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    if (
      this.typeDictation == 'PROCEDENCIA' ||
      this.typeDictation == 'DECOMISO' ||
      this.typeDictation == 'EXT_DOM' ||
      this.typeDictation == 'TRANSFERENTE'
    ) {
      this.minDate = this.dateValid;
      this.maxDate = new Date();
    }

    if (
      this.typeDictation == 'DESTINO' ||
      this.typeDictation == 'DESTRUCCION' ||
      this.typeDictation == 'DONACION'
    ) {
      this.maxDate = new Date();
      this.minDate = this.dateValid;
    }
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
    // this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  save() {
    console.log('VALUE', this.form.value);
    const today = new Date(this.form.value.dateReceipt);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${year}-${month}-${day}`;
    let obj = {
      date: SYSDATE,
      cve: this.form.value.key,
    };
    this.dataText.emit(obj);
    // this.modalRef.content.callback(this.form.value);
    this.modalRef.hide();
  }
}
