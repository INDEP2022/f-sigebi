export const ESTATE_COLUMNS = {
  googId: {
    title: 'Nº Gestión 1',
    type: 'string',
    sort: false,
  },

  keyUnique: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },

  transferFile: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },

  descriptionGood: {
    title: 'Descripción Transferente',
    sort: false,
  },

  decriptionGoodSae: {
    title: 'Descripción Bien INDEP',
    type: 'string',
    sort: false,
  },

  quantity: {
    title: 'Cantidad Transferente',
    type: 'string',
    sort: false,
  },

  unitMeasurement: {
    title: 'Unidad Medida Transferente',
    type: 'string',
    sort: false,
  },

  physicalState: {
    title: 'Estado Físico Transferente',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  esReprogramming: {
    title: 'Nº Reprogramación',
    type: 'string',
    sort: false,
  },

  aliasWarehouse: {
    title: 'Alias Almacén',
    type: 'string',
    sort: false,
  },

  townshipKey: {
    title: 'Municipio',
    type: 'string',
    sort: false,
  },

  settlementKey: {
    title: 'Localidad',
    type: 'string',
    sort: false,
  },

  code: {
    title: 'Código Postal',
    type: 'string',
    sort: false,
  },
};

export const ESTATE_COLUMNS_VIEW = {
  goodId: {
    title: 'Nª Gestión 2',
    type: 'string',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },

  fileNumber: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },

  goodDescription: {
    title: 'Descripción Transferente',
    sort: false,
  },

  descriptionGoodSae: {
    title: 'Descripción Bien INDEP',
    type: 'string',
    sort: false,
  },

  quantity: {
    title: 'Cantidad Transferente',
    type: 'string',
    sort: false,
  },

  saeMeasureUnit: {
    title: 'Unidad de medida INDEP',
    type: 'string',
    sort: false,
  },

  physicalStatus: {
    title: 'Estado Físico Transferente',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  saePhysicalState: {
    title: 'Estado físico INDEP',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  stateConservation: {
    title: 'Estado de conservación',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  stateConservationSae: {
    title: 'Estado de conservación INDEP',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  quantitySae: {
    title: 'Cantidad INDEP',
    type: 'string',
    sort: false,
  },

  unitMeasure: {
    title: 'Unidad Medida Transferente',
    type: 'string',
    sort: false,
  },
  observations: {
    title: 'Observación',
    type: 'string',
    sort: false,
  },
};

export const ESTATE_COLUMNS_NOTIFY = {
  gestionNumber: {
    title: 'Nº Gestión 3',
    type: 'string',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave única',
    type: 'string',
    sort: false,
  },

  record: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },

  description: {
    title: 'Descripción',
    sort: false,
  },

  transerAmount: {
    title: 'Cantidad Transferente',
    type: 'string',
    sort: false,
  },

  transerUnit: {
    title: 'Unidad Transferente',
    type: 'string',
    sort: false,
  },
};

export const ESTATE_COLUMNS_1 = {
  goodId: {
    title: 'Nª Gestión 4',
    type: 'string',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },

  fileNumber: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },

  goodDescription: {
    title: 'Descripción Transferente',
    sort: false,
  },

  descriptionGoodSae: {
    title: 'Descripción Bien INDEP',
    type: 'string',
    sort: false,
  },

  quantity: {
    title: 'Cantidad Transferente',
    type: 'string',
    sort: false,
  },

  unitMeasure: {
    title: 'Unidad Medida Transferente',
    type: 'string',
    sort: false,
  },

  physicalStatus: {
    title: 'Estado Físico Transferente',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  saePhysicalState: {
    title: 'Estado físico INDEP',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  stateConservation: {
    title: 'Estado de conservación',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  stateConservationSae: {
    title: 'Estado de conservación INDEP',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';
      return value;
    },
  },

  observations: {
    title: 'Observación',
    type: 'string',
    sort: false,
  },
  quantitySae: {
    title: 'Cantidad INDEP',
    type: 'string',
    sort: false,
  },

  saeMeasureUnit: {
    title: 'Unidad de medida INDEP',
    type: 'string',
    sort: false,
  },
};
