export const columnsGood = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  extDomProcess: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  acta: {
    title: 'Acta',
    type: 'string',
    sort: false,
  },
};

export const columnsGoodAct = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  'good.goodClassNumber': {
    title: 'No. Clasificación',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.goodClassNumber) {
        return row.good.goodClassNumber;
      } else {
        return null;
      }
    },
  },
  'good.description': {
    title: 'Descripción',
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
  'good.status': {
    title: 'Estatus',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.status) {
        return row.good.status;
      } else {
        return null;
      }
    },
  },
  'good.unit': {
    title: 'Unidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.unit) {
        return row.good.unit;
      } else {
        return null;
      }
    },
  },
};
