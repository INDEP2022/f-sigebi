export const EVENTO_ERROR_COLUMNS = {
  eventId: {
    title: 'Evento',
    width: '60px',
    type: 'string',
    sort: false,
  },
  lotePublico: {
    title: 'Lote',
    width: '60px',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.lot == null) {
        return '';
      } else {
        return row.lot.lotPublic;
      }
    },
  },
  inconsistency: {
    title: 'Inconsistencia',
    type: 'string',
    sort: false,
  },
};
