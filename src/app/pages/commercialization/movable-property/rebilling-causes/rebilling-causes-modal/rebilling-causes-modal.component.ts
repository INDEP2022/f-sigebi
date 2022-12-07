import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-rebilling-causes-modal',
  templateUrl: './rebilling-causes-modal.component.html',
  styles: [],
})
export class RebillingCausesModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  allotment: any;
  title: string = 'Causas para generar refacturación';
  edit: boolean = false;
  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [{ value: null, disabled: true }],
      descripcion: [{ value: null, disabled: true }],
      refCan: [null, [Validators.required]],
      aplica: [null, [Validators.required]],
      comentarios: [{ value: null, disabled: true }],
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
