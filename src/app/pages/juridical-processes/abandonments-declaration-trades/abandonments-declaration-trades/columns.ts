export const COLUMNS_BIENES = {
  id: {
    title: 'No. Bien',
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
  identifier: {
    title: 'Ident.',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  extDomProcess: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
};

// export const

export const COLUMNS_GOOD_JOB_MANAGEMENT = {
  goodNumber: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value?.goodId || value;
    },
  },
  goods: {
    title: 'Bienes',
    type: 'string',
    sort: false,
  },
};

export const COLUMNS_DOCUMENTS = {
  cveDocument: {
    title: 'Cve. Documento',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
};

export const COLUMNS_DOCUMENTS2 = {
  cveDocument: {
    title: 'Cve. Documento',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
};

export const COLUMNS_DICTUMS = {
  id: {
    title: 'ID',
    type: 'string',
    sort: false,
  },
  passOfficeArmy: {
    title: 'Clave de Oficio',
    type: 'string',
    sort: false,
  },
  folioUniversal: {
    title: 'Folio Universal',
    type: 'string',
    sort: false,
  },
  dateDicta: {
    title: 'Fecha de Dictamen',
    type: 'string',
    sort: false,
  },
};

export const COLUMNS_OFICIO = {
  managementNumber: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },
  cveManagement: {
    title: 'Clave de Oficio',
    type: 'string',
    sort: false,
  },
  statusOf: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  dateOficio: {
    title: 'Fecha de Captura',
    type: 'string',
    sort: false,
  },
};

export const EXTERNOS_COLUMS_OFICIO = {
  personExtInt_: {
    title: 'Tipo de persona',
    type: 'string',
    sort: false,
  },
  userOrPerson: {
    title: 'Nombre de la Persona',
    type: 'string',
    sort: false,
  },
};
