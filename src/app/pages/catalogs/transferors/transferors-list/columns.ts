export const TRANSFERENT_STATE_COLUMNS = {
  id: {
    title: 'No.',
    sort: false,
  },
  keyTransferent: {
    title: 'Clave',
    sort: false,
  },
  nameTransferent: {
    title: 'Nombre',
    sort: false,
    filter: {
      config: {},
    },
  },
  typeTransferent: {
    title: 'Tipo',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'NO') return 'No obligatorio ';
      if (value == 'CE') return 'Asegurado';

      return value;
    },
  },
};

export const STATE_COLUMS = {
  transferente: {
    title: 'Transferente',
    sort: false,
  },
  estado: {
    title: 'Estado',
    sort: false,
  },
};
