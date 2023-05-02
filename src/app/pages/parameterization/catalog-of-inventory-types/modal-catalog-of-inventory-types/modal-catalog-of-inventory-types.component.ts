import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IInventoryQuery } from 'src/app/core/models/ms-inventory-query/inventory-query.model';
import { InventoryTypeService } from 'src/app/core/services/ms-inventory-type/inventory-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-catalog-of-inventory-types',
  templateUrl: './modal-catalog-of-inventory-types.component.html',
  styles: [],
})
export class ModalCatalogOfInventoryTypesComponent
  extends BasePage
  implements OnInit
{
  title: string = 'DETALLE INVENTARIO';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  data: IInventoryQuery;
  @Output() refresh = new EventEmitter<true>();
  id: number;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private inventoryServ: InventoryTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      noTypeInventory: ['', Validators.pattern(NUMBERS_PATTERN)],
      attributeInventory: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeData: ['', [Validators.required]],
      cveTypeInventory: [Validators.required],
    });
    if (this.allotment != null) {
      console.log(this.allotment);
      this.edit = true;
      this.id = Number(this.allotment.noTypeInventory);
      this.form.patchValue(this.allotment);
    } else {
      this.form.get('cveTypeInventory').patchValue(this.data.cveTypeInventory);
    }
  }

  confirm() {
    this.loading = true;
    if (this.edit) {
      this.inventoryServ.update(this.id, this.form.value).subscribe({
        next: resp => {
          this.handleSuccess();
        },
        error: err => {
          this.loading = false;
          this.onLoadToast('error', 'Error', err.error.message);
        },
      });
    } else {
      this.inventoryServ.createInventoryDetail(this.form.value).subscribe({
        next: resp => {
          this.handleSuccess();
        },
        error: err => {
          this.loading = false;
          this.onLoadToast('error', 'Error', err.error.message);
        },
      });
    }
  }
  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.loading = false;
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
