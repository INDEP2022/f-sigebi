import { Component, OnInit } from '@angular/core';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { StatusInvoiceService } from 'src/app/core/services/ms-parameterinvoice/status-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { InvoiceStatusModalComponent } from '../invoice-status-modal/invoice-status-modal.component';
import { INVOICE_STATUS_COLUMNS } from './invoice-status-columns';

@Component({
  selector: 'app-invoice-status',
  templateUrl: './invoice-status.component.html',
  styles: [],
})
export class InvoiceStatusComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  data: { id: string; description: string }[] = [];

  constructor(
    private modalService: BsModalService,
    private statusInvoiceService: StatusInvoiceService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...INVOICE_STATUS_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getData(),
    });
  }

  openForm(allotment?: any) {
    this.openModal(allotment);
  }

  openModal(context?: any) {
    let config: ModalOptions = {
      initialState: {
        allotment: context,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(InvoiceStatusModalComponent, config);
  }

  getData() {
    this.loading = true;
    this.statusInvoiceService
      .getAll(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => {
          this.loading = false;
          this.data = resp.data;
          this.totalItems = resp.count;
        },
        error: err => {
          this.data = [];
          this.totalItems = 0;
          this.alert('error', 'Error', err.error.message);
          this.loading = false;
        },
      });
  }
}
