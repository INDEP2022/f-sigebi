import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-save-value-form',
  templateUrl: './save-value-form.component.html',
  styles: [],
})
export class SaveValueFormComponent extends BasePage implements OnInit {
  saveValue: ISaveValue;
  edit: boolean = false;
  saveValueForm: ModelForm<ISaveValue>;
  title: string = 'Valor Guardado';

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private saveValueService: SaveValueService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.saveValueForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(5),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      location: [
        null,
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      responsible: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      noRegistration: [null],
    });

    if (this.saveValue != null) {
      this.edit = true;
      this.saveValueForm.patchValue(this.saveValue);
      this.saveValueForm.get('id').disable();
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.saveValueForm.controls['description'].value.trim() === '' ||
      this.saveValueForm.controls['responsible'].value.trim() === '' ||
      this.saveValueForm.controls['location'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.saveValueService.create(this.saveValueForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => {
        this.alert('error', 'La Calve ya fue registrada', '');
        this.loading = false;
      },
    });
  }

  update() {
    this.saveValueService
      .update(this.saveValue.id, this.saveValueForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  close() {
    this.modalRef.hide();
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
