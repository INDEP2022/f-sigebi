export const EMAIL_CONFIG_COLUMNS = {
  id: {
    title: 'Id',
    type: 'string',
    sort: false,
  },
  emailSend: {
    title: 'Correo Electrónico',
    type: 'string',
    sort: false,
  },
  nameSend: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  postSend: {
    title: 'Puesto',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.status == '1' ? 'Activo' : 'Inactivo';
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
