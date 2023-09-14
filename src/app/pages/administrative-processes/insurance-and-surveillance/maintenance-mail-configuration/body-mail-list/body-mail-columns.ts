export const EMAIL_BODY_COLUMNS = {
  id: {
    title: 'Id',
    type: 'string',
    sort: false,
  },
  bodyEmail: {
    title: 'Cuerpo del Correo',
    type: 'string',
    sort: false,
  },
  subjectEmail: {
    title: 'Asunto',
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
  },
};
