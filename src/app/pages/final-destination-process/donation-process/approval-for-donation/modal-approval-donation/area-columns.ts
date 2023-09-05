export const AREA_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'number',
    sort: false,
  },
};
export const GOODS = {
  proposalKey: {
    title: 'No. Inventario',
    sort: false,
  },
  goodNumber: {
    title: 'No. Gestión',
    sort: false,
  },
  id: {
    title: 'No. Bien',
    sort: false,
    valuePrepareFunction(row: any) {
      return row.id;
    },
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction(row: any) {
      return row.description;
    },
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
    valuePrepareFunction(row: any) {
      return row.quantity;
    },
  },
};
