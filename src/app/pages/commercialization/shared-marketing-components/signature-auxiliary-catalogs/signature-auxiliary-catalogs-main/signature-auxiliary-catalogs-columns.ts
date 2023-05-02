export const ELECTRONIC_SIGNATURE_REPORT_COLUMNS = {
  screen: {
    title: 'Pantalla',
    type: 'string',
    sort: false,
  },
  signerQuantity: {
    title: 'Número de Firmantes.',
    type: 'number',
    sort: false,
  },
  title: {
    title: 'Título del Reporte (XML)',
    type: 'string',
    sort: false,
  },
  report: {
    title: 'Reporte Asociado (XML)',
    type: 'string',
    sort: false,
  },
};

export const ELECTRONIC_SIGNATURE_ADDRESSEE_COLUMNS = {
  email: {
    title: 'Dirección de Correo',
    type: 'string',
    sort: false,
  },
  name: {
    title: 'Nombre del Destinatario',
    type: 'string',
    sort: false,
  },
};

export const ELECTRONIC_SIGNATURE_TYPE_COLUMNS = {
  denomination: {
    title: 'Denominación',
    type: 'string',
    sort: false,
  },
  order: {
    title: 'Orden de Presentación',
    type: 'number',
    sort: false,
  },
};

export const ELECTRONIC_SIGNATURE_EVENT_COLUMNS = {
  event: {
    title: 'Evento',
    type: 'number',
    sort: false,
  },
  reportId: {
    title: 'N° Reporte',
    type: 'number',
    sort: false,
  },
  originId: {
    title: 'Id Origen',
    type: 'number',
    sort: false,
  },
  documentId: {
    title: 'Id Documento',
    type: 'number',
    sort: false,
  },
  title: {
    title: 'Título',
    type: 'string',
    sort: false,
  },
  creationDate: {
    title: 'Fecha de Creación',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus Reporte',
    type: 'string',
    sort: false,
  },
};

export const ELECTRONIC_SIGNATURE_SIGNATURE_COLUMNS = {
  reportId: {
    title: 'N°',
    type: 'number',
    sort: false,
  },
  reportNumber: {
    title: 'N° Reporte',
    type: 'number',
    sort: false,
  },
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  position: {
    title: 'Cargo',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
  signer: {
    title: 'Firmante',
    type: 'string',
    sort: false,
  },
  signDate: {
    title: 'Fecha Firma',
    type: 'string',
    sort: false,
  },
};
