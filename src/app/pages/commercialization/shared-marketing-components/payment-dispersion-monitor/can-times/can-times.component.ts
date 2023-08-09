import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IComerPaymentsRefVir } from 'src/app/core/services/ms-payment/payment-service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-can-times',
  templateUrl: './can-times.component.html',
  styleUrls: [],
})
export class CanTimesComponent extends BasePage implements OnInit {
  formTimes: FormGroup;

  comerPagoRefVirt: any = null;

  constructor(
    private fb: FormBuilder,
    private bsModel: BsModalRef,
    private comerPaymentService: PaymentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.formTimes = this.fb.group({
      times: [null],
    });
  }

  //gets
  get times() {
    return this.formTimes.get('times');
  }

  //Cerrar modal
  close() {
    this.bsModel.hide();
  }

  //Aceptar
  apply() {
    if (this.times.value < 1) {
      this.alert('warning', 'El Número Debe ser Mayor a Cero', '');
    } else {
      if (this.comerPagoRefVirt.paymentId != null) {
        let n_monto;
        let n_pena;
        let n_mdiv;
        let n_pdiv;
        let n_sum = n_mdiv;
        let n_psuma = n_pdiv;
        let n_tipo_ref;

        for (let i = 0; i < this.times.value; i++) {
            const data = this.comerPagoRefVirt
            let model: IComerPaymentsRefVir = {
                payId: data.paymentId,
                payvirtueId: '',
                batchId: '',
                amount: '',
                typereference: '',
                amountGrief: '',
                numberRecord: ''
            }

        }
      }
    }
  }
}
