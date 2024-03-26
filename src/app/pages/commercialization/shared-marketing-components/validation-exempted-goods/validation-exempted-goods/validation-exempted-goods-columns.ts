export const GOODS_COLUMS = {
  'goodNumber.id': {
    title: 'No. Bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.goodNumber != null) return row.goodNumber.id;
    },
    filterFunction: (cell?: any, search?: string) => {
      return true;
    },
  },
  'goodNumber.description': {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.goodNumber != null) return row.goodNumber.description;
    },
    filterFunction: (cell?: any, search?: string) => {
      return true;
    },
  },
  'goodNumber.unit': {
    title: 'Unidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.goodNumber != null) return row.goodNumber.unit;
    },
    filterFunction: (cell?: any, search?: string) => {
      return true;
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
