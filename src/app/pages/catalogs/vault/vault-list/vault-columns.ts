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
      return value.nameCity;
    },
  },
  stateDetail: {
    title: 'Entidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.descCondition;
    },
  },
  municipalityDetail: {
    title: 'Municipio',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.nameMunicipality;
    },
  },
  localityDetail: {
    title: 'Localidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.nameLocation;
    },
  },
};
