export const PROCEEDINGSCONVERSION_COLUMNS = {
  notGood: {
    title: 'No Bien',
    width: '10%',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    width: '20%',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    width: '10%',
    sort: false,
  },
  proceedings: {
    title: 'Acta',
    width: '10%',
    sort: false,
  },
};
export const PROCEEDINGSCONVERSIONS_COLUMNS = {
  notGood: {
    title: 'No Bien',
    width: '10%',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    width: '20%',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    width: '10%',
    sort: false,
  },
};

export const GOODSEXPEDIENT_COLUMNS_GOODS = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  acta: {
    title: 'Acta',
    type: 'custom',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.fileNumber.minutesErNumber;
    },
  },
  // status: {
  //   title: 'Estatus',
  //   type: 'string',
  //   sort: false,
  // },
  // desEstatus: {
  //   title: 'Des. Estatus',
  //   type: 'string',
  //   sort: false,
  //   hide: true,
  // },
};
