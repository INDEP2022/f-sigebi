import { DatePipe } from '@angular/common';

export const INDICATORS_HISTORY_DETAIL_COLUMNS = {
  num: {
    title: 'No.',
    sort: false,
  },
  id: {
    title: 'Indicador',
    sort: false,
  },
  proceedingsNum: {
    title: 'Expediente',
    sort: false,
  },
  admissionDate: {
    title: 'Fecha Ingreso',
    sort: false,
    valuePrepareFunction: (date: any) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-US').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },
  workDate: {
    title: 'Fecha Trabajo',
    sort: false,
  },
  maxDate: {
    title: 'Fecha Maxima',
    sort: false,
  },
  complied: {
    title: 'Cumplio',
    sort: false,
  },
};
