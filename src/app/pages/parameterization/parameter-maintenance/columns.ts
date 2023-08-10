import { CustomDateFilterComponent } from '../../../@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNSPARAMETER = {
  id: {
    title: 'Clave Parámetro',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  startDate: {
    title: 'Fecha Inical',
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
    title: 'Fecha Final',
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
    title: 'Valor Inicial',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `
            <p class="values">${text}</p>`;
    },
  },
  finalValue: {
    title: 'Valor Final',
    sort: false,
  },
};
