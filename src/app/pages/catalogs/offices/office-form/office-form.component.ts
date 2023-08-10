import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from '../../../../core/shared/patterns';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IOffice } from 'src/app/core/models/catalogs/office.model';
import { OfficeService } from 'src/app/core/services/catalogs/office.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
  styles: [],
})
export class OfficeFormComponent extends BasePage implements OnInit {
  officeForm: ModelForm<IOffice>;
  title: string = 'Despacho';
  edit: boolean = false;
  office: IOffice;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private officeService: OfficeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.officeForm = this.fb.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      street: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      noExt: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      noInt: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      colony: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      municipalDelegate: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      postalCode: [null, [Validators.required, Validators.maxLength(5)]],
      rfc: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(PHONE_PATTERN),
        ],
      ],
      phoneTwo: [
        null,
        [Validators.maxLength(20), Validators.pattern(PHONE_PATTERN)],
      ],
      fax: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      typeOffice: [
        null,
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    if (this.office != null) {
      this.edit = true;
      this.officeForm.patchValue(this.office);
      this.updateValidationForm();
    }
  }
  close() {
    this.modalRef.hide();
  }

  updateValidationForm() {
    Object.keys(this.officeForm.controls).forEach(key => {
      const control = this.officeForm.controls[key];
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.officeForm.controls['name'].value.trim() === '' ||
      this.officeForm.controls['street'].value.trim() === '' ||
      this.officeForm.controls['colony'].value.trim() === '' ||
      this.officeForm.controls['municipalDelegate'].value.trim() === '' ||
      this.officeForm.controls['rfc'].value.trim() === '' ||
      this.officeForm.controls['fax'].value.trim() === '' ||
      this.officeForm.controls['typeOffice'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.officeService.create(this.officeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.officeService.update(this.office.id, this.officeForm.value).subscribe({
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
