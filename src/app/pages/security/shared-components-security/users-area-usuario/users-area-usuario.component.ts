/** BASE IMPORT */
import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

@Component({
  selector: 'ngx-users-area-usuario',
  templateUrl: './users-area-usuario.component.html',
  styleUrls: ['./users-area-usuario.component.scss'],
})
export class UsersAreaUsuarioComponent extends BasePage implements OnInit {
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
      noDelegacion: { title: 'No. Delegacion -- Descripción' }, // Descripcion
      noSubdelegacion: { title: 'No. Subdelegacion -- Descripción' }, // Descripcion
      noDepartamento: { title: 'No. Departamento -- Descripción' }, // Descripcion
      asignado: { title: 'Asignado' },
    },
  };

  data = [
    {
      noDelegacion: '12345 -- Descripción delegacion', // Descripcion
      noSubdelegacion: '12345 -- Descripción delegacion', // Descripcion
      noDepartamento: '12345 -- Descripción delegacion', // Descripcion
      asignado: 'Asignado',
    },
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
  }
}
