import { format } from 'date-fns';

export const REQUESTS_COLUMNS = {
  solnumId: {
    title: 'Id de Solicitud',
    type: 'string',
    sort: false,
  },
  solnumDate: {
    title: 'Fecha',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return format(correctDate(cell), 'dd/MM/yyyy');
    },
  },
  description: {
    title: 'Concepto',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  user: {
    title: 'Usuario que Solicita',
    type: 'string',
    sort: false,
  },
};

//Correct Date
function correctDate(date: string) {
  const dateUtc = new Date(date);
  return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
}

export const GOODS_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  allInterest: {
    title: 'Intereses',
    type: 'html',
    sort: false,
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
  },
  allNumerary: {
    title: 'Total',
    type: 'html',
    sort: false,
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
  },
  commission: {
    title: 'Comisión Bancaria',
    type: 'html',
    sort: false,
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
  },
  allintPay: {
    title: 'Intereses a Pagar',
    type: 'html',
    sort: false,
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
  },
  allPayNumber: {
    title: 'Total a Pagar',
    type: 'html',
    sort: false,
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
  },
};

export const TOTALS_COLUMNS = {
  month: {
    title: 'Mes',
    type: 'number',
    sort: false,
  },
  year: {
    title: 'Año',
    type: 'number',
    sort: false,
  },
  days: {
    title: 'Días',
    type: 'number',
    sort: false,
  },
  amount: {
    title: 'Importe',
    type: 'html',
    sort: false,
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
  },
  interest: {
    title: 'Interés',
    type: 'html',
    sort: false,
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
  },
  total: {
    title: 'Total',
    type: 'html',
    sort: false,
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
  },
};
