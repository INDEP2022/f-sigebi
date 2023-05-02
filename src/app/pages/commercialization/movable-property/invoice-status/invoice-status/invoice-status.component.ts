import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
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

  constructor(private modalService: BsModalService) {
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

  ngOnInit(): void {}

  data = [
    {
      id: 'CER',
      descripcion: 'Documento cerrado se terminó su función',
    },
    {
      id: 'CEDI',
      descripcion: 'Documento en espera de timbrado',
    },
    {
      id: 'ACT',
      descripcion: 'Documento Activo',
    },
    {
      id: 'FOL',
      descripcion: 'Documento foliado',
    },
  ];

  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  openModal(context?: Partial<InvoiceStatusModalComponent>) {
    const modalRef = this.modalService.show(InvoiceStatusModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  getData() {
    this.loading = true;
    this.columns = this.data;
    this.totalItems = this.data.length;
    this.loading = false;
  }
}
