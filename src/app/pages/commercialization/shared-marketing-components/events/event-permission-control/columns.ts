import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
    width: '20%',
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    width: '60%',
  },
  date: {
    title: 'Fecha',
    sort: false,
    width: '20%',
    type: 'html',
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
