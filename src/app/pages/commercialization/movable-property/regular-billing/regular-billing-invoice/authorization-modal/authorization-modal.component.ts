import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InvoicefolioService } from 'src/app/core/services/ms-invoicefolio/invoicefolio.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'authorization-modal',
  templateUrl: './authorization-modal.component.html',
  styles: [],
})
export class AuthorizationModalComponent extends BasePage implements OnInit {
  title: string = 'Verificación';

  form: FormGroup;
  showPassword: boolean = false;
  select: any[] = [];
  global: any;
  constructor(
    private modalRef: BsModalRef,
    private invoiceService: InvoicefolioService
  ) {
    super();
  }

  ngOnInit(): void {}

  validate() {
    const { refactura, folio } = this.form.value;
    this.loading = true;

    if (refactura == 'P' && this.global.canxp == 'S') {
      this.alertQuestion(
        'warning',
        `Se cancelaran las facturas relacionadas a la solicitud de pago ${folio}`,
        '¿Desea continuar?'
      ).then(ans => {
        if (ans.isDismissed) {
          this.loading = false;
          return;
        } else {
          //se ejecuta el procedimiento pup_cancelaxsolpago
        }
      });
    } else if (refactura == 'V') {
      this.alertQuestion(
        'warning',
        `Se cancelaran las facturas de los bienes en estatus VNR`,
        '¿Desea continuar?'
      ).then(ans => {
        if (ans.isDismissed) {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(true, 0);
          return;
        } else {
        }
      });
    }
  }

  close() {
    this.modalRef.hide();
  }
}
