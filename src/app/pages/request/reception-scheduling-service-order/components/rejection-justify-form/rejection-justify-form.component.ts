import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IOrderServiceDTO } from 'src/app/core/models/ms-order-service/order-service.mode';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-rejection-justify-form',
  templateUrl: './rejection-justify-form.component.html',
  styles: [],
})
export class RejectionJustifyFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  op: number = null; //tipo de operacion en la que esta
  label: string = null;
  orderServiceId: number = 0;
  folioOrderservice: string = '';
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private orderServiceService: OrderServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.setLabelName();
  }

  prepareForm() {
    this.form = this.fb.group({
      justification: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Confirmación',
      `¿Desea enviar la justificación de servicio con folio ${this.folioOrderservice}?`
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        const orderServiceInfo: IOrderServiceDTO = {
          id: this.orderServiceId,
          justification: this.form.get('justification').value,
        };
        this.orderServiceService
          .updateOrderService(orderServiceInfo)
          .subscribe({
            next: response => {
              console.log('response', response);
              this.alert(
                'success',
                'Correcto',
                'Justificación Enviada Correctamente'
              );
              this.loading = false;
              this.close();
            },
            error: error => {},
          });
      }
    });
  }

  close() {
    this.modalRef.hide();
  }

  setLabelName() {
    if (this.op == 12) {
      this.label = 'Justificación Reporte';
    } else {
      this.label = 'Justificación';
    }
  }
}
