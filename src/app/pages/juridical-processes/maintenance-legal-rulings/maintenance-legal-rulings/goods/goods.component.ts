/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
})
export class GoodsComponent extends BasePage implements OnInit, OnDestroy {
  // Table settings
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noDictaminacion: { title: 'No. dictaminación' },
      tipo: { title: 'Tipo' },
      noExpediente: { title: 'No. Expediente' },
      noBien: { title: 'No. Bien' },
      descripcion: { title: 'Descripción' },
      cantidad: { title: 'Cantidad' },
    },
  };
  // Data table
  dataTable = [
    {
      noDictaminacion: 'DATA',
      tipo: 'DATA',
      noExpediente: 'DATA',
      noBien: 'DATA',
      descripcion: 'DATA',
      cantidad: 'DATA',
    },
  ];
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
  }
}
