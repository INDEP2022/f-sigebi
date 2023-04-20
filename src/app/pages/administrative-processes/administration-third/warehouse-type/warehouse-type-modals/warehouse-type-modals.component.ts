import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IWarehouseTypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-warehouse-type-modals',
  templateUrl: './warehouse-type-modals.component.html',
  styles: [],
})
export class WarehouseTypeModalsComponent extends BasePage implements OnInit {
  warehouseForm: ModelForm<IWarehouseTypeWarehouse>;
  edit: boolean = false;
  title: string = 'Tipo de Almacén';
  data: IWarehouseTypeWarehouse;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private typeWarehouseService: TypeWarehouseService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.warehouseForm = this.fb.group({
      warehouseTypeId: [null],
      descriptionType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      porcAreaA: [null, Validators.required],
      porcAreaB: [null, Validators.required],
      porcAreaC: [null, Validators.required],
      porcAreaD: [null, Validators.required],
      timeMaxContainer: [null, Validators.required],
      timeMaxDestruction: [null, Validators.required],
      registryNumber: [null],
      insertDate: [null],
      userInsert: [null],
    });
    if (this.data != null) {
      console.log(this.data);
      this.edit = true;
      this.warehouseForm.patchValue(this.data);
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
    this.typeWarehouseService.createType(this.warehouseForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  update() {
    this.loading = true;
    this.typeWarehouseService
      .updateType(
        this.warehouseForm.controls['warehouseTypeId'].value,
        this.warehouseForm.value
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
