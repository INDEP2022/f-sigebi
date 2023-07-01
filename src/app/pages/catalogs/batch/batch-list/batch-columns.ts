export const BATCH_COLUMNS = {
  id: {
    title: 'Codigo',
    type: 'number',
    sort: false,
  },
  numStore: {
    title: 'ID Almacén',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
  },
  numRegister: {
    title: 'ID Registro',
    type: 'number',
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
  },
};
