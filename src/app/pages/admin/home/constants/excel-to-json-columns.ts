export const EXCEL_TO_JSON_COLUMNS = {
  id: {
    title: 'ID',
    sort: false,
  },
  utf8: {
    title: 'Caracteres UTF-8',
    sort: false,
  },
  column1: {
    title: 'Columna',
    sort: false,
  },
  column2: {
    title: 'Columna',
    sort: false,
  },
  column3: {
    title: 'Columna',
    sort: false,
  },
};

export const EXCEL_TO_JSON = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  f_trnas: {
    title: 'Fecha Transferencia',
    sort: false,
  },
  f_sent: {
    title: 'Fecha Sentencia',
    sort: false,
  },
  Inte: {
    title: 'Intereses',
    sort: false,
  },
  f_teso: {
    title: 'Fecha Tesofe',
    sort: false,
  },
  o_teso: {
    title: 'Oficio Tesofe',
    sort: false,
  },
  aut: {
    title: 'Autoridad',
    sort: false,
  },
  causa_penal: {
    title: 'Causa Penal',
    sort: false,
  },
};

export const TO_JSON = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  desc_bien: { title: 'Descripción', sort: false },
  cont_no_intento: {
    title: 'Intentos de Venta',
    sort: false,
  },
};

export const DATA_BY = {
  idD: {
    title: 'Cve. Decomiso',
    sort: false,
  },
  id: {
    title: 'No. Bien',
    sort: false,
  },
  f_trnas: {
    title: 'Fecha Transferencia',
    sort: false,
  },
  f_sent: {
    title: 'Fecha Sentencia',
    sort: false,
  },
  Inte: {
    title: 'Intereses',
    sort: false,
  },
  tesofeDate: {
    title: 'Fecha Tesofe',
    sort: false,
  },
  tesofeFolio: {
    title: 'Oficio Tesofe',
    sort: false,
  },
  appraisalCurrencyKey: {
    title: 'Moneda',
    sort: false,
  },
  aut: {
    title: 'Autoridad',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.expediente == null) {
        return '';
      } else {
        return row.expediente.authorityNumber;
      }
    },
  },
  expedientecriminalCase: {
    title: 'Causa Penal',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.expediente == null) {
        return '';
      } else {
        return row.expediente.criminalCase;
      }
    },
  },
};
