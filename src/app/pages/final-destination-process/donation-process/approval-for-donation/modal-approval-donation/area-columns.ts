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
      return row.good.description;
    },
  },
  cant: {
    title: 'Cantidad',
    sort: false,
    valuePrepareFunction(row: any) {
      return row.good.cant;
    },
  },
};

export const TEMPGOODS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.goodNumber;
    },
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.good.description;
    },
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.good.amount;
    },
  },
  status: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.good.status;
    },
  },
  user: {
    title: 'Usuario',
    sort: false,
  },
  delegationNumber: {
    title: 'Delegación',
    sort: false,
  },
  warehouse: {
    title: 'Almacén',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.warehouse.description;
    },
  },
  bienindicadores: {
    title: 'Indicador',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.bienindicadores.description;
    },
  },
  transference: {
    title: 'Transferente',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.transference.nameTransferent;
    },
  },
  processExt: {
    title: 'Process. Ext Dom',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.bienindicadores.procesoExtDom;
    },
  },
};
