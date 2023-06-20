export const LOGICAL_TABLES_REGISTER_COLUMNS = {
  // table: {
  //   title: 'No. Tabla',
  //   sort: false,
  // },
  name: {
    title: 'Nombre',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    filter: {
      config: {},
    },
  },
  actionType: {
    title: 'Acceso',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'U') return 'Acceso Único';
      if (value == 'T') return 'Acceso por tramos';

      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'U', title: 'Acceso Único' },
          { value: 'T', title: 'Acceso por tramos' },
        ],
      },
    },
  },
  tableType: {
    title: 'Tipo',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'Una Clave';
      if (value == '5') return 'Cinco Claves';

      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'Una Clave' },
          { value: '5', title: 'Cinco Claves' },
        ],
      },
    },
  },
};
