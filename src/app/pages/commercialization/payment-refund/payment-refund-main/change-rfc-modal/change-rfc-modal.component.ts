import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { RFC_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-change-rfc-modal',
  templateUrl: './change-rfc-modal.component.html',
  styles: [],
})
export class ChangeRfcModalComponent extends BasePage implements OnInit {
  title: string = 'Cambiar R.F.C. o Nombre / Denominación';
  rfcForm: FormGroup = new FormGroup({});
  @Output() onChange = new EventEmitter<boolean>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.rfcForm = this.fb.group({
      rfc: ['', Validators.pattern(RFC_PATTERN)],
      name: ['', Validators.pattern(STRING_PATTERN)],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    // Llamar servicio para verificar la clave del usuario que autoriza
    if (
      this.rfcForm.controls['rfc'].value == '' &&
      this.rfcForm.controls['name'].value == ''
    ) {
      this.onLoadToast(
        'error',
        'Error al actualizar campos',
        'Debe llenar al menos uno de los campos'
      );
      return;
    }
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para cambiar clave
    console.log(this.rfcForm.value);
    this.loading = false;
    this.onChange.emit(true);
    this.modalRef.hide();
  }
}
