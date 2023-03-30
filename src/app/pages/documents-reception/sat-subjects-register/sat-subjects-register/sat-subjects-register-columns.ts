const SAT_PAPERWORK_MAILBOX_COLUMNS = {
  processNumber: {
    title: 'No. Trámite',
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
    title: 'Asunto',
    type: 'string',
    sort: false,
  },
  officeNumber: {
    title: 'Oficio SAT',
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

const SAT_TRANSFER_COLUMNS = {
  satOnlyKey: {
    title: 'SAT Cve Única',
    type: 'string',
    sort: false,
  },
  job: {
    title: 'Oficio',
    type: 'string',
    sort: false,
  },
  satProceedings: {
    title: 'SAT Expediente',
    type: 'string',
    sort: false,
  },
  satDescription: {
    title: 'SAT Descripción',
    type: 'string',
    sort: false,
  },
  satHouseGuide: {
    title: 'SAT Guiahouse',
    type: 'string',
    sort: false,
  },
  satMasterGuide: {
    title: 'SAT Guiamaster',
    type: 'string',
    sort: false,
  },
};

export { SAT_PAPERWORK_MAILBOX_COLUMNS, SAT_TRANSFER_COLUMNS };
