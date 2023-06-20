import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS_APPOINTMENT_ADMINISTRATIVE_PAYS = {
  id: {
    title: 'Fecha Pago', // FECHA PAGO Y CONCEPTO
    sort: false,
  },
  typeDict: {
    title: 'Concepto Pago', // DESCRIPCION PAGO
    sort: false,
  },
  passOfficeArmy: {
    title: 'Importe', // IMPORTE
    sort: false,
  },
  observations: {
    title: 'Observaciones', // OBSERVACIONES
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
