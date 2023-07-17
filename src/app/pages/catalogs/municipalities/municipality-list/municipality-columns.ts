export const MUNICIPALITIES_COLUMNS = {
  stateKey: {
    title: 'Clave',
    type: 'number',
    sort: false,
  },
  idMunicipality: {
    title: 'Código Municipio',
    type: 'number',
    sort: false,
  },
  nameMunicipality: {
    title: 'Nombre de Municipio',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  state: {
    title: 'Estado',
    type: 'string',
    valuePrepareFunction: (value: any) => {
      return value.descCondition;
    },
    sort: false,
  },
  version: {
    title: 'Versión',
    type: 'string',
    sort: false,
  },
};
