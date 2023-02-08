import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
//models
import { IDocumentsForDictum } from 'src/app/core/models/catalogs/documents-for-dictum.model';
//Services
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';

@Component({
  selector: 'app-cat-doc-require-modal',
  templateUrl: './cat-doc-require-modal.component.html',
  styles: [],
})
export class CatDocRequireModalComponent extends BasePage implements OnInit {
  documentsForDictumForm: ModelForm<IDocumentsForDictum>;
  documentsForDictum: IDocumentsForDictum;
  title: string = 'Catálogo de requisitos documentales';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private documentsForDictumService: DocumentsForDictumService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.documentsForDictumForm = this.fb.group({
      id: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeDictum: [null, [Validators.required]],
    });
    if (this.documentsForDictum != null) {
      this.edit = true;
      this.documentsForDictumForm.patchValue(this.documentsForDictum);
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
    this.documentsForDictumService
      .create(this.documentsForDictumForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.documentsForDictumService
      .update(this.documentsForDictum.id, this.documentsForDictumForm.value)
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
