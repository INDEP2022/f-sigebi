export const COLUMNS2 = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction(call: any, row: any) {
      return row.good.description;
    },
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
};
