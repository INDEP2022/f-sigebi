import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDocumentsDictumXStateM } from 'src/app/core/models/ms-documents/documents-dictum-x-state-m';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-documentation-goods-dialog',
  templateUrl: './documentation-goods-dialog.component.html',
  styles: [],
})
export class DocumentationGoodsDialogComponent
  extends BasePage
  implements OnInit
{
  documentsDictumXStateMForm: ModelForm<IDocumentsDictumXStateM>;
  documentsDictumXStateM: IDocumentsDictumXStateM | any;

  title: string = 'Documentación de bien';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private documentService: DocumentsDictumStatetMService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.documentsDictumXStateMForm = this.fb.group({
      officialNumber: [null],
      typeDictum: ['', Validators.required],
      expedientNumber: [null, Validators.required],
      stateNumber: [null, Validators.required],
      key: ['', Validators.required],
      dateReceipt: [null],
      userReceipt: [''],
      insertionDate: [null],
      userInsertion: [''],
      notificationDate: [null],
      secureKey: [null],
    });

    if (this.documentsDictumXStateM != null) {
      console.log(this.documentsDictumXStateM);
      this.edit = true;
      this.documentsDictumXStateMForm.patchValue(this.documentsDictumXStateM);
      this.documentsDictumXStateMForm
        .get('key')
        .patchValue(this.documentsDictumXStateM.key.key);
      this.documentsDictumXStateMForm
        .get('expedientNumber')
        .patchValue(this.documentsDictumXStateM.expedientNumber.id);
      this.documentsDictumXStateMForm
        .get('stateNumber')
        .patchValue(this.documentsDictumXStateM.stateNumber.id);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    const data: IDocumentsDictumXStateM = this.documentsDictumXStateMForm.value;

    this.documentService
      .create(this.documentsDictumXStateMForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;

    this.documentService
      .update(this.documentsDictumXStateMForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
