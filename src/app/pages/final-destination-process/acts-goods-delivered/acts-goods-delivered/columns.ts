import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'number',
    sort: false,
  },
  amount: {
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
    title: 'Estatus',
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
  numTransfer_: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
    filter: false,
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

export const TRANSFERENTES = {
  id: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
    width: '30%',
  },
  keyTransferent: {
    title: 'Clave Transferente',
    type: 'string',
    sort: false,
    width: '35%',
  },
  nameTransferent: {
    title: 'Descripción Transferente',
    type: 'string',
    sort: false,
    width: '35%',
  },
};

export const DELEGACIONES = {
  id: {
    title: 'No. Delegación',
    type: 'string',
    sort: false,
    width: '30%',
  },
  keyTransferent: {
    title: 'Clave Transferente',
    type: 'string',
    sort: false,
    width: '35%',
  },
};

export const GOODS_ERRORS = {
  BIEN: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
    width: '30%',
  },
  ERROR: {
    title: 'Error',
    type: 'string',
    sort: false,
    width: '70%',
  },
};
