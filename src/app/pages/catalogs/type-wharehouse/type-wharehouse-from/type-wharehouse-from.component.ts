import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-type-wharehouse-from',
  templateUrl: './type-wharehouse-from.component.html',
  styles: [],
})
export class TypeWharehouseFromComponent extends BasePage implements OnInit {
  typeWarehouseForm: ModelForm<ITypeWarehouse>;
  title: string = 'Tipo de Almacenes';
  edit: boolean = false;
  typeWarehouse: ITypeWarehouse;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private typeWarehouseService: TypeWarehouseService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.typeWarehouseForm = this.fb.group({
      id: [null],
      description: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(80),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      version: [null, Validators.compose([Validators.required])],
      status: [null, Validators.compose([Validators.required])],
    });
    if (this.typeWarehouse != null) {
      this.edit = true;
      this.typeWarehouseForm.patchValue(this.typeWarehouse);
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
    this.typeWarehouseService
      .create(this.typeWarehouseForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.typeWarehouseService
      .update(this.typeWarehouse.id, this.typeWarehouseForm.getRawValue())
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
