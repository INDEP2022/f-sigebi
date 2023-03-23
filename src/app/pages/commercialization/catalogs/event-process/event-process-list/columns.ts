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
      return row.id.tpeventoId;
    },
  },
  StatusvtaId: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id.statusvtaId;
    },
  },
  phase: {
    title: 'Fase',
    sort: false,
  },
  year: {
    title: 'Año',
    sort: false,
  },
  warrantyDate: {
    title: 'Fecha Garantía',
    sort: false,
  },
};
