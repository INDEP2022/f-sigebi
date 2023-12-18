export const COLUMNSTABLE2 = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  'good.description': {
    title: 'Descripcion',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.description) {
        return row.good.description;
      } else {
        return null;
      }
    },
  },
  'good.extDomProcess': {
    title: 'Proceso',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.extDomProcess) {
        return row.good.extDomProcess;
      } else {
        return null;
      }
    },
  },
  'good.quantity': {
    title: 'Cantidad',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.quantity) {
        return row.good.quantity;
      } else {
        return null;
      }
    },
  },
};
