import { Component, OnInit } from '@angular/core';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { INVOICE_STATUS_COLUMNS } from './invoice-status-columns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CBmFEdfCInvoiceStatusModalComponent } from '../c-bm-f-edf-c-invoice-status-modal/c-bm-f-edf-c-invoice-status-modal.component';

@Component({
  selector: 'app-c-bm-f-edf-c-invoice-status',
  templateUrl: './c-bm-f-edf-c-invoice-status.component.html',
  styles: [
  ]
})
export class CBmFEdfCInvoiceStatusComponent extends BasePage implements OnInit {

  settings = TABLE_SETTINGS;
  constructor(private modalService: BsModalService) { 
    super();
    this.settings.columns = INVOICE_STATUS_COLUMNS;
  }

  ngOnInit(): void {

  }

  openModal(): void {

    const modalRef = this.modalService.show(CBmFEdfCInvoiceStatusModalComponent, {
      
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

  }

  data = [
    {
      id: "CER",
      descripcion: "Documento cerrado se terminó su función",
    },
    {
      id: "CEDI",
      descripcion: "Documento en espera de timbrado",
    },
    {
      id: "ACT",
      descripcion: "Documento Activo",
    },
    {
      id: "FOL",
      descripcion: "Documento foliado",
    },
  ];

}
