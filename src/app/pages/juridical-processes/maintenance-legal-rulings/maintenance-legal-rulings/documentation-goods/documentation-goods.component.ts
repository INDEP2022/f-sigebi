/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-documentation-goods',
  templateUrl: './documentation-goods.component.html',
})
export class DocumentationGoodsComponent
  extends BasePage
  implements OnInit, OnDestroy
{
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
      noDictaminacion: { title: 'No. Dictaminación' },
      tipoDictaminacion: { title: 'Tipo Dictaminación' },
      noExpediente: { title: 'No. Expediente' },
      noBien: { title: 'No. Bien' },
      claveDocumento: { title: 'Clave Documento' },
      fechaRecibido: { title: 'Fecha Recibido' },
      usuarioRecibido: { title: 'Usuario Recibido' },
      fechaInsercion: { title: 'Fecha Inserción' },
      usuarioInserto: { title: 'Usuario Inserto' },
      fechaNotificacion: { title: 'Fecha Notificación' },
      asegDevClave: { title: 'Aseg. Dev. Clave' },
    },
  };
  // Data table
  dataTable = [
    {
      noDictaminacion: 'DATA',
      tipoDictaminacion: 'DATA',
      noExpediente: 'DATA',
      noBien: 'DATA',
      claveDocumento: 'DATA',
      fechaRecibido: 'DATA',
      usuarioRecibido: 'DATA',
      fechaInsercion: 'DATA',
      usuarioInserto: 'DATA',
      fechaNotificacion: 'DATA',
      asegDevClave: 'DATA',
    },
  ];
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
  }
}
