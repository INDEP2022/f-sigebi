import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-billing-payments-modal',
  templateUrl: './billing-payments-modal.component.html',
  styles: [],
})
export class billingPaymentsModalComponent extends BasePage implements OnInit {
  title: string = 'detalle de pago';
  edit: boolean = true;
  form: FormGroup = new FormGroup({});
  billing: any;
  factura: number;
  allotment: any;
  pago = new DefaultSelect();
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private accountMovementService: AccountMovementService
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
      this.form.get('lote_publico').disable();
      this.form.get('id_pago').disable();
      this.form.get('referencia').disable();
      this.form.get('monto').disable();
    }
  }

  getMont(params: ListParams) {
    this.accountMovementService.getMetodoPago(params).subscribe({
      next: data => {
        this.pago = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.pago = new DefaultSelect();
        this.loading = false;
      },
    });
  }

  changeMont(event: any) {}

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
    this.alert('success', `Se ha modificado el ${this.title}`, ``);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
