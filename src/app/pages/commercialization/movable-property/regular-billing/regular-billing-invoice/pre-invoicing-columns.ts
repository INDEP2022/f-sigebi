import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const PRE_INVOICING_COLUMNS = {
  event: {
    title: 'Evento',
    sort: true,
  },
  allotment: {
    title: 'Lote',
    sort: true,
  },
  client: {
    title: 'Cliente',
    sort: false,
  },
  regional: {
    title: 'Regional',
    sort: false,
  },
  invoice: {
    title: 'Factura',
    sort: false,
  },
  serie: {
    title: 'Serie',
    sort: false,
  },
  folio: {
    title: 'Folio',
    sort: false,
  },
  status: {
    title: 'Estado',
    sort: false,
  },
  type2: {
    title: 'Tipo',
    sort: false,
  },
  date: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (val: string) => {
      return val ? val.split('-').reverse().join('/') : '';
    },
    filterFunction: () => {
      return true;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
