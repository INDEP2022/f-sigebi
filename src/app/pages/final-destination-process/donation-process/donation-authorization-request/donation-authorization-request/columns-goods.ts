export const COLUMNS_GOODS = {
  requestId: {
    title: 'No. Solicitud',
    type: 'number',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.requestId.id;
    },
  },
  regionalDelegationId: {
    title: 'DON. Entidad Federal',
    type: 'number',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.requestId.regionalDelegationId;
    },
  },
  goodNumb: {
    title: 'No. Bien Ent. Federal',
    type: 'number',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.goodId.goodNumber;
    },
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.goodId.description;
    },
  },

  SdoStatus: {
    title: 'Sdo./ Estatus',
    type: 'string',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.goodId.status;
    },
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.goodId.quantity;
    },
  },

  // fedEntity: {
  //   title: 'Entidad Federativa',
  //   type: 'string',
  //   sort: false,

  //   valuePrepareFunction(cell: any, row: any) {
  //     return row.goodId.noDelegacion
  //   }
  // },
  // warehouse: {
  //   title: 'Almacén',
  //   type: 'string',
  //   sort: false,
  //   valuePrepareFunction(cell: any, row: any) {
  //     return row.goodId.warehouse
  //   }
  // },
  // sdSiab: {
  //   title: 'SD/SIAB',
  //   type: 'string',
  //   sort: false,
  //   valuePrepareFunction(cell: any, row: any) {
  //     return row.goodId.sdSiab
  //   }
  // },
  // noClasifBien: {
  //   title: 'Clasif. Bien',
  //   type: 'string',
  //   sort: false,
  //   valuePrepareFunction(cell: any, row: any) {
  //     return row.goodId.noClasifBien
  //   }
  // },
  //   por definir: {
  //     title: 'Cantidad',
  //     type: 'number',
  //     sort: false,
  //   },
};

export const COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  description: {
    title: 'Descripción del Bien',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
  },
};
