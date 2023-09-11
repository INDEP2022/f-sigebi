export const ASSETS_COLUMNS = {
  goodId: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },
  goodDescription: {
    title: 'Descripción del Bien Transferente',
    type: 'string',
    sort: false,
  },
  descriptionRelevantType: {
    title: 'Tipo de Bien',
    type: 'string',
    sort: false,
  },
  descriptionPhysicalStatus: {
    title: 'Estado Físico',
    type: 'string',
    sort: false,
  },
  descriptionConservationStatus: {
    title: 'Estado de Conservación',
    type: 'string',
    sort: false,
  },
  measureUnitTransferent: {
    title: 'Unidad de Medida Transferente',
    type: 'string',
    sort: false,
  },
  measureUnitLigie: {
    title: 'Unidad de Medida de la Ligie',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad de Transferente',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return Number(value);
    },
  },
  descriptionDestiny: {
    title: 'Destino Ligie',
    type: 'string',
    sort: false,
  },
  descriptionDestinyTransferent: {
    title: 'Destino Transferente',
    type: 'string',
    sort: false,
  },
  goodMenaje: {
    title: 'Menaje del Bien',
    type: 'string',
    sort: false,
  },
  /*  fraccion: {
    title: 'Fracción',
    valuePrepareFunction: (value: any) => {
      return value.fractionCode;
    },
    type: 'string',
    sort: false,
  }, */
  codeFracction: {
    title: 'Fracción',
    type: 'string',
    sort: false,
  },
};
