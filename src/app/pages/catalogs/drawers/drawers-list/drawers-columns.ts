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
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.description;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },

  status: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
};
