import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  PHONE_PATTERN,
  RFC_PATTERN,
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
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      noExt: [null, [Validators.maxLength(10)]],
      noInt: [null, [Validators.maxLength(10)]],
      colony: [null, [Validators.maxLength(100)]],
      municipalDelegate: [null, [Validators.maxLength(60)]],
      postalCode: [null, [Validators.maxLength(5)]],
      rfc: [null, [Validators.maxLength(20), Validators.pattern(RFC_PATTERN)]],
      phone: [
        null,
        [Validators.maxLength(20), Validators.pattern(PHONE_PATTERN)],
      ],
      phoneTwo: [
        null,
        [Validators.maxLength(20), Validators.pattern(PHONE_PATTERN)],
      ],
      fax: [null, [Validators.maxLength(20)]],
      typeOffice: [null, Validators.maxLength(1)],
    });
    if (this.office != null) {
      this.edit = true;
      this.officeForm.patchValue(this.office);
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
