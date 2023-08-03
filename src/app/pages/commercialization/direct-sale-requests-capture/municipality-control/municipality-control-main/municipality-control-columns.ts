export const MUNICIPALITY_CONTROL_APPLICANT_COLUMNS = {
  soladjinstgobId: {
    title: 'Solicitud',
    type: 'number',
    sort: false,
  },
  typeentgobId: {
    title: 'Entidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (id: any) => {
      return id.typeentgobId;
    },
  },
  applicant: {
    title: 'Solicitante',
    type: 'string',
    sort: false,
  },
  position: {
    title: 'Puesto',
    type: 'string',
    sort: false,
  },
  municipality: {
    title: 'Municipio',
    type: 'string',
    sort: false,
  },
  state: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
  applicationDate: {
    title: 'Fecha Solicitud',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Cant. Solic.',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    type: 'string',
    sort: false,
  },
  award: {
    title: 'Adjudicación',
    type: 'string',
    sort: false,
  },
  webmail: {
    title: 'Correo Web',
    type: 'string',
    sort: false,
  },
};

export const MUNICIPALITY_CONTROL_ASSIGNED_GOOD_COLUMNS = {
  repvendcId: {
    title: 'N° Bien',
    type: 'number',
    sort: false,
  },
  bill: {
    title: 'Valor Avalúo',
    type: 'number',
    sort: false,
  },
  labelsent: {
    title: 'Fecha Avalúo',
    type: 'string',
    sort: false,
  },
  addresssent: {
    title: 'N° Sesión',
    type: 'number',
    sort: false,
  },
  labelBatch: {
    title: 'Clasifica Bien',
    type: 'string',
    sort: false,
  },
  paragraph1: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  ccp1: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  ccp2: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  nbOrigin: {
    title: 'Mandato',
    type: 'string',
    sort: false,
  },
  managed: {
    title: 'Clasifica SIAB',
    type: 'string',
    sort: false,
  },
  sayDelivery: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },
};
