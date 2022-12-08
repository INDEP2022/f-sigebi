import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-catalog-of-inventory-types',
  templateUrl: './modal-catalog-of-inventory-types.component.html',
  styles: [],
})
export class ModalCatalogOfInventoryTypesComponent implements OnInit {
  title: string = 'INVENTARIO';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      number: [null, [Validators.required]],
      propertyInventory: [null, [Validators.required]],
      dateType: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }
  saved() {
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
