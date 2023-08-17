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
  detbienesadjId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  worthappraisal: {
    title: 'Valor Avalúo',
    type: 'number',
    sort: false,
  },
  appraisalDate: {
    title: 'Fecha Avalúo',
    type: 'string',
    sort: false,
  },
  sessionNumber: {
    title: 'No. Sesión',
    type: 'number',
    sort: false,
  },
  ranksEstate: {
    title: 'Clasifica Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  delegation: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  location: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  mandate: {
    title: 'Mandato',
    type: 'string',
    sort: false,
  },
  rankssiab: {
    title: 'Clasifica SIAB',
    type: 'string',
    sort: false,
  },
  comments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },
};
