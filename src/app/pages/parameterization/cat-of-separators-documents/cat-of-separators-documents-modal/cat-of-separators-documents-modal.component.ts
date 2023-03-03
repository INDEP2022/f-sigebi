import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SeparatorsDocuments } from 'src/app/core/models/ms-documents/document-separators';
import { DocumentsSeparatorsService } from 'src/app/core/services/ms-documents-separators/documents-separators.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-cat-of-separators-documents-modal',
  templateUrl: './cat-of-separators-documents-modal.component.html',
  styles: [],
})
export class CatOfSeparatorsDocumentsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'SEPARADORES A DOCUMENTOS';
  edit: boolean = false;
  separatorsDocuments: SeparatorsDocuments;
  separatorsDocumentsModalForm: ModelForm<SeparatorsDocuments>;
  isDisabled = true;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private documentsSeparatorsService: DocumentsSeparatorsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.separatorsDocumentsModalForm = this.fb.group({
      key: [null, [Validators.required]],
      description: [null, [Validators.required]],
      numRegister: [null],
    });

    if (this.separatorsDocuments != null) {
      this.edit = true;
      this.separatorsDocumentsModalForm.patchValue(this.separatorsDocuments);
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
    this.documentsSeparatorsService
      .create(this.separatorsDocumentsModalForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  update() {
    this.loading = true;
    this.documentsSeparatorsService
      .update(
        this.separatorsDocumentsModalForm.controls['key'].value,
        this.separatorsDocumentsModalForm.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
