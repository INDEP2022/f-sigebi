import { DatePipe } from '@angular/common';

export const COLUMNS_HISTORICAL_GOODS_EXTDOM = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  dateChange: {
    title: 'Fec. Cambio',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy HH:mm:ss');
    },
  },
  userChange: {
    title: 'Usuario Cambio',
    sort: false,
  },
  invoiceUnivChange: {
    title: 'Folio Universal Cambio',
    sort: false,
  },
  datefree: {
    title: 'Fec. Libera',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy HH:mm:ss');
    },
  },
  userfree: {
    title: 'Usuario Libera',
    sort: false,
  },
  invoiceUnivfree: {
    title: 'Folio Universal Libera',
    sort: false,
  },
};
