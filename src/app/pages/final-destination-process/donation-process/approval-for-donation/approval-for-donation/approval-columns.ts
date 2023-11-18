import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const APPROVAL_COLUMNS = {
  cveAct: {
    title: 'Clave Evento',
    type: 'string',
    sort: false,
  },
  captureDate: {
    title: 'Fecha Captura',
    type: 'number',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('-').reverse().join('/') : ''}`;
    },
  },
  elaborated: {
    title: 'Ingresó',
    type: 'string',
    sort: false,
  },
  estatusAct: {
    title: 'Estatus Evento',
    type: 'string',
    sort: false,
  },
};

export const GOOD_COLUMNS = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
};

export const DETALLES = {
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  RIC: {
    title: 'RIC',
    sort: false,
  },
  CH: {
    title: 'CH',
    sort: false,
  },
  N: {
    title: 'N',
    sort: false,
  },
  Q: {
    title: 'Q',
    sort: false,
  },
};
