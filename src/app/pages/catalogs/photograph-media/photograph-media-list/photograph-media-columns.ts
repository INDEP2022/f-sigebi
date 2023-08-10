export const PHOTOGRAPH_MEDIA_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  route: {
    title: 'Ruta',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estado',
    type: 'string',
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.status == '1' ? 'Activo' : 'Inactivo';
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '0', title: 'Inactivo' },
          { value: '1', title: 'Activo' },
        ],
      },
    },
    sort: false,
  },
};
