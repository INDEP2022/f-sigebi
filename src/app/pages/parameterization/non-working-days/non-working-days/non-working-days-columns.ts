import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const NONWORKINGDAYS_COLUMNS = {
  id: {
    title: 'Día',
    sort: false,
    type: 'html',
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
};
