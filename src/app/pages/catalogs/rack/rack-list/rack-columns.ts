import { IBatch } from 'src/app/core/models/catalogs/batch.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';

export const RACK_COLUMNS = {
  id: {
    title: 'Código',
    type: 'number',
    sort: false,
  },
  idWarehouse: {
    title: 'Deposito',
    type: 'number',
    valuePrepareFunction: (value: IWarehouse) => {
      return value.description;
    },
    sort: false,
  },
  idBatch: {
    title: 'Lote',
    valuePrepareFunction: (value: IBatch) => {
      return value.description;
    },
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  // status: {
  //   title: 'Estado',
  //   type: 'string',
  //   sort: false,
  // },
  // registerNumber: {
  //   title: 'Numero Registro',
  //   type: 'number',
  //   sort: false,
  // },
};
