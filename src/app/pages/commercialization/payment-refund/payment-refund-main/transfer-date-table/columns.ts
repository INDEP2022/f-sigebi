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
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        const a = numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return '<p class="cell_right">' + a + '</p>';
      } else {
        return amount;
      }
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
