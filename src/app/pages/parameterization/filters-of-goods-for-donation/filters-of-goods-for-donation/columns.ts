export const COLUMNS = {
  statusId: {
    title: 'Estatus Bien',
    sort: false,
  },
  statusDesc: {
    title: 'Descripción Estatus',
    sort: false,
  },
  tagId: {
    title: 'Indicador Destino',
    sort: false,
  },
  tagDesc: {
    title: 'Descripción Indicador',
    sort: false,
  },
};

export const COLUMNS_1 = {
  statusId: {
    title: 'Estatus Bien',
    sort: false,
  },
  status: {
    title: 'Descripción Estatus',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
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
  noLabel: {
    title: 'Indicador Destino',
    sort: false,
  },
  tag: {
    title: 'Descripción Indicador',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
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
};
