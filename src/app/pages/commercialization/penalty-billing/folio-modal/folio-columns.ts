import { ComerF } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';

export const BILLING_FOLIO_COLUMNS = {
  series: {
    title: 'Serie',
    type: 'string',
    sort: false,
  },
  invoice: {
    title: 'Folio',
    type: 'string',
    sort: false,
  },
  pulledapart: {
    title: 'Apartado',
    type: 'string',
    sort: false,
  },
  comerF: {
    title: 'Usuario Registro',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: ComerF) => (value ? value.recordUser : ''),
  },
  recordDate: {
    title: 'Fecha Registro',
    type: 'string',
    sort: false,
  },
};
