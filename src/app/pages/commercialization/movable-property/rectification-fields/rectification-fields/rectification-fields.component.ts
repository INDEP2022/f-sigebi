import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECTIFICATION_FIELDS_COLUMNS } from '../rectification-fields-columns';

@Component({
  selector: 'app-rectification-fields',
  templateUrl: './rectification-fields.component.html',
  styles: [],
})
export class RectificationFieldsComponent extends BasePage implements OnInit {
  constructor() {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...RECTIFICATION_FIELDS_COLUMNS },
    };
  }

  ngOnInit(): void {}

  data = [
    {
      column: 'SERIE',
      fieldInvoice: 'SERIE',
      table: 'COMER_DETFACTURAS',
    },
    {
      column: 'MODELO',
      fieldInvoice: 'MODELO',
      table: 'COMER_DETFACTURAS',
    },
    {
      column: 'MARCA',
      fieldInvoice: 'MARCA',
      table: 'COMER_DETFACTURAS',
    },
    {
      column: 'NO_BIEN',
      fieldInvoice: 'NO_BIEN',
      table: 'COMER_DETFACTURAS',
    },
    {
      column: 'DESCRIPCIÓN',
      fieldInvoice: 'DESCRIPCIÓN',
      table: 'COMER_DETFACTURAS',
    },
    {
      column: 'TIPO',
      fieldInvoice: 'TIPO',
      table: 'COMER_DETFACTURAS',
    },
  ];
}
