import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  lotPublic: {
    title: 'Lote',
    type: 'string',
    sort: false,
    width: '20%',
  },
  rfc: {
    title: 'Cliente',
    type: 'string',
    sort: false,
    width: '20%',
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    width: '40%',
  },
  finalPrice: {
    title: 'Precio Final',
    type: 'string',
    sort: false,
    width: '20%',
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
};

export const ALLOTMENT_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    // width: '25px',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  finalPrice: {
    title: 'Precio',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  finalVat: {
    title: 'IVA',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  camp2: {
    title: 'Campo 2',
    type: 'string',
    sort: false,
  },
  camp3: {
    title: 'Campo 3',
    type: 'string',
    sort: false,
  },
  camp4: {
    title: 'Campo 4',
    type: 'string',
    sort: false,
  },
  camp5: {
    title: 'Campo 5',
    type: 'string',
    sort: false,
  },
};
export const BANK_COLUMNS = {
  movementNumber: {
    title: 'No. Mov.',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  date: {
    title: 'Fecha',
    // width: '15%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  bankKey: {
    title: 'Banco',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  reference: {
    title: 'Referencia',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Depósito',
    // width: '15%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  entryOrderId: {
    title: 'No. Orden Ingreso',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  paymentId: {
    title: 'No. Pago',
    // width: '15%',
    type: 'string',
    sort: false,
  },
};
export const RECEIVED_COLUMNS = {
  reference: {
    title: 'Referencia',
    // width: '25px',
    type: 'string',
    sort: false,
  },
  amountAppVat: {
    title: 'Monto',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  vat: {
    title: 'IVA',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  amountNoAppVat: {
    title: 'Monto no aplica IVA',
    type: 'string',
    sort: false,
    valuePrepareFunction: (amount: string) => {
      const numericAmount = parseFloat(amount);

      if (!isNaN(numericAmount)) {
        return numericAmount.toLocaleString('en-US', {
          // style: 'currency',
          // currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      } else {
        return amount;
      }
    },
  },
  transference: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'D', title: 'Devolución' },
          { value: 'P', title: 'Penalización' },
          { value: 'N', title: 'Normal' },
          { value: 'I', title: 'Interés' },
          { value: 'M', title: 'Moratorio' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.type == 'P') {
        return 'Penalización';
      } else if (row.type == 'D') {
        return 'Devolución';
      } else if (row.type == 'I') {
        return 'Interés';
      } else if (row.type == 'M') {
        return 'Moratorio';
      } else if (row.type == 'N') {
        return 'Normal';
      } else {
        return row.type;
      }
    },
  },
  paymentId: {
    title: 'Pago Origen',
    type: 'string',
    sort: false,
  },
};
