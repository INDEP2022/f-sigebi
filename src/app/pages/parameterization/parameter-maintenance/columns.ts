export const COLUMNSPARAMETER = {
  cve: {
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
  },
  endDate: {
    title: 'Fecha final',
    sort: false,
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
