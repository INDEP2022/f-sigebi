import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

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
      bankingInstitution: [null],
      concept: [null],
      wayToPay: [null],
      import: [null],
      referenceNumber: [null],
      specialized: [null],
      unitAdministrative: [null],
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estas seguro de generar la orden de ingreso?'
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
