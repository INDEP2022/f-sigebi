export const COLUMNS2 = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  goodClassNumber: {
    title: 'No. Clasificación',
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
  process: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
};
