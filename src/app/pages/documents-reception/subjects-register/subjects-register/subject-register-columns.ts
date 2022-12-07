const PGR_PAPERWORK_MAILBOX_COLUMNS = {
  noBien: {
    title: 'No. Tramite',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Estatus Tramite',
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
    title: 'Aver. Previa',
    type: 'string',
    sort: false,
  },
  oficio: {
    title: 'Oficio PGR',
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
