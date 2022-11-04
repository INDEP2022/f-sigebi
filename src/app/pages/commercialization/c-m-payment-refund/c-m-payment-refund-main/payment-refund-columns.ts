export const REFUND_CONTROL_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  key: {
    title: 'Clave',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  dispersion: {
    title: 'Dis.',
    type: 'string',
    sort: false,
  },
  dispersionType: {
    title: 'Tipo Dispersión',
    type: 'string',
    sort: false,
  },
  origin: {
    title: 'Origen',
    type: 'string',
    sort: false,
  },
  createDate: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
  },
  endDate: {
    title: 'Fecha Término',
    type: 'string',
    sort: false,
  },
};

export const RELATED_EVENT_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  cve: {
    title: 'Cve. Proceso',
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
