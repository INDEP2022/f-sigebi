import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cancel-modal',
  templateUrl: './cancel-modal.component.html',
  styles: [],
})
export class CancelModalComponent extends BasePage implements OnInit {
  title: string = 'Cancelar Factura';
  cancelForm: FormGroup = new FormGroup({});
  @Output() onCancel = new EventEmitter<boolean>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.cancelForm = this.fb.group({
      cause: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio eliminar factura
    console.log(this.cancelForm.value);
    this.loading = false;
    this.onCancel.emit(true);
    this.modalRef.hide();
  }
}
