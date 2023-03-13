const SHIPPING_DOCUMENTS_COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    sort: false,
  },
  affair: {
    title: 'Asunto',
    sort: false,
    valuePrepareFunction: (affair: any) => affair?.description,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    sort: false,
  },
  departament: {
    title: 'Departamento',
    sort: false,
    valuePrepareFunction: (departament: any) => departament?.description,
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
