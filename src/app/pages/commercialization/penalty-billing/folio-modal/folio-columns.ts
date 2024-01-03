import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const BILLING_FOLIO_COLUMNS = {
  series: {
    title: 'Serie',
    type: 'string',
    sort: false,
  },
  invoice: {
    title: 'Folio',
    type: 'string',
    sort: false,
  },
  pulledapart: {
    title: 'Apartado',
    type: 'string',
    sort: false,
  },
  recordNumber: {
    title: 'Usuario Registro',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (value: ComerF) => (value ? value.recordUser : ''),
  },
  recordDate: {
    title: 'Fecha Registro',
    type: 'string',
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
};
