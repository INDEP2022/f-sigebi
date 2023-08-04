export const COLUMNS2 = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  good: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
};
