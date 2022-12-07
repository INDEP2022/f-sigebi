import { Component, OnInit } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { RebillingCausesModalComponent } from '../rebilling-causes-modal/rebilling-causes-modal.component';
import { REBILLING_CAUSES_COLUMNS } from './rebilling-causes-columns';

@Component({
  selector: 'app-rebilling-causes',
  templateUrl: './rebilling-causes.component.html',
  styles: [],
})
export class RebillingCausesComponent extends BasePage implements OnInit {
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
      columns: { ...REBILLING_CAUSES_COLUMNS },
    };
  }

  ngOnInit(): void {}

  data = [
    {
      id: '41',
      descripcion: 'CORRECIÓN DE DATOS',
      refCan: 'REFACTURA',
      aplica: 'FACTURA',
      comentarios: 'CORRECIÓN DE FACTURA',
    },
    {
      id: '121',
      descripcion: 'COMPROBANTE EN DOS CFDIS',
      refCan: 'REFACTURA',
      aplica: 'AMBAS',
      comentarios: 'SE DIVIDE FACTURA EN DOS POR LOS BIENES',
    },
    {
      id: '2',
      descripcion: 'SE ATASCO PAPEL EN IMPRESORA',
      refCan: 'REFACTURA',
      aplica: 'FACTURA',
      comentarios: 'AL LLEVAR A CABO LA IMPRESIÓN SE ATASCO EL PAPEL',
    },
    {
      id: '2',
      descripcion: 'DATOS DE LA FACTURA INCORRECTOS',
      refCan: 'CANCELA',
      aplica: 'DEVOLUCIÓN',
      comentarios: 'DATOS DEL CLIENTE INCORRECTOS',
    },
  ];

  //Rellenar formulario con datos de la tabla
  openForm(allotment?: any) {
    this.openModal({ allotment });
  }

  openModal(context?: Partial<RebillingCausesModalComponent>) {
    const modalRef = this.modalService.show(RebillingCausesModalComponent, {
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
