import { DatePipe } from '@angular/common';

export const REFUND_CONTROL_COLUMNS = {
  ctlDevPagId: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  cveCtlDevPag: {
    title: 'Clave',
    type: 'string',
    sort: false,
  },
  idEstatus: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  direccion: {
    title: 'Dis.',
    type: 'string',
    sort: false,
  },
  idTipoDisp: {
    title: 'Tipo Dispersión',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        if (value == '1') {
          return 'Por Cliente';
        } else {
          return 'Por Lote';
        }
      } else {
        return '';
      }
    },
  },
  idOrigen: {
    title: 'Origen',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value !== null) {
        if (value == '1') {
          return 'No Ganadores';
        } else {
          return 'Ganadores';
        }
      } else {
        return '';
      }
    },
  },
  fecCreacion: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
  fecTermino: {
    title: 'Fecha Término',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd-MM-yyyy');
    },
  },
};

export const RELATED_EVENT_COLUMNS = {
  eventId: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  processKey: {
    title: 'Cve. Proceso',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.event) {
        if (row.event.processKey) {
          return row.event.processKey;
        } else {
          return 'Clave NO Encontrada';
        }
      } else {
        return 'Clave NO Encontrada';
      }
    },
  },
  numPayments: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  paymentsAmount: {
    title: 'Monto',
    type: 'number',
    sort: false,
    filter: false,
  },
};

export const BANK_ACCOUNTS_COLUMNS = {
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  cve: {
    title: 'Cve. Banco',
    type: 'string',
    sort: false,
  },
  account: {
    title: 'Cuenta',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  amount: {
    title: 'Monto',
    type: 'number',
    sort: false,
  },
  expenseId: {
    title: 'Id Gasto',
    type: 'number',
    sort: false,
  },
  paymentId: {
    title: 'Id Pago',
    type: 'number',
    sort: false,
  },
  folioNumber: {
    title: 'Folio Pag.',
    type: 'number',
    sort: false,
  },
  paymentDate: {
    title: 'Fecha Pago',
    type: 'number',
    sort: false,
  },
  checkNumber: {
    title: 'No. de Cheque',
    type: 'number',
    sort: false,
  },
  observations: {
    title: 'Observaciones de Cancelación',
    type: 'number',
    sort: false,
  },
};

export const PAYMENT_COLUMNS = {
  validKey: {
    title: 'Clave Válida',
    type: 'string',
    sort: false,
  },
  transferDate: {
    title: 'Fecha Transf.',
    type: 'string',
    sort: false,
  },
  id: {
    title: 'Id Pago',
    type: 'number',
    sort: false,
  },
  date: {
    title: 'Fecha',
    type: 'string',
    sort: false,
  },
  reference: {
    title: 'Referencia',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Monto',
    type: 'number',
    sort: false,
  },
  batch: {
    title: 'Lote',
    type: 'number',
    sort: false,
  },
  clientId: {
    title: 'Id Cliente',
    type: 'number',
    sort: false,
  },
  rfc: {
    title: 'R.F.C.',
    type: 'string',
    sort: false,
  },
  name: {
    title: 'Nombre / Denominación',
    type: 'string',
    sort: false,
  },
  crossBankKey: {
    title: 'Clave Interbancaria',
    type: 'string',
    sort: false,
  },
  keyAuthorization: {
    title: 'Autoriza Cambio Clave',
    type: 'string',
    sort: false,
  },
  keyChangeObservations: {
    title: 'Autoriza Cambio Clave',
    type: 'string',
    sort: false,
  },
  transferDateObservations: {
    title: 'Observaciones de Fecha de Transferencia',
    type: 'string',
    sort: false,
  },
};
