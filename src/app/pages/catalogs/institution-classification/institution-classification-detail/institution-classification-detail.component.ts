import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IInstitutionClassification } from 'src/app/core/models/catalogs/institution-classification.model';
import { InstitutionClasificationService } from 'src/app/core/services/catalogs/institution-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-institution-classification-detail',
  templateUrl: './institution-classification-detail.component.html',
  styles: [],
})
export class InstitutionClassificationDetailComponent
  extends BasePage
  implements OnInit
{
  officeForm: ModelForm<IInstitutionClassification>;
  title: string = 'Clasificación de Institución';
  edit: boolean = false;
  form: IInstitutionClassification;
  institution: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private institutionService: InstitutionClasificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.officeForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      numRegister: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
    });
    if (this.institution != null) {
      this.edit = true;
      this.officeForm.patchValue(this.institution);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.officeForm.controls['description'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.institutionService.create(this.officeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.institutionService
      .update(this.institution.id, this.officeForm.value)
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
