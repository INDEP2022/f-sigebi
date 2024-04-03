export const columns = {
  numFile: {
    title: 'No. de expediente',
    type: 'string',
    sort: false,
  },
  keysProceedings: {
    title: 'Clave de acta',
    type: 'string',
    sort: false,
  },
  statusProceedings: {
    title: 'Estatus',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'ABIERTA,ABIERTO', title: 'ABIERTO' },
          { value: 'CERRADO,CERRADA', title: 'CERRADO' },
        ],
      },
    },
  },
};
