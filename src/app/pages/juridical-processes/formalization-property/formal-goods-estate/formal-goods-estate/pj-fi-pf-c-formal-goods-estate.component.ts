/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  dataTableAsignaNotario,
  dataTableFormalizaEscrituracion,
  dataTableProcedeFormalizacion,
  dataTableTodos,
  tableSettingsAsignaNotario,
  tableSettingsFormalizaEscrituracion,
  tableSettingsProcedeFormalizacion,
  tableSettingsTodos,
} from './table-configuration-formal-goods-estate';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-fi-pf-c-formal-goods-estate',
  templateUrl: './pj-fi-pf-c-formal-goods-estate.component.html',
  styleUrls: ['./pj-fi-pf-c-formal-goods-estate.component.scss'],
})
export class PJFIPFFormalGoodsEstateComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  // Procede Formalizacion
  tableSettingsProcedeFormalizacion = tableSettingsProcedeFormalizacion;
  dataTableProcedeFormalizacion = dataTableProcedeFormalizacion;
  // Asigna Notario
  tableSettingsAsignaNotario = tableSettingsAsignaNotario;
  dataTableAsignaNotario = dataTableAsignaNotario;
  // Formaliza Escrituracion
  tableSettingsFormalizaEscrituracion = tableSettingsFormalizaEscrituracion;
  dataTableFormalizaEscrituracion = dataTableFormalizaEscrituracion;
  // Todos
  tableSettingsTodos = tableSettingsTodos;
  dataTableTodos = dataTableTodos;
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
  }
}
