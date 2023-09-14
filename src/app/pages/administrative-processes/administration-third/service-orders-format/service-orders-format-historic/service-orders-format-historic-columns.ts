import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const SERVICEORDERSFORMATHISTORIC_COLUMNS = {
  changeDate: {
    title: 'Fecha de cambio',
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
  justification: {
    title: 'Justificación',
    width: '30%',
    sort: false,
  },
  status: {
    title: 'Estado',
    width: '10%',
    sort: false,
  },
  user: {
    title: 'Usuario',
    width: '10%',
    sort: false,
  },
};
