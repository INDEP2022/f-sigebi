export const DELEGATION_STATE_COLUMNS = {
  regionalDelegation: {
    title: 'Registro',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  stateCode: {
    title: 'Código de estado',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.codeCondition : '';
    },
  },
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
  keyState: {
    title: 'Clave de estado',
    type: 'number',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'html',
    valuePrepareFunction: (value: string) => {
      if (value === '1') {
        return '<strong><span class="badge badge-pill badge-success">Activo</span></strong>';
      } else if (value === '0') {
        return '<strong><span class="badge badge-pill badge-warning">Inactivo</span></strong>';
      } else {
        return '<strong><span class="badge badge-pill badge-secondary">Desconocido</span></strong>';
      }
    },
    sort: false,
  },
  editionUser: {
    title: 'Modificado por',
    type: 'string',
    sort: false,
  },
};
