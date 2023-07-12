import { DatePipe } from '@angular/common';

export const EXPEDIENTS_REQUEST_COLUMNS = {
  id: {
    title: 'No. Solicitud',
    type: 'string',
    sort: false,
  },

  recordId: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },

  receptionDate: {
    title: 'Fecha Solicitud',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },

  regionalDelegationId: {
    title: 'Delegación Regional',
    type: 'string',
    sort: false,
  },

  state: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
  transferenceId: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },

  stationId: {
    title: 'Emisora',
    type: 'string',
    sort: false,
  },

  authorityId: {
    title: 'Autoridad',
    type: 'string',
    sort: false,
  },

  paperNumber: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },

  receiptRoute: {
    title: 'Via de Recepción',
    type: 'string',
    sort: false,
  },

  typeOfTransfer: {
    title: 'Tipo Transferencia',
    type: 'string',
    sort: false,
  },
  affair: {
    title: 'Asunto',
    type: 'string',
    sort: false,
  },

  /*receiptRoute: {
    title: 'Via de recepción',
    type: 'string',
    sort: false,
  }, */

  /*requestStatus: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },*/
};
