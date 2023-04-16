export const NOTIFY_ASSETS_COLUMNS = {
  statusId: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  clarificationStatus: {
    title: 'Estatus Aclaración ',
    type: 'string',
    sort: false,
  },
  satClarify: {
    title: 'Aclaración SAT',
    type: 'string',
    sort: false,
  },
  clarificationTypeId: {
    title: 'Tipo de Aclaración',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.clarifiNewsRejectId.clarificationId == 17)
        return 'FALTA DOCUMENTACIÓN ANEXA';
      if (row.clarifiNewsRejectId.clarificationId == 18)
        return 'ERORR EN DOCUMENTACIÓN ANEXA';
      if (row.clarifiNewsRejectId.clarificationId == null) return 'ERORR';
      if ((row.clarifiNewsRejectId.clarificationId != 18, 17))
        return 'ACLARACIÓN';
      return row.clarifiNewsRejectId.clarificationId;
    },
  },
  id: {
    title: 'Aclaración',
    type: 'string',
    sort: false,
  },
  clarificationInvoice: {
    title: 'Tipo Aclaración',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.clarifiNewsRejectId.clarificationId;
    },
  },
  clarifyDate: {
    title: 'Fecha Aclaración',
    type: 'string',
    sort: false,
  },
  clarifiNewsRejectId: {
    title: 'Motivo',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.clarifiNewsRejectId.reason;
    },
  },
  clarifiNewsRejectId1: {
    title: 'observation',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.clarifiNewsRejectId.observations;
    },
  },
};
