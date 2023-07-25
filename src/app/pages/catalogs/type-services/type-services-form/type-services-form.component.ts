import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITypeService } from 'src/app/core/models/catalogs/typeservices.model';
import { TypeServicesService } from 'src/app/core/services/catalogs/typeservices.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-type-services-form',
  templateUrl: './type-services-form.component.html',
  styles: [],
})
export class TypeServicesFormComponent extends BasePage implements OnInit {
  typeServiceForm: ModelForm<ITypeService>;
  title: string = 'Tipo de Servicio';
  edit: boolean = false;
  typeService: ITypeService;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private typeServicesService: TypeServicesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.typeServiceForm = this.fb.group({
      id: [null],
      type: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      concept: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      version: [null],
    });
    if (this.typeService != null) {
      this.edit = true;
      this.typeServiceForm.patchValue(this.typeService);
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
      this.typeServiceForm.controls['type'].value.trim() == '' ||
      this.typeServiceForm.controls['concept'].value.trim() == '' ||
      (this.typeServiceForm.controls['type'].value.trim() == '' &&
        this.typeServiceForm.controls['concept'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.typeServicesService
        .create(this.typeServiceForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.typeServiceForm.controls['type'].value.trim() == '' ||
      this.typeServiceForm.controls['concept'].value.trim() == '' ||
      (this.typeServiceForm.controls['type'].value.trim() == '' &&
        this.typeServiceForm.controls['concept'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.typeServicesService
        .update(this.typeService.id, this.typeServiceForm.getRawValue())
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
