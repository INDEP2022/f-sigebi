import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IInstitutionClassification } from 'src/app/core/models/catalogs/institution-classification.model';
import { InstitutionClasificationService } from 'src/app/core/services/catalogs/institution-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';

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
  title: string = 'CLASIFICACIÓN DE INSTITUCIÓN';
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
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      numRegister: [
        null,
        Validators.compose([Validators.minLength(1), Validators.pattern('')]),
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
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
