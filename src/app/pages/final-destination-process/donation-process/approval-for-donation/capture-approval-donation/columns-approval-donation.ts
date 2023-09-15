export const COLUMNS_APPROVAL_DONATION = {
  recordId: {
    title: 'Ref.',
    type: 'number',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good.goodNumber;
    },
  },
  description: {
    title: 'Descripción del Bien',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.description;
    },
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.quantity;
    },
  },
};

export const COPY = {
  recordId: {
    title: 'No. Ref',
    sort: false,
  },
  goodId: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.description;
    },
  },
  amount: {
    title: 'Cantidad',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodEntity?.unit;
    },
  },
  status: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodEntity?.status;
    },
  },
  noExpediente: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.bienindicadores?.noExpediente;
    },
  },
  noEtiqueta: {
    title: 'Etiqueta Destino',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodEntity?.noEtiqueta;
    },
  },
  idNoWorker1: {
    title: 'No. Tranf.',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.transference?.id;
    },
  },
  idExpWorker1: {
    title: 'Des. Tranf.',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.transference?.nameTransferent;
    },
  },
  noClasifBien: {
    title: 'No. Clasif.',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.clasificationGood;
    },
  },
  procesoExtDom: {
    title: 'Proceso',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.bienindicadores?.procesoExtDom;
    },
  },
  warehouseNumb: {
    title: 'No. Almacén',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.warehouse?.id;
    },
  },
  warehouse: {
    title: 'Descrip. Almacén',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.warehouse?.description;
    },
  },
  warehouseLocat: {
    title: 'Ubica. Almacén ',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.warehouse?.ubication;
    },
  },
  coordAdmin: {
    title: 'Coord. Admin.',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.bienindicadores?.coordination;
    },
  },
};
