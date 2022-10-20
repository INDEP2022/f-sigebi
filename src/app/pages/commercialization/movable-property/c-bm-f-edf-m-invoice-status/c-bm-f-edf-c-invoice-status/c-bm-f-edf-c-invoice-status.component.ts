import { Component, OnInit } from '@angular/core'; 

import { BasePage } from 'src/app/core/shared/base-page';
import { INVOICE_STATUS_COLUMNS } from './invoice-status-columns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CBmFEdfCInvoiceStatusModalComponent } from '../c-bm-f-edf-c-invoice-status-modal/c-bm-f-edf-c-invoice-status-modal.component';

@Component({
  selector: 'app-c-bm-f-edf-c-invoice-status',
  templateUrl: './c-bm-f-edf-c-invoice-status.component.html',
  styles: [],
})
export class CBmFEdfCInvoiceStatusComponent extends BasePage implements OnInit {
  
  columns: any[] = [];
  totalItems: number = 0;

  constructor(private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columTitle: "Acciones",
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

   openModal(context?: Partial<CBmFEdfCInvoiceStatusModalComponent>) {
    const modalRef = this.modalService.show(CBmFEdfCInvoiceStatusModalComponent, {
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
