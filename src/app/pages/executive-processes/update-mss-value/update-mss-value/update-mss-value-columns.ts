import { DatePipe } from '@angular/common';

const datePipe = new DatePipe('en-US');

export const UPDATE_MASS_VALUE_COLUMNS = {
  proficientOpinion: {
    title: 'Solicitante',
    width: '25px',
    type: 'string',
    sort: false,
  },
  appraisalVigDate: {
    title: 'Fecha de Avalúo',
    type: 'string', // Cambiamos el tipo a 'string'
    sort: false,
  },
  valuerOpinion: {
    title: 'Perito',
    type: 'string',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  appraisedValue: {
    title: 'Valor avalúo',
    type: 'string',
    sort: false,
  },
  appraisalCurrencyKey: {
    title: 'Moneda',
    type: 'string',
    sort: false,
  },
};
