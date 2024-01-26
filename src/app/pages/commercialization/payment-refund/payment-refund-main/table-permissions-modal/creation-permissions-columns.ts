export const CREATION_PERMISSIONS_COLUMNS = {
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
    width: '25%',
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    width: '35%',
    filter: false,
  },
  indGuarantee: {
    title: 'Crea Controles No Ganadores',
    type: 'string',
    sort: false,
    width: '20%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: '1', title: 'Si' },
          { value: '0', title: 'No' },
        ],
      },
    },
    valuePrepareFunction: (_cell: any, row: any) => {
      const process = row.indGuarantee;
      if (process == 1) {
        return 'Si';
      } else {
        return 'No';
      }
    },
  },
  inddisp: {
    title: 'Crea Controles Ganadores',
    type: 'string',
    sort: false,
    width: '20%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: '1', title: 'Si' },
          { value: '0', title: 'No' },
        ],
      },
    },
    valuePrepareFunction: (_cell: any, row: any) => {
      const process = row.inddisp;
      if (process == 1) {
        return 'Si';
      } else {
        return 'No';
      }
    },
  },
};
