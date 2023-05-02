import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IInstitutionClassification } from 'src/app/core/models/catalogs/institution-classification.model';
import { InstitutionClasificationService } from 'src/app/core/services/catalogs/institution-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-institution-clasification-modal',
  templateUrl: './institution-clasification-modal.component.html',
  styles: [],
})
export class InstitutionClasificationModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Clasificación de instituciones';
  edit: boolean = false;

  instituteForm: ModelForm<IInstitutionClassification>;
  institute: IInstitutionClassification;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private institutionClasificationService: InstitutionClasificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareform();
  }

  private prepareform() {
    this.instituteForm = this.fb.group({
      id: [null, []],
      description: [null, []],
      numRegister: [null, []],
    });
    if (this.institute != null) {
      console.log('datos', this.institute);
      this.edit = true;
      this.instituteForm.patchValue(this.institute);
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
    this.institutionClasificationService
      .create(this.instituteForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.institutionClasificationService
      .update(this.institute.id, this.instituteForm.value)
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
