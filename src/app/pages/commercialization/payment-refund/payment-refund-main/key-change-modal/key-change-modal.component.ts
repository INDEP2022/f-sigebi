import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentDevolutionService } from 'src/app/core/services/ms-paymentdevolution/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-key-change-modal',
  templateUrl: './key-change-modal.component.html',
  styles: [],
})
export class KeyChangeModalComponent extends BasePage implements OnInit {
  title: string = 'Cambio de Clave Interbancaria';
  keyForm: FormGroup = new FormGroup({});
  @Output() onKeyChange = new EventEmitter<boolean>();
  selectedPayment: any;
  constructor(
    private svPaymentDevolutionService: PaymentDevolutionService,
    private modalRef: BsModalRef,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.keyForm = this.fb.group({
      key: [this.selectedPayment.interbankCode, [Validators.required]],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      userAuthorize: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      authPass: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.alertQuestion(
      'question',
      'Se realizará la actualización de la CLABE',
      '¿Desea continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        let data = {
          devPaymentControlId: this.selectedPayment.controlId,
          batchId: this.selectedPayment.lotId,
          paymentId: this.selectedPayment.payId,
          authorizedComments: this.keyForm.value.observations,
          authorizedBy: this.keyForm.value.userAuthorize,
          interbankCLABE: this.keyForm.value.key,
        };
        let resp = await this.updateCtlDevPagP(data);
        if (resp)
          this.handleSuccess(),
            this.alert('success', 'Pago Actualizado Correctamente', '');
        else this.alert('warning', 'No se pudo actualizar el pago', '');
      }
    });
    // Llamar servicio para verificar la clave del usuario que autoriza
    // this.handleSuccess();
  }
  updateCtlDevPagP(data: any) {
    return new Promise((resolve, reject) => {
      this.svPaymentDevolutionService.updateCtlDevPagP(data).subscribe({
        next: value => {
          resolve(value);
        },
        error: err => {
          resolve(false);
        },
      });
    });
  }

  handleSuccess() {
    this.loading = false;
    this.onKeyChange.emit(true);
    this.modalRef.hide();
  }
}
