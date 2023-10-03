import { DatePipe } from '@angular/common';

export const FINANCIAL_INFORMATION_COLUMNS1 = {
  idGoodNumber: {
    title: 'Nombre',
    type: 'text',
    sort: false,
    // valuePrepareFunction: (value: IGood) => {
    //   return value?.description;
    // },
  },
  value: {
    title: 'Valor',
    type: 'number',
    sort: false,
    // valuePrepareFunction: (value: IGood) => {
    //   return value?.quantity;
    // },
  },
  description: {
    title: 'Descripción',
    type: 'text',
    sort: false,
  },
};

export const FINANCIAL_INFORMATION_COLUMNS2 = {
  idGoodNumber: {
    title: 'Nombre',
    type: 'text',
    sort: false,
    // valuePrepareFunction: (value: IGood) => {
    //   return value?.description;
    // },
  },
  idInfoDate: {
    title: 'Descripción',
    type: 'text',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },
};
