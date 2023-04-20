const PGR_PAPERWORK_MAILBOX_COLUMNS = {
  processNumber: {
    title: 'No. Trámite',
    type: 'number',
    sort: false,
  },
  processStatus: {
    title: 'Estatus Trámite',
    type: 'string',
    sort: false,
  },
  processEntryDate: {
    title: 'Fecha Ingreso Trámite',
    type: 'string',
    sort: false,
  },
  flierNumber: {
    title: 'No. Volante',
    type: 'number',
    sort: false,
  },
  proceedingsNumber: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  issue: {
    title: 'Aver. Previa',
    type: 'string',
    sort: false,
  },
  officeNumber: {
    title: 'Oficio FGR',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'No. Delegación',
    type: 'number',
    sort: false,
  },
  turnadoiUser: {
    title: 'Usuario Turnado',
    type: 'string',
    sort: false,
  },
};

const PGR_TRANSFERS_COLUMNS = {
  pgrGoodNumber: {
    title: 'FGR No. Bien',
    type: 'number',
    sort: false,
  },
  office: {
    title: 'FGR Oficio',
    type: 'string',
    sort: false,
  },
  aveprev: {
    title: 'Aver. Previa',
    type: 'string',
    sort: false,
  },
  saeGoodNumber: {
    title: 'INDEP No. Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'INDEP Descripción',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'INDEP Estatus',
    type: 'string',
    sort: false,
  },
};

export { PGR_PAPERWORK_MAILBOX_COLUMNS, PGR_TRANSFERS_COLUMNS };
