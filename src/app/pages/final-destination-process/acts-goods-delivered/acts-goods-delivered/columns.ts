import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  goodNumb: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'number',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  process: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
};

export const ACTAS = {
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
  datePhysicalReception: {
    title: 'Fecha de Cierre',
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
