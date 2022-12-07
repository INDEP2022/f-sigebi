/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-capture-formalizing-lawyers',
  templateUrl: './capture-formalizing-lawyers.component.html',
  styleUrls: ['./capture-formalizing-lawyers.component.scss'],
})
export class CaptureFormalizingLawyersComponent
  extends BasePage
  implements OnInit, OnDestroy
{
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
      id: { title: 'ID' },
      razonSocial: { title: 'Razón Social' },
      nombre: { title: 'Nombre' },
      apellidoPaterno: { title: 'Apellido Paterno' },
      apellidoMaterno: { title: 'Apellido Materno' },
      rfcFisica: { title: 'RFC Física' },
      rfcMoral: { title: 'RFC Moral' },
      telefono: { title: 'Teléfono' },
      email: { title: 'Correo Electrónico' },
    },
  };
  // Data table
  dataTable = [
    {
      id: 'DATA',
      razonSocial: 'DATA',
      nombre: 'DATA',
      apellidoPaterno: 'DATA',
      apellidoMaterno: 'DATA',
      rfcFisica: 'DATA',
      rfcMoral: 'DATA',
      telefono: 'DATA',
      email: 'DATA',
    },
  ];
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
  }
}
