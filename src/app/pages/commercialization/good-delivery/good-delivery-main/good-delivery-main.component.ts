import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOOD_DELIVERY_COLUMNS } from './good-delivery-columns';

@Component({
  selector: 'app-good-delivery-main',
  templateUrl: './good-delivery-main.component.html',
  styles: [],
})
export class GoodDeliveryMainComponent extends BasePage implements OnInit {
  selectedRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  goodsColumns: any[] = [];
  goodsSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  goodsTestData = [
    {
      file: 1001,
      goodId: 1101,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'EJEMPLO ESTADO',
    },
    {
      file: 1002,
      goodId: 1102,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'EJEMPLO ESTADO',
    },
    {
      file: 1003,
      goodId: 1103,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'EJEMPLO ESTADO',
    },
    {
      file: 1004,
      goodId: 1104,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'EJEMPLO ESTADO',
    },
    {
      file: 1005,
      goodId: 1105,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'EJEMPLO ESTADO',
    },
  ];

  goodsTestData2 = [
    {
      file: 1001,
      goodId: 1101,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'ENTREGADO',
    },
    {
      file: 1002,
      goodId: 1102,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'ENTREGADO',
    },
    {
      file: 1003,
      goodId: 1103,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'ENTREGADO',
    },
    {
      file: 1004,
      goodId: 1104,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'ENTREGADO',
    },
    {
      file: 1005,
      goodId: 1105,
      description: 'EJEMPLO DESCRIPCION DE BIEN',
      status: 'ENTREGADO',
    },
  ];

  constructor() {
    super();
    this.goodsSettings.columns = GOOD_DELIVERY_COLUMNS;
  }

  ngOnInit(): void {}

  getData() {
    this.goodsColumns = this.goodsTestData;
    this.totalItems = this.goodsColumns.length;
  }

  selectRows(rows: any[]) {
    this.selectedRows = rows;
  }

  changeStatus() {
    // Llamar servicio para cambiar estado
    console.log(this.selectedRows);
    this.onLoadToast(
      'success',
      'Estatus cambiado con éxito',
      `Se cambio el estado de ${this.selectedRows.length} bienes.`
    );
    this.selectedRows = [];
    this.getData();
  }
}
