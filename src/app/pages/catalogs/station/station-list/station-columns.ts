export const STATION_COLUMS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  stationName: {
    title: 'Estación',
    type: 'number',
    sort: false,
  },
  transferent: {
    title: 'Transferencia',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.nameTransferent : '';
    },
  },
};
