import { DatePipe } from '@angular/common';

export const COUNT_TIIE_COLUMNS = {
  // id: {
  //   title: 'Id',
  //   type: 'number',
  //   sort: false,
  // },
  tiieDays: {
    title: 'Dias Tiie',
    type: 'number',
    sort: true,
    valuePrepareFunction: (dias: number) => {
      var formatted = Math.trunc(dias);
      return formatted;
    },
  },
  tiieAverage: {
    title: 'Promedio Tiie',
    type: 'number',
    sort: true,
    valuePrepareFunction: (avg: number) => {
      var formatted = Math.trunc(avg);
      return formatted;
    },
  },
  tiieMonth: {
    title: 'Mes Tiie',
    type: 'number',
    sort: true,
  },
  tiieYear: {
    title: 'Año Tiie',
    type: 'number',
    sort: true,
  },
  user: {
    title: 'Usuario',
    type: 'text',
    sort: true,
  },
  registryDate: {
    title: 'Fecha de registro',
    type: 'string',
    sort: true,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
};
