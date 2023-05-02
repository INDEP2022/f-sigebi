export const STATES_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'string',
    sort: false,
  },
  codeCondition: {
    title: 'Código',
    type: 's tring',
    sort: false,
  },
  descCondition: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  zoneHourlyStd: {
    title: 'Zona horaria',
    type: 'string',
    sort: false,
  },
  zoneHourlyVer: {
    title: 'Version de zona horaria',
    type: 'string',
    sort: false,
  },
  userCreation: {
    title: 'Creado por',
    type: 'string',
    sort: false,
  },
  userModification: {
    title: 'Modificado por',
    type: 'string',
    sort: false,
  },
  version: {
    title: 'Version',
    type: 'number',
    sort: false,
  },
  // status: {
  //   title: 'Estatus',
  //   type: 'html',
  //   valuePrepareFunction: (value: number) => {
  //     return value == 0
  //       ? '<strong><span class="badge badge-pill badge-success">Activo</span></strong>'
  //       : '<strong><span class="badge badge-pill badge-warning">Inactivo</span></strong>';
  //   },
  //   sort: false,
  // },
};
