export const VAULT_COLUMNS = {
  idSafe: {
    title: 'No. Bóvedas',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  ubication: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  manager: {
    title: 'Responsable',
    type: 'string',
    sort: false,
  },
  cityDetail: {
    title: 'Ciudad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.nameCity : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.nameCity;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  stateDetail: {
    title: 'Entidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.descCondition : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.descCondition;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },

  municipalityDetail: {
    title: 'Municipio',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.nameMunicipality : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.nameMunicipality;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },

  localityDetail: {
    title: 'Localidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.nameLocation : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.nameLocation;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
};
