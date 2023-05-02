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
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0].split('-').reverse().join('-') : ''}  
      `;
    },
  },
  endDate: {
    title: 'Fecha final',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0].split('-').reverse().join('-') : ''}  
      `;
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
