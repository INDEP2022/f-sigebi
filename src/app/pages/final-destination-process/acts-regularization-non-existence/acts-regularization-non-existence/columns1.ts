import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS1 = {
  goodNumber: {
    title: 'No. Bien',
    type: 'number',
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
  act: {
    title: 'Acta',
    type: 'string',
    sort: false,
  },
};

export const ACTASRIF = {
  statusProceedings: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  keysProceedings: {
    title: 'Clave Acta',
    type: 'string',
    sort: false,
  },
  elaborationDate: {
    title: 'Fecha de Elaboración',
    type: 'html',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  captureDate: {
    title: 'Fecha de Captura',
    type: 'html',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  numFile: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },
};
