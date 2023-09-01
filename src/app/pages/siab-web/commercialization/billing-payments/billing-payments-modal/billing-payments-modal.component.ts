import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-billing-payments-modal',
  templateUrl: './billing-payments-modal.component.html',
  styles: [],
})
export class billingPaymentsModalComponent extends BasePage implements OnInit {
  title: string = 'Detalle de pago';
  edit: boolean = true;
  form: FormGroup = new FormGroup({});
  billing: any;
  factura: number;
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private paymentService: PaymentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id_factura: [null, []],
      id_evento: [null, [Validators.required]],
      lote_publico: [null, [Validators.required]],
      id_pago: [null, []],
      id_tipo_sat: [null, []],
      referencia: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      monto: [null, [Validators.required]],
    });
    if (this.billing != null) {
      this.edit = true;
      console.log(this.billing, this.factura);
      this.form.patchValue(this.billing);
      this.form.get('id_factura').setValue(this.factura);
      this.form.get('id_factura').disable();
      this.form.get('id_evento').disable();
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.update();
  }

  update() {
    let body = {
      eventId: this.form.get('id_evento').value,
      publicLot: this.form.get('lote_publico').value,
      paymentId: this.form.get('id_pago').value,
      invoice: this.form.get('id_factura').value,
      typeSatId: this.form.get('id_tipo_sat').value,
    };
    this.paymentService.updatePayments(body).subscribe({
      next: resp => {
        this.handleSuccess();
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  handleSuccess() {
    //const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `Actualizado Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
