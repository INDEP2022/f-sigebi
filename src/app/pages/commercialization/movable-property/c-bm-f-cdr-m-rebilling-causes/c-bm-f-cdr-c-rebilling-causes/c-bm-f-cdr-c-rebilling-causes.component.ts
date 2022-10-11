import { Component, OnInit } from '@angular/core';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { REBILLING_CAUSES_COLUMNS } from './rebilling-causes-columns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CBmFCdrCRebillingCausesModalComponent } from '../c-bm-f-cdr-c-rebilling-causes-modal/c-bm-f-cdr-c-rebilling-causes-modal.component';

@Component({
  selector: 'app-c-bm-f-cdr-c-rebilling-causes',
  templateUrl: './c-bm-f-cdr-c-rebilling-causes.component.html',
  styles: [
  ]
})
export class CBmFCdrCRebillingCausesComponent extends BasePage implements OnInit {

  settings = TABLE_SETTINGS;
  constructor(private modalService: BsModalService) {
    super();
    this.settings.columns = REBILLING_CAUSES_COLUMNS;
  }

  ngOnInit(): void {
  }

  openModal(): void {

    const modalRef = this.modalService.show(CBmFCdrCRebillingCausesModalComponent, {
      
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

  }

  data = [
    {
      id: "41",
      descripcion: "CORRECIÓN DE DATOS",
      refCan: "REFACTURA",
      aplica: "FACTURA",
      comentarios: "CORRECIÓN DE FACTURA",
    },
    {
      id: "121",
      descripcion: "COMPROBANTE EN DOS CFDIS",
      refCan: "REFACTURA",
      aplica: "AMBAS",
      comentarios: "SE DIVIDE FACTURA EN DOS POR LOS BIENES",
    },
    {
      id: "2",
      descripcion: "SE ATASCO PAPEL EN IMPRESORA",
      refCan: "REFACTURA",
      aplica: "FACTURA",
      comentarios: "AL LLEVAR A CABO LA IMPRESIÓN SE ATASCO EL PAPEL",
    },
    {
      id: "2",
      descripcion: "DATOS DE LA FACTURA INCORRECTOS",
      refCan: "CANCELA",
      aplica: "DEVOLUCIÓN",
      comentarios: "DATOS DEL CLIENTE INCORRECTOS",
    },
  ];

}
