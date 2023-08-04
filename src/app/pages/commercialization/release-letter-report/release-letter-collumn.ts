import { CustomDateFilterComponent_ } from './searchDate';

export const RELEASE_REPORT_COLUMNS = {
  id: {
    title: 'Oficio',
    sort: false,
  },
  lotsId: {
    title: 'Lote',
    sort: false,
  },
  // addressedTo: {
  //   title: 'Dirigido a',
  //   sort: false,
  // },
  // position: {
  //   title: 'Puesto',
  //   sort: false,
  // },
  // paragraph1: {
  //   title: 'Parrafo 1',
  //   sort: false,
  // },
  invoiceNumber: {
    title: 'No. Factura',
    sort: false,
  },
  invoiceDate: {
    title: 'Fecha de Factura',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent_,
    },
  },
  signatory: {
    title: 'Adjudicatario',
    sort: false,
  },
  // ccp1: {
  //   title: 'Ccp1',
  //   sort: false,
  // },
  // ccp2: {
  //   title: 'Ccp2',
  //   sort: false,
  // },
  // ccp3: {
  //   title: 'Ccp3',
  //   sort: false,
  // },
  // ccp4: {
  //   title: 'Ccp4',
  //   sort: false,
  // },
  // ccp5: {
  //   title: 'Ccp4',
  //   sort: false,
  // },
};
export const COMEMR_BIENES_COLUMNS = {
  goodNumber: {
    title: 'Bien',
    type: 'text',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'text',
    sort: false,
  },
  // baseValue: {
  //   title: 'Valor',
  //   type: 'text',
  //   sort: false,
  // },
};
