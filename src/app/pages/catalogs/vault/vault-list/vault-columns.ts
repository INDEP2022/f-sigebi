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
  managerDetail: {
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
  },
  stateDetail: {
    title: 'Entidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.descCondition : '';
    },
  },
  municipalityDetail: {
    title: 'Municipio',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.nameMunicipality : '';
    },
  },
  localityDetail: {
    title: 'Localidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.nameLocation : '';
    },
  },
};
