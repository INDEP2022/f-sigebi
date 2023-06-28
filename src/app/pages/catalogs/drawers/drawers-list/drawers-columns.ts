export const DRAWERS_COLUMNS = {
  id: {
    title: 'No. Gaveta',
    type: 'number',
    sort: false,
  },

  noDrawer: {
    title: 'No. Bóveda',
    type: 'number',
    sort: false,
  },

  safeDetails: {
    title: 'Desc. Bóveda',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any): string => {
      return value.description;
    },
  },

  status: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
};
