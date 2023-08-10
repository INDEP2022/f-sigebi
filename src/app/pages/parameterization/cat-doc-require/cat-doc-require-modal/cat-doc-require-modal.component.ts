import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
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
  title: string = 'Requisito Documental';
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
      numRegister: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.maxLength(8),
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
    if (
      this.documentsForDictumForm.controls['id'].value.trim() === '' ||
      this.documentsForDictumForm.controls['description'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.documentsForDictumService
      .create(this.documentsForDictumForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          this.alert('error', 'El Numero de Registro ya registrado', '');
        },
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
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
