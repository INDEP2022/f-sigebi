import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-transfer-date-modal',
  templateUrl: './transfer-date-modal.component.html',
  styles: [],
})
export class TransferDateModalComponent extends BasePage implements OnInit {
  title: string = 'Fecha de Transferencia';
  maxDate: Date = new Date();
  dateForm: FormGroup = new FormGroup({});
  @Output() onKeyChange = new EventEmitter<boolean>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.dateForm = this.fb.group({
      transferDate: [null, [Validators.required]],
      observations: [null, Validators.pattern(STRING_PATTERN)],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    // Llamar servicio para verificar la clave del usuario que autoriza
    this.handleSuccess();
  }

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para cambiar clave
    console.log(this.dateForm.value);
    this.loading = false;
    this.onKeyChange.emit(true);
    this.modalRef.hide();
  }
}
