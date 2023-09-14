export const CLARIFICATION_COLUMNS = {
  id: {
    title: 'Identificador',
    type: 'number',
    sort: false,
  },
  clarification: {
    title: 'Aclaración',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo',
    type: 'number',
    sort: false,
  },
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
  active: {
    title: 'Estatus',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-success">Activo</span></strong>';
      if (value == '0')
        return '<strong><span class="badge badge-pill badge-warning">Inactivo</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'Activo' },
          { value: '0', title: 'Inactivo' },
        ],
      },
    },
  },
};
