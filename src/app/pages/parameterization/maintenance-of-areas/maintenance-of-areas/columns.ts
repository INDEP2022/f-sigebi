export const COLUMNS = {
  id: {
    title: 'Clave Administrativa',
    sort: false,
  },
  dsarea: {
    title: 'Área',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  /*
  delegation: {
    title: 'Delegacion',
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
  numSubDelegation: {
    title: 'Subdelegacion',
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
  },*/
};
