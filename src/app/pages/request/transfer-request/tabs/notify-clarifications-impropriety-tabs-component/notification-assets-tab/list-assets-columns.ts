export const LIST_ASSETS_COLUMN = {
  clarification: {
    title: 'Estatus Aclaración',
    type: 'string',
    sort: false,
  },
  goodId: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción Bien',
    type: 'string',
    sort: false,
  },
  unit: {
    title: 'Unidad de Medida',
    type: 'string',
    sort: false,
  },
  physicalStatus: {
    title: 'Estado Físico',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';

      return value;
    },
  },
  stateConservation: {
    title: 'Estado de Conservación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1') return 'BUENO';
      if (value == '2') return 'MALO';

      return value;
    },
  },
};
