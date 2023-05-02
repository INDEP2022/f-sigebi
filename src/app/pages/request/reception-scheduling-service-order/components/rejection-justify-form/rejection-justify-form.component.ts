import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-rejection-justify-form',
  templateUrl: './rejection-justify-form.component.html',
  styles: [],
})
export class RejectionJustifyFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      justification: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea mandar la justificación de servicio con folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'justificación de servicio enviada correctamente',
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
