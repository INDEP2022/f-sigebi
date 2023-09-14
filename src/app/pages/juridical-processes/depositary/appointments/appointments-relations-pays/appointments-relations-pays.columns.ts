import { DatePipe } from '@angular/common';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS_APPOINTMENT_RELATIONS_PAYS = {
  datePay: {
    title: 'Fecha Pago', // FECHA PAGO Y CONCEPTO
    sort: false,
    with: 25,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  payConcept: {
    title: 'Concepto Pago', // DESCRIPCION PAGO
    sort: false,
    with: 25,
  },
  amount: {
    title: 'Importe', // IMPORTE
    sort: false,
    with: 10,
  },
  observation: {
    title: 'Observaciones', // OBSERVACIONES
    sort: false,
    with: 40,
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
