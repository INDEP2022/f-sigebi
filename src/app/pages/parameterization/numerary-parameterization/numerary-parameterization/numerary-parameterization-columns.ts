export const NUMERARY_PARAMETERIZATION_COLUMNS = {
  typeProceeding: {
    title: 'Tipo de Acta o Pantalla',
    type: 'string',
    sort: false,
  },
  initialCategory: {
    title: 'Categoría Inicial',
    type: 'string',
    sort: false,
  },
  initialCategoryDetails: {
    title: 'Desc. Categoría Inicial',
    type: 'string',
    valuePrepareFunction: (value: any) => {
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
    sort: false,
  },
  finalCategory: {
    title: 'Categoría Final',
    type: 'string',
    sort: false,
  },
  finalCategoryDetails: {
    title: 'Desc. Categoría Final',
    type: 'string',
    valuePrepareFunction: (value: any) => {
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
    sort: false,
  },
};
