import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-observation-reject',
  templateUrl: './observation-reject.component.html',
  styles: [],
})
export class ObservationRejectComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  idSamplingOrder: number = 0;
  sampleOrderInfo: ISamplingOrder;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private orderService: OrderServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getSampleOrder();
  }

  getSampleOrder() {
    const params = new ListParams();
    params['filter.idSamplingOrder'] = `$eq:${this.idSamplingOrder}`;
    this.orderService.getAllSampleOrder(params).subscribe({
      next: resp => {
        this.sampleOrderInfo = resp.data[0];

        if (this.sampleOrderInfo?.observationRejection) {
          this.form
            .get('observationRejection')
            .setValue(this.sampleOrderInfo.observationRejection);
        }
      },
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      observationRejection: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea agregar la observación de rechazo?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        const sampleOrder: ISamplingOrder = {
          idSamplingOrder: this.idSamplingOrder,
          observationRejection: this.form.get('observationRejection').value,
        };

        this.orderService.updateSampleOrder(sampleOrder).subscribe({
          next: () => {
            this.modalRef.content.callback(true);
            this.loading = false;
            this.close();
          },
          error: () => {
            this.alert(
              'error',
              'Error',
              'No se pudo actualizar la orden de muestreo'
            );
            this.loading = false;
          },
        });
      }
    });
  }
}
