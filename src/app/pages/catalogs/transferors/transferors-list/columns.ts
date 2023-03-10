export const TRANSFERENT_STATE_COLUMNS = {
  id: {
    title: 'No.',
    sort: false,
  },
  keyCode: {
    title: 'Clave',
    sort: false,
  },
  name: {
    title: 'Nombre',
    sort: false,
  },
  type: {
    title: 'Tipo',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'NO') return 'No obligatorio ';
      if (value == 'CE') return 'Asegurado';

      return value;
    },
  },
};
