import { CustomDateFilterComponent } from '../../../@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNSPARAMETER = {
  id: {
    title: 'Clave parámetro',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  startDate: {
    title: 'Fecha inical',
    sort: false,
    type: 'html',
    width: '13%',
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0].split('-').reverse().join('-') : ''}  
      `;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  endDate: {
    title: 'Fecha final',
    sort: false,
    width: '13%',
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0].split('-').reverse().join('-') : ''}  
      `;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  initialValue: {
    title: 'Valor inicial',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `
            <p class="values">${text}</p>`;
    },
  },
  finalValue: {
    title: 'Valor final',
    sort: false,
  },
};
