import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITypeOrderService } from 'src/app/core/models/catalogs/typeorderservices.model';
import { TypeOrderServicesService } from 'src/app/core/services/catalogs/typeorderservices.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-type-order-service-form',
  templateUrl: './type-order-service-form.component.html',
  styles: [],
})
export class TypeOrderServiceFormComponent extends BasePage implements OnInit {
  typeOrderServiceForm: ModelForm<ITypeOrderService>;
  title: string = 'Tipo de Servicios';
  edit: boolean = false;
  typeOrderService: ITypeOrderService;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private typeOrderServicesService: TypeOrderServicesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.typeOrderServiceForm = this.fb.group({
      id: [null],
      cve: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(KEYGENERATION_PATTERN),
        ]),
      ],
      description: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
    });
    if (this.typeOrderService != null) {
      this.edit = true;
      this.typeOrderServiceForm.patchValue(this.typeOrderService);
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
    this.typeOrderServicesService
      .create(this.typeOrderServiceForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.typeOrderServicesService
      .update(this.typeOrderService.id, this.typeOrderServiceForm.getRawValue())
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
