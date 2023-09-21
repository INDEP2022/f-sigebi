export const IMPLEMENTATIONREPORT_COLUMNS = {
  goodNumber: {
    title: 'No.Bien',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.goodNumber.id;
    },
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.goodNumber.description;
    },
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
    valuePrepareFunction(cell: any, row: any) {
      return row.goodNumber.quantity;
    },
  },
};

export const IMPLEMENTATION_COLUMNS = {
  service: {
    title: 'Servicio',
    sort: false,
  },
  specification: {
    title: 'Espesificación',
    sort: false,
  },
  turn: {
    title: 'Turno',
    sort: false,
  },
  costVariable: {
    title: 'Variable de costo',
    sort: false,
  },
  observations: {
    title: 'Observaciones',
    width: '20%',
    sort: false,
  },
  cost: {
    title: 'Costo',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
  },
  amount: {
    title: 'Importe',
    sort: false,
  },
};
