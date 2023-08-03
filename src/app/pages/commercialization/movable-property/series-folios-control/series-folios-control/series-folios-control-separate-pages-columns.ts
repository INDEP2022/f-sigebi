import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { CustomFilterComponent } from 'src/app/@standalone/shared-forms/input-number/input-number';
import { ComerF } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';

export const SERIES_FOLIOS_CONTROL_SEPARATE_PAGES_COLUMNS = {
  invoice: {
    title: 'Folio',
    type: 'string',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  pulledapart: {
    title: 'Apartado',
    type: 'string',
    sort: false,
  },
  comerF: {
    title: 'Usuario Registro',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: ComerF) => (value ? value.recordUser : ''),
  },
  recordDate: {
    title: 'Fecha Registro',
    type: 'string',
    width: '200px',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
