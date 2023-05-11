export const NOTIFY_ASSETS_COLUMNS = {
  answered: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },

  clarificationTypeName: {
    title: 'Tipo de Aclaración',
    type: 'string',
    sort: false,
  },

  clarification: {
    title: 'Aclaración',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.clarification == null) return '';
      if (row.clarification != null) return row.clarification.clarification;
    },
  },

  clarification2: {
    title: 'Tipo Aclaración',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.clarification == null) return '';
      if (row.clarification != null) return row.clarification.type;
    },
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
  },

  /*clarificationStatus: {
    title: 'Estatus Aclaración ',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.chatClarification == null) return '';
      if (row.chatClarification != null)
        return row.chatClarification.clarificationStatus;
    },
  },
  chatClarification2: {
    title: 'Aclaración SAT',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.chatClarification == null) return '';
      if (row.chatClarification != null)
        return row.chatClarification.satClarification;
    },
  }, */
};

/*valuePrepareFunction: (cell: any, row: any) => {
      //return row.clarifiNewsRejectId.clarificationId;
      if (row.clarifiNewsRejectId.clarificationId == 17) return '2';
      if (row.clarifiNewsRejectId.clarificationId == 18) return '2';
      if (row.clarifiNewsRejectId.clarificationId == 19) return '3';
      return '1';
    },*/
/*valuePrepareFunction: (cell: any, row: any) => {
  //return row.clarifiNewsRejectId.clarificationId;
  if (row.clarifiNewsRejectId.clarificationId == 17) return '2';
  if (row.clarifiNewsRejectId.clarificationId == 18) return '2';
  if (row.clarifiNewsRejectId.clarificationId == 19) return '3';
  return '1';
},*/
