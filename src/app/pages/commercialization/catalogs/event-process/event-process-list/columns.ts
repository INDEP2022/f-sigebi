export const COLUMNS = {
  id: {
    title: 'Id Evento',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id.id;
    },
  },
  processKey: {
    title: 'Cve Proceso',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id.processKey;
    },
  },
  tpeventoId: {
    title: 'Tipo',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id.tpEventId;
    },
  },
  StatusvtaId: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id.StatusvtaId;
    },
  },
  phaseInmu: {
    title: 'Fase',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id.phaseInmu;
    },
  },
  year: {
    title: 'Año',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id.year;
    },
  },
  notificationDate: {
    title: 'Fecha Garantía',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id.notificationDate;
    },
  },
};
