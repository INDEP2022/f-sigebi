export const SEARCH_COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    type: 'number',
    sort: false,
  },
  receiptDate: {
    title: 'Fecha Recepción',
    type: 'string',
    sort: false,
  },
  captureDate: {
    title: 'Fecha Captura',
    type: 'string',
    sort: false,
  },
  indiciadoNumber: {
    title: 'No. Indiciado',
    type: 'string',
    sort: false,
  },
  versionUser: {
    title: 'Indiciado',
    type: 'string',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  institutionNumber: {
    title: 'Autoridad Emisora',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  expedientNumber: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  affairKey: {
    title: 'No. Asunto ',
    type: 'string',
    sort: false,
  },
  affair: {
    title: 'Descripción del Asunto ',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
};
