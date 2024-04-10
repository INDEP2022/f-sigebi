import { format } from 'date-fns';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const APPRAISAL_TABLE_COLUMNS = {
  appraisalId: {
    title: 'Id',
    sort: false,
  },
  appraisalKey: {
    title: 'Cve. Avalúo',
    sort: false,
  },
  officialKey: {
    title: 'Cve. Oficio',
    sort: false,
  },
  insertDate: {
    title: 'Fecha de Registro',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
