const PGR_PAPERWORK_MAILBOX_COLUMNS = {
  processNumber: {
    title: 'No. Tramite',
    type: 'number',
    sort: false,
  },
  processStatus: {
    title: 'Estatus tramite',
    type: 'string',
    sort: false,
  },
  processEntryDate: {
    title: 'Fecha Ingreso Trámite',
    type: 'string',
    sort: false,
  },
  wheelNumber: {
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
    title: 'Oficio PGR',
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
  noBien: {
    title: 'PGR No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'PGR Oficio',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Aver. Previa',
    type: 'string',
    sort: false,
  },
  ident: {
    title: 'SAE No. Bien',
    type: 'string',
    sort: false,
  },
  est: {
    title: 'SAE Descripción',
    type: 'string',
    sort: false,
  },
  proceso: {
    title: 'SAE Estatus',
    type: 'string',
    sort: false,
  },
};

export { PGR_PAPERWORK_MAILBOX_COLUMNS, PGR_TRANSFERS_COLUMNS };
