export const NOTIFY_ASSETS_COLUMNS = {
  answered: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  clarificationStatus: {
    title: 'Estatus Aclaración ',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.chatClarification.satClarification;
    },
  },
  chatClarification2: {
    title: 'Aclaración SAT',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.chatClarification.satClarification;
    },
  },
  clarificationType: {
    title: 'Tipo de Aclaración',
    type: 'string',
    sort: false,
    /*valuePrepareFunction: (cell: any, row: any) => {
      if (row.clarifiNewsRejectId.clarificationId == null) return 'ERORR';
      if (row.clarifiNewsRejectId.clarificationId == 17)
        return 'FALTA DOCUMENTACIÓN ANEXA';
      if (row.clarifiNewsRejectId.clarificationId == 18)
        return 'ERORR EN DOCUMENTACIÓN ANEXA';
      if (row.clarifiNewsRejectId.clarificationId == 19)
        return 'INDIVIDUALIZACIÓN DE BIENES';
      if ((row.clarifiNewsRejectId.clarificationId != 17, 18, 19))
        return 'ACLARACIÓN';

      return row.clarifiNewsRejectId.clarificationId;
    },*/
  },
  clarification: {
    title: 'Aclaración',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.clarification.clarification;
    },
  },
  clarification2: {
    title: 'Tipo Aclaración',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.clarification.type;
    },
    /*valuePrepareFunction: (cell: any, row: any) => {
      //return row.clarifiNewsRejectId.clarificationId;
      if (row.clarifiNewsRejectId.clarificationId == 17) return '2';
      if (row.clarifiNewsRejectId.clarificationId == 18) return '2';
      if (row.clarifiNewsRejectId.clarificationId == 19) return '3';
      return '1';
    },*/
  },
  rejectionDate: {
    title: 'Fecha Aclaración',
    type: 'string',
    sort: false,
  },
  reason: {
    title: 'Motivo',
    type: 'string',
    sort: false,
  },
  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
    /*valuePrepareFunction: (cell: any, row: any) => {
      return row.clarifiNewsRejectId.observations;
    },*/
  },
};
