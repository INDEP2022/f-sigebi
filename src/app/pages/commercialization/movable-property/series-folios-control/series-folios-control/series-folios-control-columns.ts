import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const SERIES_FOLIOS_CONTROL_COLUMNS = {
  folioinvoiceId: {
    title: 'Id Folio',
    width: '200px',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'Coordinación',
    type: 'string',
    sort: false,
    width: '200px',
  },
  // catDelegation: {
  //   title: 'Regional',
  //   width: '200px',
  //   type: 'string',
  //   sort: false,
  //   valuePrepareFunction: (value: any) => (value ? value.description : ''),
  // },
  series: {
    title: 'Serie',
    type: 'string',
    sort: false,
    width: '200px',
  },
  invoiceStart: {
    title: 'Folio Inicial',
    type: 'string',
    sort: false,
    width: '200px',
  },
  invoiceEnd: {
    title: 'Folio Final',
    type: 'string',
    sort: false,
    width: '200px',
  },
  validity: {
    title: 'Validez',
    type: 'string',
    sort: false,
    width: '200px',
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
    width: '200px',
  },
  statusfactId: {
    title: 'Estatus',
    type: 'string',
    sort: false,
    width: '200px',
  },
  totalFolios: {
    title: 'Total de Folios',
    type: 'string',
    sort: false,
    width: '200px',
  },
  availableFolios: {
    title: 'Folios Registrados',
    type: 'string',
    sort: false,
    width: '200px',
  },
  usedFolios: {
    title: 'Folios Utilizados',
    type: 'string',
    sort: false,
    width: '200px',
  },
  recordDate: {
    title: 'Fecha Registro',
    type: 'string',
    sort: false,
    width: '200px',
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
