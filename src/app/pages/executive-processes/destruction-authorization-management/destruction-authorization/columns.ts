import { format } from 'date-fns';

export const PROCEEDINGS_COLUMNS = {
  id: {
    title: 'No.',
    sort: false,
  },
  keysProceedings: {
    title: 'CVE Acta',
    sort: false,
  },
  elaborationDate: {
    title: 'Fecha elaboración',
    sort: false,
    valuePrepareFunction: (value: string) => {
      console.log(value);
      const date = value ? new Date(value) : null;
      return date ? format(date, 'yyyy-MM-dd') : null;
    },
  },
  /*datePhysicalReception: {
    title: 'Fecha recepción',
    sort: false,
  },*/
  captureDate: {
    title: 'Fecha captura',
    valuePrepareFunction: (value: string) => {
      console.log(value);
      const date = value ? new Date(value) : null;
      return date ? format(date, 'yyyy-MM-dd') : null;
    },
    sort: false,
  },
  statusProceedings: {
    title: 'Estado',
    sort: false,
  },
};

export const DETAIL_PROCEEDINGS_DELIVERY_RECEPTION = {
  numberGood: {
    title: 'No. Bien',
    sort: false,
  },
  good: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  amount: {
    title: 'Cantidad',
    sort: false,
  },
};

export const GOODS_COLUMNS = {
  id: {
    title: 'No. Bien',
    width: '25px',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  requestFolio: {
    title: 'Of. Sol.',
    type: 'string',
    sort: false,
  },
};

export const DICTATION_COLUMNS = {
  dictation: {
    title: 'DICTAMINACIONES',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.passOfficeArmy;
    },
  },
};

export const ACTA_RECEPTION_COLUMNS = {
  offices: {
    title: 'ACTAS DE RECEPCIÓN',
    sort: false,
  },
};
