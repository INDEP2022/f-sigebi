import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('en-US');

export const UPDATE_MASS_VALUE_COLUMNS = {
  SOLICITANTE: {
    title: 'Solicitante',
    width: '25px',
    type: 'string',
    sort: false,
  },
  FECAVALUO: {
    title: 'Fecha de Avalúo',
    type: 'html',
    sort: false,
  },
  INSTITUCION: {
    title: 'Institución',
    type: 'string',
    sort: false,
  },
  PERITO: {
    title: 'Perito',
    type: 'string',
    sort: false,
  },
  OBSERV: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },
  NOBIEN: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  VALORAVALUO: {
    title: 'Valor avalúo',
    type: 'string',
    sort: false,
  },
  MONEDA: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
};
