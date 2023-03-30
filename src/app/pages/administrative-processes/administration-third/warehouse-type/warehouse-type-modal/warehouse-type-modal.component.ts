import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IWarehouseClassifyCosts } from 'src/app/core/models/catalogs/warehouse-classify-costs';
import { BasePage } from 'src/app/core/shared/base-page';

import {
  WAREHOUSESUBSUBSUBTYPE_COLUMNS,
  WAREHOUSESUBSUBTYPE_COLUMNS,
  WAREHOUSESUBTYPE_COLUMNS,
  WAREHOUSETYPE_COLUMNS,
} from './warehouse-type-columns';

@Component({
  selector: 'app-warehouse-type-modal',
  templateUrl: './warehouse-type-modal.component.html',
  styles: [],
})
export class WarehouseTypeModalComponent extends BasePage implements OnInit {
  settings2 = { ...this.settings, actions: false };
  settings3 = { ...this.settings, actions: false };
  settings4 = { ...this.settings, actions: false };
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  warehouseForm: ModelForm<IWarehouseClassifyCosts>;
  edit: boolean = false;
  title: string = 'Tipo de Almacén';
  data: IWarehouseClassifyCosts;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...WAREHOUSETYPE_COLUMNS },
    };
    this.settings2.columns = WAREHOUSESUBTYPE_COLUMNS;
    this.settings3.columns = WAREHOUSESUBSUBTYPE_COLUMNS;
    this.settings4.columns = WAREHOUSESUBSUBSUBTYPE_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.warehouseForm = this.fb.group({
      warehouseTypeId: [null],
      classifGoodNumber: [null, Validators.required],
      costId: [null, Validators.required],
      registryNumber: [null],
    });
    if (this.data != null) {
      console.log(this.data);
      this.edit = true;
      this.warehouseForm.patchValue(this.data);
    }
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    //   this.loading = true;
    //   this.typeWarehouseService
    //     .create(this.warehouseForm.value)
    //     .subscribe({
    //       next: data => this.handleSuccess(),
    //       error: error => (this.loading = false),
    //     });
  }
  update() {
    // this.loading = true;
    // this.typeWarehouseService.update(this.warehouseForm.controls['warehouseTypeId'].value, this.warehouseForm.value).subscribe({
    //   next: data => this.handleSuccess(),
    //   error: error => (this.loading = false),
    // });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
