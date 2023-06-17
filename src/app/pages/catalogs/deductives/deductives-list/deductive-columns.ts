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
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-success">Activo</span></strong>';
      if (value == '0')
        return '<strong><span class="badge badge-pill badge-warning">Inactivo</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'Activo' },
          { value: '0', title: 'Inactivo' },
        ],
      },
    },
  },
  contractNumber: {
    title: 'Nº de contrato',
    type: 'number',
    sort: false,
  },
};
