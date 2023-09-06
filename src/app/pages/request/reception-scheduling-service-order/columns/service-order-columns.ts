export const SERVICE_ORDER_COLUMNS = {
  goodId: {
    title: 'Número de gestión',
    type: 'number',
    sort: false,
  },

  uniqueKey: {
    title: 'Clave única',
    type: 'number',
    sort: false,
    /*valuePrepareFunction: (value: any) => {
      return value.uniqueKey;
    }*/
  },

  goodDescription: {
    title: 'Descripción bien transferente',
    type: 'string',
    sort: false,
  },

  unitMeasure: {
    title: 'Unidad de media transferente',
    type: 'string',
    sort: false,
  },

  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },

  transferenceType: {
    title: 'Expediente transferente / PAMA',
    type: 'string',
    sort: false,
  },

  physicalState: {
    title: 'Estado fisico',
    type: 'string',
    sort: false,
  },

  conservationState: {
    title: 'Estado de conservación',
    type: 'string',
    sort: false,
  },

  address: {
    title: 'Dirección',
    type: 'string',
    sort: false,
  },

  /*   numberExpedient: {
    title: 'Número del expediente',
    type: 'number',
    sort: false,
  },

  typeGood: {
    title: 'Tipo bien',
    type: 'string',
    sort: false,
  }, */
};
