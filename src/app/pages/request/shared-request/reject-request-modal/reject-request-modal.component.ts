import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-reject-request-modal',
  templateUrl: './reject-request-modal.component.html',
  styles: [],
})
export class RejectRequestModalComponent extends BasePage implements OnInit {
  @Input() requestId: number;
  @Input() title: string = 'Confirmar Rechazo';
  @Input() message: string =
    'El procedimiento de la solicitud actual será rechazado';
  @Output() onReject = new EventEmitter<boolean>();
  rejectForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.rejectForm = this.fb.group({
      comment: [
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
    // Llamar servicio para cambiar clave
    console.log(this.rejectForm.value);
    // Llamar servicio para rechazar solicitud
    this.onLoadToast('success', 'Proceso de solicitud rechazado con éxito', '');
    this.loading = false;
    this.onReject.emit(true);
    this.modalRef.hide();
  }
}
