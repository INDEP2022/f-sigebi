export const DEDUCTIVE_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  serviceType: {
    title: 'Tipo de servicio',
    type: 'string',
    sort: false,
  },
  weightedDeduction: {
    title: 'Ponderación',
    type: 'number',
    sort: false,
  },
  startingRankPercentage: {
    title: 'Porcentaje inicial',
    type: 'number',
    sort: false,
  },
  finalRankPercentage: {
    title: 'Porcentaje final',
    type: 'number',
    sort: false,
  },
  creationUser: {
    title: 'Creado por',
    type: 'string',
    sort: false,
  },
  editionUser: {
    title: 'Modificado por',
    type: 'string',
    sort: false,
  },
  version: {
    title: 'Version',
    type: 'number',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'html',
    valuePrepareFunction: (value: number) => {
      return value == 0
        ? '<strong><span class="badge badge-pill badge-success">Activo</span></strong>'
        : '<strong><span class="badge badge-pill badge-warning">Inactivo</span></strong>';
    },
    sort: false,
  },
  contractNumber: {
    title: 'No. de contrato',
    type: 'number',
    sort: false,
  },
};
