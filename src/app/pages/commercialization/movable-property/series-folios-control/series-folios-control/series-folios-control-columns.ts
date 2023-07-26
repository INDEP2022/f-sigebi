import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const SERIES_FOLIOS_CONTROL_COLUMNS = {
  folioinvoiceId: {
    title: 'Id Folio',
    width: '50px',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'Coordinación',
    type: 'string',
    sort: false,
  },
  // catDelegation: {
  //   title: 'Regional',
  //   width: '50px',
  //   type: 'string',
  //   sort: false,
  //   valuePrepareFunction: (value: any) => (value ? value.description : ''),
  // },
  series: {
    title: 'Serie',
    type: 'string',
    sort: false,
  },
  invoiceStart: {
    title: 'Folio Inicial',
    type: 'string',
    sort: false,
  },
  invoiceEnd: {
    title: 'Folio Final',
    type: 'string',
    sort: false,
  },
  validity: {
    title: 'Validez',
    type: 'string',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
  statusfactId: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  totalFolios: {
    title: 'Total de Folios',
    type: 'string',
    sort: false,
  },
  availableFolios: {
    title: 'Folios Registrados',
    type: 'string',
    sort: false,
  },
  usedFolios: {
    title: 'Folios Utilizados',
    type: 'string',
    sort: false,
  },
  recordDate: {
    title: 'Fecha Registro',
    type: 'string',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
