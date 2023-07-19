//Components

import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  no_appointment: {
    title: 'Nombramiento',
    sort: false,
  },
  noGoods: {
    title: 'No. Bien',
    sort: false,
  },
  payId: {
    title: 'Id Pago',
    sort: false,
  },
  amount: {
    title: 'Monto',
    sort: false,
  },
  iva: {
    title: 'Iva',
    sort: false,
  },
  ivaAmount: {
    title: 'Monto Iva',
    sort: false,
  },
  payment: {
    title: 'Abono',
    sort: false,
  },
  actPay: {
    title: 'Pago Act',
    sort: false,
  },
  impWithoutIva: {
    title: 'Imp. Sin Iva',
    sort: false,
  },
  payIdGens: {
    title: 'Id Pagogens',
    sort: false,
  },
  status: {
    title: 'Status',
    sort: false,
  },
  cubrioPayId: {
    title: 'Id Pago cubrido',
    sort: false,
  },
  coveredPayment: {
    title: 'Abono Cubierto',
    sort: false,
  },
  processDate: {
    title: 'Fecha Proceso',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  payObserv: {
    title: 'Observación Pago',
    sort: false,
  },
  reference: {
    title: 'Referencia',
    sort: false,
  },
  not_transferring: {
    title: 'Transferente',
    sort: false,
  },
};
