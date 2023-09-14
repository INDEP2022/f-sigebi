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

  incomeData: any;

  newData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerPaymentService: PaymentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log(this.incomeData);
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
    this.modalRef.hide();
  }

  //Aceptar
  apply() {
    console.log(this.times.value);
    if (this.times.value < 2) {
      this.alert('warning', 'Número inválido, favor de rectificar', '');
    } else {
      if (this.incomeData.payId != null) {
        let n_monto = this.incomeData.amount;
        let n_pena = this.incomeData.amountGrief;
        let n_mdiv = n_monto / this.times.value;
        let n_pdiv = n_pena / this.times.value;
        let n_sum = n_mdiv;
        let n_psuma = n_pdiv;
        let n_tipo_ref = this.incomeData.typereference;
        let penalty: number;

        for (let i = 1; i <= this.times.value; i++) {
          const data = this.incomeData;
          if (this.incomeData.payId != null) {
            let model: IComerPaymentsRefVir = {
              payId: data.payId,
              payvirtueId: '',
              batchId: '',
              amount:
                i == this.times.value
                  ? (n_monto - n_sum).toFixed(2)
                  : n_mdiv.toFixed(2),
              typereference: n_tipo_ref,
              amountGrief: '',
              numberRecord: '',
            };

            if (i == this.times.value) {
              penalty = n_pena - n_psuma;
            } else {
              penalty = n_pdiv;
              n_sum = n_sum + n_mdiv;
              n_psuma = n_psuma + n_pdiv;
            }

            this.newData.push({
              ...this.incomeData,
              amount:
                i == this.times.value
                  ? (n_monto - n_sum < 0 ? 0 : n_monto - n_sum).toFixed(2)
                  : n_mdiv.toFixed(2),
              publicBatch: null,
              batchId: null,
              description: null,
              payvirtueId: null,
              typereference: n_tipo_ref,
              penalty,
              position: i,
            });
          }
        }

        console.log(this.newData);

        this.modalRef.content.callback({
          data: this.newData,
          n_mdiv,
          n_pdiv,
          id: this.incomeData.batchId,
        });
        this.modalRef.hide();
      }
    }
  }
}
