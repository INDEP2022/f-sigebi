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
    valuePrepareFunction: (value: any) => {
      return formatearFecha(new Date(value));
    },
  },
  captureDate: {
    title: 'Fecha Captura',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return formatearFecha(new Date(value));
    },
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

export const formatearFecha = (fecha: Date) => {
  let dia: any = fecha.getDate();
  let mes: any = fecha.getMonth() + 1;
  let anio: any = fecha.getFullYear();
  dia = dia < 10 ? '0' + dia : dia;
  mes = mes < 10 ? '0' + mes : mes;
  let fechaFormateada = dia + '/' + mes + '/' + anio;
  return fechaFormateada;
};
