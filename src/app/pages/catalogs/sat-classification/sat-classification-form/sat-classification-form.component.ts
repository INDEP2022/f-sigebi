import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISatClassification } from 'src/app/core/models/catalogs/sat-classification.model';
import { SatClassificationService } from 'src/app/core/services/catalogs/sat-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-sat-classification-form',
  templateUrl: './sat-classification-form.component.html',
  styles: [],
})
export class SatClassificationFormComponent extends BasePage implements OnInit {
  satClassificationForm: ModelForm<ISatClassification>;
  title: string = 'SAT Clasificación';
  edit: boolean = false;
  id: string;
  satclasification: ISatClassification;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private satClassificationService: SatClassificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    //console.log(this.satclassification);
  }

  private prepareForm() {
    this.satClassificationForm = this.fb.group({
      id: [null],
      nombre_clasificacion: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      version: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
    });
    if (this.satclasification != null) {
      this.edit = true;
      console.log(this.satclasification);
      this.satClassificationForm.patchValue(this.satclasification);
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
      this.satClassificationForm.controls[
        'nombre_clasificacion'
      ].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.satClassificationService
      .create(this.satClassificationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.id = this.satClassificationForm.get('id').value;
    this.satClassificationService
      .update(this.id, this.satClassificationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
