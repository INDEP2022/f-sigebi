import { DatePipe } from '@angular/common';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

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
    type: 'custom',
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
    renderComponent: SeeMoreComponent,
  },
};
