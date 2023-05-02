import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISatClassification } from 'src/app/core/models/catalogs/sat-classification.model';
import { SatClassificationService } from 'src/app/core/services/catalogs/sat-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-sat-clasification-form',
  templateUrl: './sat-classification-form.component.html',
  styles: [],
})
export class SatClassificationFormComponent extends BasePage implements OnInit {
  satClassificationForm: ModelForm<ISatClassification>;
  title: string = 'SAT Clasificación';
  edit: boolean = false;
  satclassification: ISatClassification;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private satClassificationService: SatClassificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.satClassificationForm = this.fb.group({
      id: [null],
      nombre_clasificacion: [null, [Validators.pattern(STRING_PATTERN)]],
      version: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.satclassification != null) {
      this.edit = true;
      this.satClassificationForm.patchValue(this.satclassification);
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
    this.satClassificationService
      .create(this.satClassificationForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.satClassificationService
      .update(
        this.satclassification.id,
        this.satClassificationForm.getRawValue()
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
