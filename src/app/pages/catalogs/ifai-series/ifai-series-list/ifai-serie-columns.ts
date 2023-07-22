export const IFAI_SERIE_COLUMNS = {
  code: {
    title: 'Código',
    type: 'string',
    sort: false,
  },
  typeProcedure: {
    title: 'Tipo Trámite',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
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
  // registryNumber: {
  //   title: 'No. de registro',
  //   type: 'number',
  //   sort: false,
  // },
};
