export const COLUMNS = {
  noBien: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  noExpediente: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  unidad: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  sssubtipo: {
    title: 'Sssubtipo',
    type: 'string',
    sort: false,
  },
  delAdministra: {
    title: 'Del. Admin',
    type: 'string',
    sort: false,
  },
  almacen: {
    title: 'Almacén',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (warehouse: any) => {
    //   return warehouse ? warehouse.description : '';
    // },
  },
};
