export const COMCALCULATED_COLUMS = {
  comCalculatedId: {
    title: 'ID Calcular',
    type: 'string',
    sort: false,
  },
  thirdComerId: {
    title: 'iD Tercero comer',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return 'ID: ' + value.thirdComerId + ' | ' + 'Nombre:' + value.nameReason;
    },
  },
  startDate: {
    title: 'Fecha inicio',
    type: 'string',
    sort: false,
  },
  endDate: {
    title: 'Fecha final',
    type: 'string',
    sort: false,
  },
  eventId: {
    title: 'ID Event',
    type: 'string',
    sort: false,
  },
  changeType: {
    title: 'Tipo de cambio',
    type: 'string',
    sort: false,
  },
  userBelieve: {
    title: 'Usuario creador',
    type: 'string',
    sort: false,
  },
  believeDate: {
    title: 'Fecha de creación',
    type: 'string',
    sort: false,
  },
};

export const COMISIONESXBIEN_COLUMNS = {
  comCalculatedId: {
    title: 'ID Calcula',
    type: 'string',
    sort: false,
  },
  goodNumber: {
    title: 'ID Bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  eventId: {
    title: 'ID Evento',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.eventId;
    },
  },
  amountCommission: {
    title: 'monto comisión',
    type: 'string',
    sort: false,
  },
  batch: {
    title: 'Lote',
    type: 'string',
    sort: false,
  },
  cvman: {
    title: 'Cvman',
    type: 'string',
    sort: false,
  },
  sale: {
    title: 'Venta',
    type: 'string',
    sort: false,
  },
  comments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },
  processIt: {
    title: 'Procesa',
    type: 'string',
    sort: false,
  },
  saleTc: {
    title: 'Sale TC',
    type: 'string',
    sort: false,
  },
};
