/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-c-maintenance-legal-rulings-copy-documentation-goods',
  templateUrl:
    './pj-c-maintenance-legal-rulings-copy-documentation-goods.component.html',
})
export class PJMaintenanceLegalRulingCopyDocumentationGoodsComponent
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
      noDictaminacion: { title: 'No. dictaminación' },
      tipoDictaminacion: { title: 'Tipo DictaminaciÓn' },
      destinatarioCopia: { title: 'Destinatario Copia' },
      nodestinatarioCopia: { title: 'No. Destinatario Copia' },
      personaExtInt: { title: 'Persona Ext. Int.' },
      nombrePersonaExt: { title: 'Nombre Persona Ext.' },
    },
  };
  // Data table
  dataTable = [
    {
      noDictaminacion: 'DATA',
      tipoDictaminacion: 'DATA',
      destinatarioCopia: 'DATA',
      noDestinatarioCopia: 'DATA',
      personaExtInt: 'DATA',
      nombrePersonaExt: 'DATA',
    },
  ];
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
  }
}
