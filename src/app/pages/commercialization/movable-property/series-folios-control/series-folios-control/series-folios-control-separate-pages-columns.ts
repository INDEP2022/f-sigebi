import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS = {
  invoice: {
    title: 'Folio',
    type: 'string',
    sort: false,
    width: '15%',
    // filter: {
    //   type: 'custom',
    //   component: CustomFilterComponent,
    // },
  },
  pulledapart: {
    title: 'Apartado',
    type: 'string',
    sort: false,
    width: '25%',
  },
  recordNumber: {
    title: 'Usuario Registro',
    type: 'string',
    sort: false,
    width: '25%',
    // valuePrepareFunction: (value: ComerF) => (value ? value.recordUser : ''),
    // valuePrepareFunction: (value: ComerF) => (value ? value.recordUser : ''),
    filterFunction: () => {
      return true;
    },
  },
  recordDate: {
    title: 'Fecha Registro',
    type: 'string',
    // width: '200px',
    width: '35%',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
