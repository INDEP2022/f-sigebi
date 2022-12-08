/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-password-calendar',
  templateUrl: './password-calendar.component.html',
  styleUrls: ['./password-calendar.component.scss'],
})
export class PasswordCalendarComponent
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
      usuario: { title: 'USUARIO' }, // 30 char
      nombre: { title: 'NOMBRE' }, // 100 char
      ingresoPrimeraVez: { title: 'INGRESO PRIMER VEZ' }, // 30 char
      ultimoCambioPassword: { title: 'ÚLTIMO CAMBIO PASSWORD' }, // 30 char
      requiereActualizacion: { title: 'REQUIERE ACTUALIZACIÓN' }, // 1 char
      diasVigencia: { title: 'DIAS VIGENCIA' }, // 5 number
      expiraDia: { title: 'EXPIRA EL DÍA' }, // 30 char
    },
  };

  data = [
    {
      usuario: 'DATA', // 30 char
      nombre: 'DATA', // 100 char
      ingresoPrimeraVez: 'DATA', // 30 char
      ultimoCambioPassword: 'DATA', // 30 char
      requiereActualizacion: 'DATA', // 1 char
      diasVigencia: 'DATA', // 5 number
      expiraDia: 'DATA', // 30 char
    },
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
  }
}
