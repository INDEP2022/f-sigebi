export const PENALTY_TYPE_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  descPenalty: {
    title: 'Descripción',
    type: 'number',
    sort: false,
  },
  daysPenalty: {
    title: 'Días',
    type: 'number',
    sort: false,
  },
  process: {
    title: 'Proceso',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'A')
        return '<strong><span class="badge badge-pill badge-success">Automático</span></strong>';
      if (value == 'M')
        return '<strong><span class="badge badge-pill badge-warning">Manual</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'A', title: 'Automático' },
          { value: 'M', title: 'Manual' },
        ],
      },
    },
  },
};
