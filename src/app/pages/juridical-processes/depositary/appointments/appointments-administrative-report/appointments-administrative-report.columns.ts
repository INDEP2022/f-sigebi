import { DatePipe } from '@angular/common';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS_APPOINTMENT_ADMINISTRATIVE_REPORT = {
  dateRepo: {
    title: 'Fecha', // FECHA REPORTE
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  report: {
    title: 'Reporte', // REPORTE
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
};
