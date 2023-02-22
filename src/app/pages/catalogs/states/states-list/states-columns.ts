export const STATES_COLUMNS = {
  cveState: {
    title: 'Registro',
    type: 'string',
    sort: false,
  },
  codeState: {
    title: 'Código',
    type: 'number',
    sort: false,
  },
  descState: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  timeZonaStd: {
    title: 'Zona horaria',
    type: 'string',
    sort: false,
  },
  timeZonaView: {
    title: 'Version de zona horaria',
    type: 'string',
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
};
