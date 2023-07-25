import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOUBLE_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-create-deductives-verification-form',
  templateUrl: './deductives-verification-form.component.html',
  styles: [],
})
export class DeductivesVerificationFormComponent
  extends BasePage
  implements OnInit
{
  deductiveForm: ModelForm<IDeductiveVerification>;
  title: string = 'Deductiva Verificación';
  edit: boolean = false;
  deductive: IDeductiveVerification;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private deductiveVerificationService: DeductiveVerificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.deductiveForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      percentagePena: [
        null,
        [
          Validators.required,
          Validators.pattern(DOUBLE_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      verificationType: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(20),
        ],
      ],
    });
    if (this.deductive != null) {
      this.edit = true;
      this.deductiveForm.patchValue(this.deductive);
      this.deductiveForm.controls.id.disable();
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
      this.deductiveForm.controls['description'].value.trim() == '' ||
      this.deductiveForm.controls['verificationType'].value.trim() == '' ||
      (this.deductiveForm.controls['description'].value.trim() == '' &&
        this.deductiveForm.controls['verificationType'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.deductiveVerificationService
        .create(this.deductiveForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.deductiveForm.controls['description'].value.trim() == '' ||
      this.deductiveForm.controls['verificationType'].value.trim() == '' ||
      (this.deductiveForm.controls['description'].value.trim() == '' &&
        this.deductiveForm.controls['verificationType'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.deductiveVerificationService
        .update(this.deductive.id, this.deductiveForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
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
