const SHIFT_CHANGE_COLUMNS = {
  noBien: {
    title: 'Clave',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
};

const SHIFT_CHANGE_EXAMPLE_DATA = [
  {
    noBien: 'ADSF/DSFADS/SDFG',
    description: 'ENTREGA',
    cantidad: '2022/01/01',
  },
  {
    noBien: 'ADSF/DSFADS/SDFG',
    description: 'ENTREGA',
    cantidad: '2022/01/01',
  },
  {
    noBien: 'ADSF/DSFADS/SDFG',
    description: 'ENTREGA',
    cantidad: '2022/01/01',
  },
];

export { SHIFT_CHANGE_COLUMNS, SHIFT_CHANGE_EXAMPLE_DATA };
