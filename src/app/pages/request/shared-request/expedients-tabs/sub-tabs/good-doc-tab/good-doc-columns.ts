export const GOOD_DOCUMENTES_COLUMNS = {
  requestId: {
    title: 'No. Solicitud',
    type: 'string',
    sort: false,
  },

  goodId: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },

  goodTypeName: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },

  fractionId: {
    title: 'Fracción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: string) => {
      return value ? (value.includes('undefined') ? '' : value) : '';
    },
  },

  requestFolio: {
    title: 'Folio de solicitud',
    type: 'string',
    sort: false,
  },

  descriptionGoodSae: {
    title: 'Descripción bien SAE',
    type: 'string',
    sort: false,
    width: '200px',
  },
  physicalStatus: {
    title: 'Estado Físico',
    type: 'string',
    sort: false,
  },

  stateConservation: {
    title: 'Estado de Conservación',
    type: 'string',
    sort: false,
  },

  unitMeasure: {
    title: 'Unidad de medida transferente',
    type: 'string',
    sort: false,
  },
  ligieUnit: {
    title: 'Unidad de medida Ligie',
    type: 'string',
    sort: false,
  },

  quantity: {
    title: 'Cantidad de la transferente',
    type: 'string',
    sort: false,
  },

  saeDestiny: {
    title: 'Destino SAE',
    type: 'string',
    sort: false,
  },
};
