export let goodCheck: any[] = [];

export const ASSETS_DESTRUCTION_COLUMLNS = {
  numberGood: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  location: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  address: {
    title: 'Ubicación Exacta',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  cve_proceeding: {
    title: 'No. Oficio de Autorización y Fecha',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any, row: any) => {
      if (
        row.observationsDestruction != null &&
        row.observationsDestruction != 'null'
      ) {
        return row.observationsDestruction;
      } else if (value && value != null) {
        return `${value}  ${row.date_proceeding}`;
      } else {
        return null;
      }
    },
  },
  processExtDom: {
    title: 'Ext. Dom',
    type: 'string',
    sort: false,
  },
};
