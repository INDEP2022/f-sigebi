import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const SERVICEORDERSFORMATEXPEDIENT_COLUMNS = {
  key: {
    title: 'Cve. Acta',
    width: '30%',
    sort: false,
  },
  status: {
    title: 'Estado',
    width: '10%',
    sort: false,
  },
  user: {
    title: 'Usuario Elaboró',
    width: '20%',
    sort: false,
  },
};

export const SERVICEORDERSFORMATEXPEDIENTGOOD_COLUMNS = {
  NumberGood: {
    title: 'Bien',
    width: '15%',
    sort: false,
  },
  status: {
    title: 'Estado',
    width: '15%',
    sort: false,
  },
  description: {
    title: 'Descripción',
    width: '30%',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    width: '10%',
    sort: false,
  },
  DateIni: {
    title: 'Fecha Inicial de Programación',
    width: '15%',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'yyyy/MM/dd', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  DateFin: {
    title: 'Fecha Final de Programación',
    width: '15%',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'yyyy/MM/dd', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
