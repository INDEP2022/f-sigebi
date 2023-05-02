import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-entry-order-form',
  templateUrl: './entry-order-form.component.html',
  styles: [],
})
export class EntryOrderFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      bankingInstitution: [null, Validators.pattern(STRING_PATTERN)],
      concept: [null, Validators.pattern(STRING_PATTERN)],
      wayToPay: [null, Validators.pattern(STRING_PATTERN)],
      import: [null],
      referenceNumber: [null, Validators.pattern(STRING_PATTERN)],
      specialized: [null, Validators.pattern(STRING_PATTERN)],
      unitAdministrative: [null],
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro de generar la orden de ingreso?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de ingreso creada correctamente',
          ''
        );
        this.modalRef.hide();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }
}
