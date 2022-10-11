const SHIPPING_DOCUMENTS_COLUMNS = {
  noVolante: {
    title: 'No. Volante',
    sort: false,
  },
  asunto: {
    title: 'Asunto',
    sort: false,
  },
  aver: {
    title: 'Averiguación Previa',
    sort: false,
  },
  causa: {
    title: 'Causa Penal',
    sort: false,
  },
  department: {
    title: 'Departamento',
    sort: false,
  },
};

const SHIPPING_DOCUMENTS_EXAMPLE_DATA = [
  {
    noVolante: 123456789,
    asunto: 'DIVERSOS',
    aver: '',
    causa: '',
    department: 'DIRECCION EJECUTIVA DE COORDINACIÓN',
  },
];

export { SHIPPING_DOCUMENTS_COLUMNS, SHIPPING_DOCUMENTS_EXAMPLE_DATA };
