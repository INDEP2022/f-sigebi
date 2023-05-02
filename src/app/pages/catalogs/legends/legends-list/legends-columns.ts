export const LEGENDS_COLUMS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  legend: {
    title: 'Leyenda',
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
  status: {
    title: 'Estatus',
    type: 'html',
    valuePrepareFunction: (value: number) => {
      return value == 0
        ? '<strong><span class="badge badge-pill label-success">Activo</span></strong>'
        : '<strong><span class="badge badge-pill label-danger">Inactivo</span></strong>';
    },
    sort: false,
  },
};
