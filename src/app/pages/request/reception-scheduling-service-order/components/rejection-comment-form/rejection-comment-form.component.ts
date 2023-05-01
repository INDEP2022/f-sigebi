import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-rejection-comment-form',
  templateUrl: './rejection-comment-form.component.html',
  styles: [],
})
export class RejectionCommentFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      comments: [null, [Validators.required]],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea rechazar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio rechazada correctamente',
          ''
        );
        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
