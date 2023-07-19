import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { IBankConcepts } from 'src/app/core/models/catalogs/bank-concepts-model';
//services
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BankConceptsService } from 'src/app/core/services/catalogs/bank-concepts-service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-bank-concepts-modal',
  templateUrl: './bank-concepts-modal.component.html',
  styles: [],
})
export class BankConceptsModalComponent extends BasePage implements OnInit {
  bankConceptsForm: ModelForm<IBankConcepts>;
  bankConcepts: IBankConcepts;
  title: string = 'Concepto Bancario';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private bankConceptsService: BankConceptsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.bankConceptsForm = this.fb.group({
      key: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noRegistration: [null],
    });
    if (this.bankConcepts != null) {
      this.edit = true;
      console.log(this.bankConcepts);
      this.bankConceptsForm.patchValue(this.bankConcepts);
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
      this.bankConceptsForm.controls['key'].value.trim() == '' ||
      this.bankConceptsForm.controls['description'].value.trim() == '' ||
      (this.bankConceptsForm.controls['key'].value.trim() == '' &&
        this.bankConceptsForm.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.bankConceptsService.create(this.bankConceptsForm.value).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (
      this.bankConceptsForm.controls['key'].value.trim() == '' ||
      this.bankConceptsForm.controls['description'].value.trim() == '' ||
      (this.bankConceptsForm.controls['key'].value.trim() == '' &&
        this.bankConceptsForm.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.bankConceptsService
        .update(this.bankConcepts.key, this.bankConceptsForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
