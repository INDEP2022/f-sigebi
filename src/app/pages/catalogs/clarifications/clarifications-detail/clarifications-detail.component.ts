import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IClarification } from 'src/app/core/models/catalogs/clarification.model';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ClarificationService } from '../../../../core/services/catalogs/clarification.service';

@Component({
  selector: 'app-clarifications-detail',
  templateUrl: './clarifications-detail.component.html',
  styles: [],
})
export class ClarificationsDetailComponent extends BasePage implements OnInit {
  clarificationForm: ModelForm<IClarification>;
  title: string = 'Aclaración';
  edit: boolean = false;
  clarification: IClarification;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private clarificationService: ClarificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.clarificationForm = this.fb.group({
      id: [null, [Validators.pattern(STRING_PATTERN), Validators.minLength(1)]],
      clarification: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      type: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(2),
        ],
      ],
      active: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      version: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      modificationDate: [null],
      creationUser: [null],
      creationDate: [null],
      editionUser: [null],
    });
    if (this.clarification != null) {
      this.edit = true;
      this.clarificationForm.patchValue(this.clarification);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    if (this.clarificationForm.controls['clarification'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.clarificationService.create(this.clarificationForm.value).subscribe(
      data => this.handleSuccess(),
      error => {
        this.loading = false;
        this.alert('error', 'ERROR', error.error.message);
      }
    );
  }

  update() {
    this.loading = true;
    this.clarificationService
      .update(this.clarificationForm.value.id, this.clarificationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
