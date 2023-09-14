export const RECEIPT_COLUMNS = {
  actId: {
    title: 'No. Acta',
    type: 'number',
    sort: false,
  },

  id: {
    title: 'Recibo',
    type: 'string',
    sort: false,
  },

  statusReceipt: {
    title: 'Estatus Recibo',
    type: 'string',
    sort: false,
  },
};

export const RECEIPT_GUARD_COLUMNS = {
  receiptDate: {
    title: 'Fecha Recibo',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (date: Date) => {
    //   var raw = new Date(date);
    //   var formatted = new DatePipe('es-ES').transform(raw, 'dd/MM/aaaa');
    //   return formatted;
    // },
  },

  typeReceipt: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },

  statusReceiptGuard: {
    title: 'Estatus Recibo',
    type: 'string',
    sort: false,
  },
};
export const RECEIPT_COLUMNS_FORMALIZE = {
  id: {
    title: 'Recibo',
    type: 'text',
    sort: false,
  },

  statusReceipt: {
    title: 'Estatus Recibo',
    type: 'text',
    sort: false,
  },

  observation: {
    title: 'Observación',
    type: 'text',
    sort: false,
  },
};
