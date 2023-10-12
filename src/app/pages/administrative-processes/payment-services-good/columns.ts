import { formatForIsoDate } from 'src/app/shared/utils/date';

export const COLUMNS = {
  paymentServiceNumber: {
    title: 'Solicitud',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  statusDescription: {
    title: 'Descripción',
    sort: false,
  },
  serviceKey: {
    title: 'Servicio',
    sort: false,
  },
  serviceDescription: {
    title: 'Descripción',
    sort: false,
  },
  requestDate: {
    title: 'Fecha de Solicitud',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return formatForIsoDate(row.requestDate, 'string');
    },
  },
  paymentDate: {
    title: 'Fecha de Pago',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return formatForIsoDate(row.paymentDate, 'string');
    },
  },
  cost: {
    title: 'Importe',
    sort: false,
  },
};
