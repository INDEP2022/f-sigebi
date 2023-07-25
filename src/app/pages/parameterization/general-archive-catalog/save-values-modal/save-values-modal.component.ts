import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
//Services
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-save-values-modal',
  templateUrl: './save-values-modal.component.html',
  styles: [],
})
export class SaveValuesModalComponent extends BasePage implements OnInit {
  title: string = 'Guarda Valor';
  edit: boolean = false;

  saveValuesForm: ModelForm<ISaveValue>;
  saveValues: ISaveValue;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private saveValueService: SaveValueService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.saveValuesForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(5),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      location: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      responsible: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
    });
    if (this.saveValues != null) {
      this.edit = true;
      this.saveValuesForm.patchValue(this.saveValues);
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
      this.saveValuesForm.controls['id'].value.trim() == '' ||
      this.saveValuesForm.controls['description'].value.trim() == '' ||
      this.saveValuesForm.controls['location'].value.trim() == '' ||
      this.saveValuesForm.controls['responsible'].value.trim() == '' ||
      (this.saveValuesForm.controls['id'].value.trim() == '' &&
        this.saveValuesForm.controls['description'].value.trim() == '' &&
        this.saveValuesForm.controls['location'].value.trim() == '' &&
        this.saveValuesForm.controls['responsible'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      console.log(this.saveValuesForm.value);
      this.saveValueService
        .create(this.saveValuesForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => {
            this.loading = false;
            this.onLoadToast(
              'warning',
              'La CVE Guarda Valor ya Fue Registrada',
              ``
            );
          },
        });
    }
  }

  update() {
    if (
      this.saveValuesForm.controls['id'].value.trim() == '' ||
      this.saveValuesForm.controls['description'].value.trim() == '' ||
      this.saveValuesForm.controls['location'].value.trim() == '' ||
      this.saveValuesForm.controls['responsible'].value.trim() == '' ||
      (this.saveValuesForm.controls['id'].value.trim() == '' &&
        this.saveValuesForm.controls['description'].value.trim() == '' &&
        this.saveValuesForm.controls['location'].value.trim() == '' &&
        this.saveValuesForm.controls['responsible'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.saveValueService
        .update(this.saveValues.id, this.saveValuesForm.getRawValue())
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
