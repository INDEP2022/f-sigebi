import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-cost-catalog',
  templateUrl: './modal-cost-catalog.component.html',
  styles: [],
})
export class ModalCostCatalogComponent implements OnInit {
  title: string = 'Catalogo de Costos';
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
      keyServices: [null, [Validators.required]],
      descriptionServices: [null, [Validators.required]],
      typeExpenditure: [null, [Validators.required]],
      unaffordable: [null, [Validators.required]],
      cost: [null, [Validators.required]],
      expenditure: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
