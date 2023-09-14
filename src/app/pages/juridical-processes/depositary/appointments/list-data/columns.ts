import { DatePipe } from '@angular/common';

export const COLUMNS_DATA = {
  numberAppointment: {
    title: 'No. Nombramiento',
    sort: false,
  },
  cveContract: {
    title: 'Cve. Contrato',
    sort: false,
  },
  datestartContract: {
    title: 'Fecha Inicio Contrato',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  representativeBe: {
    title: 'Representante INDEP',
    sort: false,
  },
};
