export const COLUMNS2 = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  'good.goodClassNumber': {
    title: 'No. Clasificación',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      return row.good.goodClassNumber;
    },
  },
  'good.description': {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      return row.good.description;
    },
  },
  'good.quantity': {
    title: 'Cantidad',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      return row.good.quantity;
    },
  },
  'good.unit': {
    title: 'Unidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      return row.good.unit;
    },
  },
};

export const RELATED_FOLIO_COLUMNS = {
  id: {
    title: 'Folio',
    sort: false,
  },
  sheets: {
    title: 'Documentos',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción del Documento',
    sort: false,
  },
};
