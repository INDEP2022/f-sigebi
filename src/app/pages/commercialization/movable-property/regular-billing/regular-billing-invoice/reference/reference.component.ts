import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'reference-modal',
  templateUrl: './reference.component.html',
  styles: [],
})
export class ReferenceModalComponent extends BasePage implements OnInit {
  title: string = 'Referencia';
  data: any;
  info: any;
  constructor(
    private modalRef: BsModalRef,
    private comerInvoiceService: ComerInvoiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.comerInvoiceService
      .getVeatInvoice(this.data.eventId, this.data.billId)
      .subscribe({
        next: resp => {
          this.info = resp;
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
