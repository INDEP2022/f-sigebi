import { DatePipe } from '@angular/common';

export const FLYER_HISTORY_COLUMNS = {
  consecutive: {
    title: 'Consecutivo',
    sort: false,
  },
  statusProcedure: {
    title: 'Estatus',
    sort: false,
  },
  usrturned: {
    title: 'Usuario Turnado',
    sort: false,
  },
  dateturned: {
    title: 'Fecha Turnado',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  observations: {
    title: 'Observaciones',
    sort: false,
  },
};
