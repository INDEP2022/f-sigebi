import { Component, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckVerifyComplianceComponent } from './check-verify-compliance/check-verify-compliance.component';

@Component({
  selector: 'app-verify-compliance-goods',
  templateUrl: './verify-compliance-goods.component.html',
  styles: [],
})
export class VerifyComplianceGoodsComponent extends BasePage implements OnInit {
  toggleInformation: boolean = true;
  @Input() nombrePantalla: string = 'sinNombre';

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
      Descripción: { title: 'Descripción', type: 'text' }, // TEXTO
      noGestion: { title: 'No. Gestión', type: 'number' }, // NUMEROS
      noSolicitudTransferencia: {
        title: 'No. Solicitud Transferencia',
        type: 'number',
      }, // NUMEROS
      subInventario: { title: 'Sub. Inventario', type: 'text' },
      cumpleArticulo24: {
        title: 'Cumple Articulo 24',
        type: 'custom',
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'cumpleArticulo24';
          instance.checkIdField = 'cumpleArticulo24';
          instance.nombrePantalla = this.nombrePantalla;
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
      cumpleArticulo28: {
        title: 'Cumple Articulo 28',
        type: 'custom',
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'cumpleArticulo28';
          instance.checkIdField = 'cumpleArticulo28';
          instance.nombrePantalla = this.nombrePantalla;
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
      cumpleArticulo29: {
        title: 'Cumple Articulo 29',
        type: 'custom',
        valuePrepareFunction: (cell: any, row: any) => cell,
        onComponentInitFunction: (instance: any) => {
          instance.checkId = 'cumpleArticulo29';
          instance.checkIdField = 'cumpleArticulo29';
          instance.nombrePantalla = this.nombrePantalla;
        },
        renderComponent: CheckVerifyComplianceComponent,
      },
    },
  };

  data = [
    {
      _id: '1',
      Descripción: 'LICUADORAS INDUSTRIALES', // TEXTO
      noGestion: 8904036, // NUMEROS
      noSolicitudTransferencia: 1574, // NUMEROS
      subInventario: 'Vendidos',
      cumpleArticulo24: false,
      cumpleArticulo28: false,
      cumpleArticulo29: false,
    },
    {
      _id: '2',
      Descripción: 'ESTERILIZADORES', // TEXTO
      noGestion: 8904042, // NUMEROS
      noSolicitudTransferencia: 1574, // NUMEROS
      subInventario: 'Destruccion',
      cumpleArticulo24: false,
      cumpleArticulo28: false,
      cumpleArticulo29: false,
    },
  ];

  constructor() {
    super();
  }

  ngOnInit() {}
  userSelectRows(event: any) {
    console.log(event);
    // this.selected = event;
  }
}
