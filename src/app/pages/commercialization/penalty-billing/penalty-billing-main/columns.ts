import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { CustomFilterComponent } from 'src/app/@standalone/shared-forms/input-number/input-number';

export const PEN_INVOICING_COLUMNS = {
  eventId: {
    title: 'Evento',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  batchId: {
    title: 'Lote',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  eventDate: {
    title: 'Fecha Evento',
    sort: false,
    valuePrepareFunction: (val: string) => {
      return val ? val.split('-').reverse().join('/') : '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction: () => {
      return true;
    },
  },
  customer: {
    title: 'Cliente',
    sort: false,
  },
  delegationNumber: {
    title: 'Regional',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  //   vouchertype: {
  //     title: 'Tipo',
  //     sort: false,
  //     filter: {
  //       type: 'list',
  //       config: {
  //         selectText: 'Todos',
  //         list: [{ value: 7, title: 'Venta de Bases' }],
  //       },
  //     },
  //     valuePrepareFunction: (val: number) => {
  //       if (val == 7) {
  //         return 'Venta de Bases';
  //       }
  //       return '';
  //     },
  //     // valuePrepareFunction: (val: number) => {
  //     //   return val == 7 ? 'Venta de Bases' : '';
  //     // },
  //   },
  series: {
    title: 'Serie',
    sort: false,
  },
  folioinvoiceId: {
    title: 'Folio',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  factstatusId: {
    title: 'Estatus',
    sort: false,
  },
  vouchertype: {
    title: 'Tipo',
    sort: false,
  },

  impressionDate: {
    title: 'Fecha Imp.',
    sort: false,
    valuePrepareFunction: (val: string) => {
      return val ? val.split('-').reverse().join('/') : '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  price: {
    title: 'Precio',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  vat: {
    title: 'IVA',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  total: {
    title: 'Total',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  cvman: {
    title: 'Transferente',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  Iauthorize: {
    title: 'Autoriza',
    sort: false,
  },
  street: {
    title: 'Calle',
    sort: false,
  },
  cologne: {
    title: 'Colonia',
    sort: false,
  },
  municipality: {
    title: 'Municipio',
    sort: false,
  },
  state: {
    title: 'Estado',
    sort: false,
  },
  rfc: {
    title: 'R.F.C.',
    sort: false,
  },
  cop: {
    title: 'Cp',
    sort: false,
  },
};
