import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'reference-modal',
  templateUrl: './reference.component.html',
  styles: [
    `
      .stl {
        margin-top: -30px !important;
      }
    `,
  ],
})
export class ReferenceModalComponent extends BasePage implements OnInit {
  title: string = 'Referencia';
  data: any;
  info: any;
  referencia1: any;
  constructor(
    private modalRef: BsModalRef,
    private comerInvoiceService: ComerInvoiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.comerInvoiceService
      .getVeatInvoice(this.data.eventId, this.data.billId)
      .subscribe({
        next: resp => {
          this.info = resp;
          this.referencia1 = this.info.referencia1;
          this.loading = false;
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
