export const BOOK_EMAIL_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  bookName: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  bookEmail: {
    title: 'Correo Electrónico',
    type: 'number',
    sort: false,
  },
  /*to: {
    title: 'Para',
    type: 'html',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.bookType == 'P'
        ? '<div class="text-center text-success"><i class="fas fa-check"></i></div>'
        : '';
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'P', title: 'Para' },
        ],
      },
    },
  },
  cc: {
    title: 'CC',
    type: 'html',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.bookType == 'C'
        ? '<div class="text-center text-success"><i class="fas fa-check"></i></div>'
        : '';
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'C', title: 'CC' },
        ],
      },
    },
  },*/
  bookType: {
    title: 'Tipo',
    type: 'text',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.bookType == 'P' ? 'Para' : 'CC';
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'P', title: 'Para' },
          { value: 'C', title: 'CC' },
        ],
      },
    },
  },

  bookStatus: {
    title: 'Estatus',
    type: 'text',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.bookStatus == '1' ? 'Activo' : 'Inactivo';
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

export const BOOK_EMAIL_COLUMNS_TO = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  bookName: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  bookEmail: {
    title: 'Correo Electrónico',
    type: 'number',
    sort: false,
  },
  bookStatus: {
    title: 'Estatus',
    type: 'text',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.bookStatus == '1' ? 'Activo' : 'Inactivo';
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
