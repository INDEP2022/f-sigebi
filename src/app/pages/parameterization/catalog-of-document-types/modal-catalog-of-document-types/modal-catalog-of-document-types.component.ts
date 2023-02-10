import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TypesDocuments } from 'src/app/core/models/ms-documents/documents-type';
import { DocumentsTypeService } from 'src/app/core/services/ms-documents-type/documents-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-catalog-of-document-types',
  templateUrl: './modal-catalog-of-document-types.component.html',
  styles: [],
})
export class ModalCatalogOfDocumentTypesComponent
  extends BasePage
  implements OnInit
{
  title: string = 'TIPO DE DOCUMENTO';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: TypesDocuments;
  id: string;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private documentServ: DocumentsTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      registerNumber: [null],
      areGenerate: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.id = this.allotment.id;
      this.form.patchValue(this.allotment);
      this.form.get('id').disable();
    }
  }
  saved() {
    if (this.form.valid) {
      if (this.edit) {
        this.form.get('id').enable();
        this.documentServ.updateDocument(this.id, this.form.value).subscribe({
          next: () => this.handleSuccess(),
          error: error => this.onLoadToast('error', error.error.message, ''),
        });
      } else {
        this.documentServ.createDocument(this.form.value).subscribe({
          next: () => {
            this.handleSuccess();
          },
          error: error => this.onLoadToast('error', error.error.message, ''),
        });
      }
    }
  }
  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'Tipo de Documento',
      `Ha sido ${this.edit ? 'actualizado' : 'creado'} correctamente`
    );
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
