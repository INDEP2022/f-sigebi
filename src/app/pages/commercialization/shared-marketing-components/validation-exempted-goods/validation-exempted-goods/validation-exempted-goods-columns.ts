export const GOODS_COLUMS = {
  id: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.goodNumber != null) return row.goodNumber.id;
    },
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.goodNumber != null) return row.goodNumber.description;
    },
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.goodNumber != null) return row.goodNumber.unit;
    },
  },
  process: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
};

export const PROCCESS_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  process: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
  registryNumber: {
    title: 'No. de Registro',
    type: 'string',
    sort: false,
  },
};
