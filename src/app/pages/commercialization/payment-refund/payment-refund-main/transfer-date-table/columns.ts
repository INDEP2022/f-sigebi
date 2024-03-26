export const COLUMNS = {
  paymentId: {
    title: 'Id. Pago',
    type: 'string',
    sort: false,
    width: '25%',
  },
  amount: {
    title: 'Monto',
    type: 'html',
    sort: false,
    width: '35%',
    filter: false,
    valuePrepareFunction: (val: string) => {
      const formatter = new Intl.NumberFormat('en-US', {
        currency: 'USD',
        minimumFractionDigits: 2,
      });

      return formatter.format(Number(val));
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  batchId: {
    title: 'Lote',
    type: 'string',
    sort: false,
    width: '20%',
  },
  client: {
    title: 'Nombre/Denominación',
    type: 'string',
    sort: false,
    width: '20%',
  },
  interbankCLABE: {
    title: 'Clabe Interbancaria',
    type: 'string',
    sort: false,
    width: '20%',
  },
  'payment.date': {
    title: 'Fecha Transf',
    type: 'string',
    sort: false,
    width: '20%',
  },
};
