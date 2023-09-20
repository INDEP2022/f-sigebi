import * as moment from 'moment';

export const LIST_ORDERS_COLUMNS = {
  orderServiceId: {
    title: 'No. Ordern Servicio',
    type: 'text',
    sort: false,
  },
  orderServiceFolio: {
    title: 'Folio Ordern Servicio',
    type: 'text',
    sort: false,
  },
  orderServiceType: {
    title: 'Tipo Ordern Servicio',
    type: 'text',
    sort: false,
  },
  turnDate: {
    title: 'Fecha Turnado',
    type: 'text',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return moment(value).format('DD/MM/YYYY');
    },
  },
  delegationName: {
    title: 'Delegación Regional',
    type: 'text',
    sort: false,
  },
  transferent: {
    title: 'Transferente',
    type: 'text',
    sort: false,
  },
  contractNumber: {
    title: 'No. Contrato',
    type: 'text',
    sort: false,
  },
  requestId: {
    title: 'No. Solicitud',
    type: 'text',
    sort: false,
  },
  programmationId: {
    title: 'No. Programación',
    type: 'text',
    sort: false,
  },
  costService: {
    title: 'Costo Servicio',
    type: 'text',
    sort: false,
  },
  endAttentionDate: {
    title: 'Fecha Fin Atención',
    type: 'text',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return moment(value).format('DD/MM/YYYY');
    },
  },
  orderServiceStatus: {
    title: 'Estatus Orden Servicio',
    type: 'text',
    sort: false,
  },
  goodId: {
    title: 'No. Bien',
    type: 'text',
    sort: false,
  },
};
