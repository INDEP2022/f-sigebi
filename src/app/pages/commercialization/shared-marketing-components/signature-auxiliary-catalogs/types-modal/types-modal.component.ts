import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-types-modal',
  templateUrl: './types-modal.component.html',
  styles: [],
})
export class TypesModalComponent extends BasePage implements OnInit {
  title: string = 'Tipo de Firmante';
  type: any;
  orders: number[] = [];
  edit: boolean = false;
  typeForm: FormGroup = new FormGroup({});
  @Output() onConfirm = new EventEmitter<boolean>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.typeForm = this.fb.group({
      denomination: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      order: [null, [Validators.required]],
    });
    console.log(this.type);
    if (this.type !== undefined) {
      this.edit = true;
      this.typeForm.patchValue(this.type);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    if (this.orders.indexOf(this.typeForm.controls['order'].value) != -1) {
      this.onLoadToast(
        'error',
        'Orden no permitido',
        'El valor del orden del firmante introducido ya está siendo utilizado'
      );
      return;
    }
    this.loading = true;
    // Llamar servicio para realizar accion
    this.loading = false;
    this.onConfirm.emit(this.typeForm.value);
    this.modalRef.hide();
  }
}
