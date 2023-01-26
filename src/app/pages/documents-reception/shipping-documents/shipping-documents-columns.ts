const SHIPPING_DOCUMENTS_COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    sort: false,
  },
  subject: {
    title: 'Asunto',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    sort: false,
  },
  criminalCase: {
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
