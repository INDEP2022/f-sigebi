export const COLUMNS2 = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      if (row.numberGood) {
        return row.numberGood;
      }
      return row.goodNumber;
    },
  },
  'good.goodClassNumber': {
    title: 'No. Clasificación',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      if (row.good) {
        return row.good.goodClassNumber;
      }
      return row.classificationNumber;
    },
  },
  'good.description': {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      if (row.good) {
        return row.good.description;
      }

      return row.diDescGood;
    },
  },
  'good.quantity': {
    title: 'Cantidad',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      if (row.good) {
        return row.good.quantity;
      }

      return row.amount;
    },
  },
  'good.unit': {
    title: 'Unidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell, row) => {
      if (row.good) {
        return row.good.unit;
      }
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
