export const USER_ACCESS_COLUMNS = {
  userKey: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
  userRole: {
    title: 'Rol',
    type: 'number',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Administrador',
        // list: [{}
        //   // { value: '1', title: 'Administrador' },
        // ],
      },
    },
    valuePrepareFunction: (_cell: any, row: any) => {
      const userRole = row.userRole;
      if (userRole == 1) {
        return 'Administrador';
      } else {
        return '';
      }
    },
  },
  estAccess: {
    title: 'Estatus',
    type: 'number',
    sort: false,
    // filter: {
    //   type: 'list',
    //   config: {
    //     selectText: 'Todos',
    //     list: [
    //       { value: '1', title: 'Activo' },
    //       { value: '0', title: 'Inactivo' },
    //     ],
    //   },
    // },
    // valuePrepareFunction: (_cell: any, row: any) => {
    //   const estAccess = row.estAccess;
    //   if (estAccess == 1) {
    //     return 'Activo';
    //   } else if (estAccess == 0) {
    //     return 'Inactivo';
    //   } else {
    //     return '';
    //   }
    // },
  },
};
