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
    title: 'Estado',
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
  // registryNumber: {
  //   title: 'No. de registro',
  //   type: 'number',
  //   sort: false,
  // },
};
