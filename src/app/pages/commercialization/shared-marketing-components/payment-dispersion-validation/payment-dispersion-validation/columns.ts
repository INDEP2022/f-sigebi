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
  },
  finalVat: {
    title: 'IVA',
    type: 'string',
    sort: false,
  },
  camp2: {
    title: '',
    type: 'string',
    sort: false,
  },
  camp3: {
    title: '',
    type: 'string',
    sort: false,
  },
  camp4: {
    title: '',
    type: 'string',
    sort: false,
  },
  camp5: {
    title: '',
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
  },
  vat: {
    title: 'IVA',
    type: 'string',
    sort: false,
  },
  amountNoAppVat: {
    title: 'Monto No Aplica IVA',
    type: 'string',
    sort: false,
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
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.type == 'P') {
        return 'Penalización';
      } else if (row.type == 'D') {
        return 'Devolución';
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
