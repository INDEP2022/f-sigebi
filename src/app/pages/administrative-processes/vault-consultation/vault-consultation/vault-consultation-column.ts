export const COUNT_SAFE_COLUMNS = {
  idSafe: {
    title: 'No. Bóveda',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  ubication: {
    title: 'Ubicación',
    sort: false,
  },
  manager: {
    title: 'Responsable',
    sort: false,
  },
  stateCode: {
    title: 'Entidad',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.stateDetail?.descCondition;
    },
  },
  municipalityCode: {
    title: 'Municipio',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.municipalityDetail?.nameMunicipality;
    },
  },
  cityCode: {
    title: 'Ciudad',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.cityDetail?.nameCity;
    },
  },
  localityCode: {
    title: 'Localidad',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.localityDetail?.nameLocation;
    },
  },
};

export const COUNT_GOOD_COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
  },
  fileNumber: {
    title: 'Expediente',
    sort: false,
  },
};
