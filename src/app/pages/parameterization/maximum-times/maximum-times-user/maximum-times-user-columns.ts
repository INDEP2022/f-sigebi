export const USERS_COLUMNS = {
  id: {
    title: 'Usuario',
    sort: false,
  },
  name: {
    title: 'Nombre',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
};
