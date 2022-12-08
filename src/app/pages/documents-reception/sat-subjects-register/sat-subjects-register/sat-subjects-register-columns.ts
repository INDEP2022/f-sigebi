const SAT_PAPERWORK_MAILBOX_COLUMNS = {
  noBien: {
    title: 'SAT Cve Única',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Estatus tramite',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'Fecha ingreso tramite',
    type: 'string',
    sort: false,
  },
  ident: {
    title: 'No Volante',
    type: 'string',
    sort: false,
  },
  est: {
    title: 'No expediente',
    type: 'string',
    sort: false,
  },
  proceso: {
    title: 'Asunto',
    type: 'string',
    sort: false,
  },
  oficio: {
    title: 'Oficio SAT',
    type: 'string',
    sort: false,
  },
  delegacion: {
    title: 'No Delegación',
    type: 'string',
    sort: false,
  },
  usuario: {
    title: 'Usuario turnado',
    type: 'string',
    sort: false,
  },
};

const SAT_TRANSFER_COLUMNS = {
  noBien: {
    title: 'SAT Cve Única',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Oficio',
    type: 'string',
    sort: false,
  },
  cantidad: {
    title: 'SAT Expediente',
    type: 'string',
    sort: false,
  },
  ident: {
    title: 'SAT Descripción',
    type: 'string',
    sort: false,
  },
  est: {
    title: 'SAT Guiahouse',
    type: 'string',
    sort: false,
  },
  proceso: {
    title: 'SAT Guiamaster',
    type: 'string',
    sort: false,
  },
};

export { SAT_PAPERWORK_MAILBOX_COLUMNS, SAT_TRANSFER_COLUMNS };
