export const CENTRAL_ACCOUNT_COLUMNS = {
  file: {
    title: 'No Expediente',
    type: 'string',
    sort: false,
  },
  good: {
    title: 'No Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Status',
    type: 'string',
    sort: false,
  },
  import: {
    title: 'Importe',
    type: 'string',
    sort: false,
  },
  interests: {
    title: 'Intereses',
    type: 'string',
    sort: false,
  },
  total: {
    title: 'Total',
    type: 'string',
    sort: false,
  },
  currency: {
    title: 'Moneda',
    type: 'string',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.currency == '1' ? 'MN' : 'USD';
    },
  },
};
