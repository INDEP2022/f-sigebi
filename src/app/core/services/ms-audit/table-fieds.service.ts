const example: Partial<IListResponse<ITableField>> = {
  data: [
    {
      registerNumber: 1,
      table: 'COMER_CLIENTES',
      column: 'ID_CLIENTE'.substring(0, 7), //Máximo 200,
      columnDescription: 'No. Cliente',
      dataType: 'NUMBER',
    },
    {
      registerNumber: 2,
      table: 'COMER_CLIENTES',
      column: 'NOM_RAZON'.substring(0, 100), //Máximo 100
      columnDescription: 'Nombre o Razón Social',
      dataType: 'VARCHAR2',
    },
    {
      registerNumber: 3,
      table: 'COMER_CLIENTES',
      column: 'RFC'.substring(0, 20), //Máximo 20
      columnDescription: 'RFC',
      dataType: 'VARCHAR2',
    },
  ],
  count: 3,
};

import { Injectable } from '@angular/core';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITableField } from '../../models/ms-audit/table-field.model';

@Injectable({
  providedIn: 'root',
})
export class TableFieldsService extends HttpService {
  constructor() {
    super();
    this.microservice = 'audit';
  }

  getAllFiltered(params: _Params) {
    return this.get<IListResponse<ITableField>>(
      'table-fields/get-info-table-fields',
      params
    );
  }
}
