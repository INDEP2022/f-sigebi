import { DatePipe } from '@angular/common';

export const SHIFT_CHANGE_HISTORY_COLUMNS = {
  numberSteeringwheel: {
    title: 'No. Volante',
    type: 'string',
    sort: false,
  },
  numberJob: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },
  datereassignment: {
    title: 'Fecha Reasignación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },
  personbefore: {
    title: 'Persona Anterior',
    type: 'string',
    sort: false,
  },
  areaDestinationbefore: {
    title: 'Área Anterior',
    type: 'string',
    sort: false,
  },
  areaDestinationnew: {
    title: 'Área Nueva',
    type: 'string',
    sort: false,
  },
  personnew: {
    title: 'Persona Nueva',
    type: 'string',
    sort: false,
  },
  argument: {
    title: 'Argumento',
    type: 'string',
    sort: false,
  },
};
