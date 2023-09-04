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
    type: 'string',
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
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.status;
    },
  },
  noExpediente: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.noExpediente;
    },
  },
  noEtiqueta: {
    title: 'Etiqueta Destino',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.noEtiqueta;
    },
  },
  idNoWorker1: {
    title: 'No. Tranf.',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.proceeding?.idNoWorker1;
    // },
  },
  idExpWorker1: {
    title: 'Des. Tranf.',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.proceeding?.idExpWorker1;
    // },
  },
  noClasifBien: {
    title: 'No. Clasif.',
    type: 'number',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.noClasifBien;
    },
  },
  procesoExtDom: {
    title: 'Proceso',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.good?.procesoExtDom;
    },
  },
  // warehouseNumb: {
  //   title: 'No. Alma.',
  //   type: 'number',
  //   sort: false,
  // },
  // warehouse: {
  //   title: 'Almacén',
  //   type: 'string',
  //   sort: false,
  // },
  // warehouseLocat: {
  //   title: 'Ubica. Almacén ',
  //   type: 'string',
  //   sort: false,
  // },
  // coordAdmin: {
  //   title: 'Coord. Admin.',
  //   type: 'string',
  //   sort: false,
  // },
  // select: {
  //   title: 'Selec.',
  //   type: 'custom',
  //   renderComponent: CheckboxElementComponent,
  //   onComponentInitFunction(instance: any) {
  //     instance.toggle.subscribe((data: any) => {
  //       data.row.to = data.toggle;
  //     });
  //   },
  //   sort: false,
  // },
};

export const COPY = {
  goodNumber: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
};
