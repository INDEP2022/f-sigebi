export const DOCUMENTS_RECEPTION_SELECT_AREA_COLUMNS = {
  delegation: {
    title: 'Nombre Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  numSubDelegation: {
    title: 'Nombre Subdelegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  id: {
    title: 'Área',
    type: 'string',
    sort: false,
  },
  dsarea: {
    title: 'Siglas Área',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Nombre Área',
    type: 'string',
    sort: false,
  },
};

export const DOCUMENTS_RECEPTION_SELECT_AFFAIR_COLUMNS = {
  id: {
    title: 'Número',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Tipo de Asunto',
    type: 'string',
    sort: false,
  },
  clv: {
    title: 'Relación Bienes',
    type: 'string',
    sort: false,
  },
  nbOrigen: {
    title: 'Aplicación',
    type: 'string',
    sort: false,
  },
};

export const DOCUMENTS_RECEPTION_SELECT_TRACK_RECORD_COLUMNS = {
  expedientNumber: {
    title: 'Expediente',
    type: 'number',
    sort: false,
  },
  wheelNumber: {
    title: 'Volante',
    type: 'number',
    sort: false,
  },
};

export const DOCUMENTS_RECEPTION_SELECT_TRACK_RECORD_GOODS_COLUMNS = {
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  id: {
    title: 'No Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
};

export const DOCUMENTS_RECEPTION_SELECT_DOCUMENTS_COLUMNS = {
  id: {
    title: 'Folio Universal',
    type: 'number',
    sort: false,
  },
  sheets: {
    title: 'Hojas',
    type: 'number',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción Documento',
    type: 'string',
    sort: false,
  },
};

export const DOCUMENTS_RECEPTION_SELECT_UNIQUE_KEY_COLUMNS = {
  uniqueCve: {
    title: 'Clave Única',
    type: 'number',
    sort: false,
  },
  transfereeDesc: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },
  stationDesc: {
    title: 'Emisora',
    type: 'string',
    sort: false,
  },
  authorityDesc: {
    title: 'Autoridad',
    type: 'string',
    sort: false,
  },
  cityDesc: {
    title: 'Ciudad',
    type: 'string',
    sort: false,
  },
  federalEntityDesc: {
    title: 'Entidad Federal',
    type: 'string',
    sort: false,
  },
};
