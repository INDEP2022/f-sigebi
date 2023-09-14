export const GENERICS_COLUMNS = {
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  keyId: {
    title: 'Identificador Clave',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  /*userCreation: {
    title: 'Creado por',
    type: 'string',
    sort: false,
  },
  userModification: {
    title: 'Modificado por',
    type: 'string',
    sort: false,
  },*/
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
  active: {
    title: 'Estado',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'Y')
        return '<strong><span class="badge badge-pill badge-success">Activo</span></strong>';
      if (value == 'N')
        return '<strong><span class="badge badge-pill badge-warning">Inactivo</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'Y', title: 'Activo' },
          { value: 'N', title: 'Inactivo' },
        ],
      },
    },
  },
  editable: {
    title: 'Editable',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'Y')
        return '<strong><span class="badge badge-pill badge-success">Editable</span></strong>';
      if (value == 'N')
        return '<strong><span class="badge badge-pill badge-warning">No editable</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'Y', title: 'Editable' },
          { value: 'N', title: 'No editable' },
        ],
      },
    },
  },
};
