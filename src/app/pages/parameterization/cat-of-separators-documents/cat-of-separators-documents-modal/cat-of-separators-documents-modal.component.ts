import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { SeparatorsDocuments } from 'src/app/core/models/ms-documents/document-separators';
import { DocumentsSeparatorsService } from 'src/app/core/services/ms-documents-separators/documents-separators.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cat-of-separators-documents-modal',
  templateUrl: './cat-of-separators-documents-modal.component.html',
  styles: [],
})
export class CatOfSeparatorsDocumentsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Separador a Documento';
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
      key: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      numRegister: [null],
    });

    if (this.separatorsDocuments != null) {
      this.edit = true;
      this.separatorsDocumentsModalForm.patchValue(this.separatorsDocuments);
      this.separatorsDocumentsModalForm.get('key').disable();
    }
  }
  close() {
    this.modalRef.hide();
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    if (
      this.separatorsDocumentsModalForm.controls['key'].value.trim() === '' ||
      this.separatorsDocumentsModalForm.controls['description'].value.trim() ===
        ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.documentsSeparatorsService
      .create(this.separatorsDocumentsModalForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.alert('error', 'El valor CVE.Separador, ya fue registrado', '');
          this.loading = false;
        },
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
