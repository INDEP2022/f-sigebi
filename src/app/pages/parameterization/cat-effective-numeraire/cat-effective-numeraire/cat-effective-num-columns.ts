export const CAT_EFFECTIVE_NUM_COLUMNS = {
  id: {
    title: 'Categoria',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    filter: {
      config: {},
    },
  },
  enterExit: {
    title: 'Entrada/Salida',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'ENTRADA', title: 'ENTRADA' },
          { value: 'SALIDA', title: 'SALIDA' },
        ],
      },
    },
  },
};
