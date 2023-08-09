import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  movementNumber: {
    title: 'No. Movimiento',
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
  move: {
    title: 'Movimiento',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  bill: {
    title: 'Cuenta',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  referenceOri: {
    title: 'Referencia OI',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  bankKey: {
    title: 'Banco',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  branchOffice: {
    title: 'Sucursal',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Monto',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  result: {
    title: 'Resultado',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  validSistem: {
    title: 'Válido',
    // width: '15%',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'S', title: 'Si' },
          { value: 'R', title: 'Rechazado' },
          { value: 'N', title: 'No Inválido' },
          { value: 'A', title: 'Aplicado' },
          { value: 'B', title: 'Pago de Bases' },
          { value: 'D', title: 'Devuelto' },
          { value: 'C', title: 'Contabilizado' },
          { value: 'P', title: 'Penalizado' },
          { value: 'Z', title: 'Devuelto al Cliente' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.validSistem == 'S') {
        return 'Si';
      } else if (row.validSistem == 'R') {
        return 'Rechazado';
      } else if (row.validSistem == 'N') {
        return 'No Inválido';
      } else if (row.validSistem == 'A') {
        return 'Aplicado';
      } else if (row.validSistem == 'B') {
        return 'Pago de Bases';
      } else if (row.validSistem == 'D') {
        return 'Devuelto';
      } else if (row.validSistem == 'C') {
        return 'Contabilizado';
      } else if (row.validSistem == 'P') {
        return 'Penalizado';
      } else if (row.validSistem == 'Z') {
        return 'Devuelto al Cliente';
      } else {
        return row.validSistem;
      }
    },
  },
  paymentId: {
    title: 'ID Pago',
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
  lotPub: {
    title: 'Lote Pub.',
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
  entryOrderId: {
    title: 'OI',
    // width: '15%',
    type: 'string',
    sort: false,
  },
  affectationDate: {
    title: 'Fecha Afectación',
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
  descriptionSAT: {
    title: 'Descripción Pago SAT',
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
  // clientId: {
  //   title: 'ID Cliente',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // rfc: {
  //   title: 'R.F.C',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // name: {
  //   title: 'Nombre',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  // },
  // appliedTo: {
  //   title: 'Dev/Pena',
  //   // width: '15%',
  //   type: 'string',
  //   sort: false,
  //   filter: {
  //     type: 'list',
  //     config: {
  //       selectText: 'Todos',
  //       list: [
  //         { value: 'D', title: 'Devolución' },
  //         { value: 'P', title: 'Penalización' },
  //       ],
  //     },
  //   },
  //   valuePrepareFunction: (cell: any, row: any) => {
  //     if (row.appliedTo == 'P') {
  //       return 'Penalización';
  //     } else if (row.appliedTo == 'D') {
  //       return 'Devolución';
  //     } else {
  //       return row.appliedTo;
  //     }
  //   },
  // },
};

export const COLUMNS2 = {
  moveId: {
    title: 'No. Movto.',
    width: '15%',
    type: 'string',
    sort: false,
  },
  date: {
    title: 'Fecha',
    width: '15%',
    type: 'string',
    sort: false,
  },
  move: {
    title: 'Movimiento',
    width: '15%',
    type: 'string',
    sort: false,
  },
  bill: {
    title: 'Cuenta',
    width: '15%',
    type: 'string',
    sort: false,
  },
  reference: {
    title: 'Referencia',
    width: '15%',
    type: 'string',
    sort: false,
  },
  entryOrder: {
    title: 'Ref.Orden Ing.',
    width: '15%',
    type: 'string',
    sort: false,
  },
  bank: {
    title: 'Banco',
    width: '15%',
    type: 'string',
    sort: false,
  },
  office: {
    title: 'Sucursal',
    width: '15%',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Monto',
    width: '15%',
    type: 'string',
    sort: false,
  },
  result: {
    title: 'Resultado',
    width: '15%',
    type: 'string',
    sort: false,
  },
  valid: {
    title: 'Valido',
    width: '15%',
    type: 'string',
    sort: false,
  },
  paymentId: {
    title: 'Id.Pago',
    width: '15%',
    type: 'string',
    sort: false,
  },
  batch: {
    title: 'Lote Pub.',
    width: '15%',
    type: 'string',
    sort: false,
  },
  event: {
    title: 'Evento',
    width: '15%',
    type: 'string',
    sort: false,
  },
  entry: {
    title: 'Orden Ing.',
    width: '15%',
    type: 'string',
    sort: false,
  },
  date2: {
    title: 'Fecha',
    width: '15%',
    type: 'string',
    sort: false,
  },
  descriptionSATpayment: {
    title: 'Desc. Pago SAT',
    width: '15%',
    type: 'string',
    sort: false,
  },
};
