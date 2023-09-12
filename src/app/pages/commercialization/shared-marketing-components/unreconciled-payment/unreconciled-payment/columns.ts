import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  paymentId: {
    title: 'Id. Pago',
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
  movementNumber: {
    title: 'No. Movimiento',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  move: {
    title: 'Movimiento',
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
  amount: {
    title: 'Monto',
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
  bankKey: {
    title: 'Banco',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  entryOrderId: {
    title: 'Orden Ingreso',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  event: {
    title: 'Evento',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  lotPub: {
    title: 'Lote Pub.',
    // width: '15%',
    type: 'string',
    sort: false,
  },

  // dateOi: {
  //   title: 'Fecha OI',
  //   width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  clientId: {
    title: 'Id. Cliente',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  rfc: {
    title: 'R.F.C',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  name: {
    title: 'Nombre',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  appliedTo: {
    title: 'Dev/Pena',
    // width: '15%',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'D', title: 'Devolución' },
          { value: 'P', title: 'Penalización' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.appliedTo == 'P') {
        return 'Penalización';
      } else if (row.appliedTo == 'D') {
        return 'Devolución';
      } else {
        return row.appliedTo;
      }
    },
  },
};
