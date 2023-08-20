import { IGoodStatus } from 'src/app/core/models/catalogs/good-status.model';

export const VALID_STATUSES_COLUMNS = {
  id: {
    title: 'Operación',
    sort: false,
  },
  status: {
    title: 'Estatus Inicial',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.status;
    },
  },
  statusGood: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.description;
    },
  },
  statusFinal: {
    title: 'Estatus Final',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.statusFinal.codejuntgob;
    },
  },
  descripcion2: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (goodStatus: IGoodStatus, row: any) =>
      row.statusFinal.description,
  },
  processExtSun: {
    title: 'Proceso Ext. Dominio',
    sort: false,
  },
};
export const HELP_COLUMNS = {
  screenKey: {
    title: 'Pantalla',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  isFoundInMenu: {
    title: 'Url',
    sort: false,
  },
  menuName: {
    title: 'nombre Menú',
    sort: false,
  },
  recordNumber: {
    title: 'Número de Registro',
    sort: false,
  },
  assignAttributes: {
    title: 'Tributos Asignados',
    sort: false,
  },
  assignAll: {
    title: 'Asignar Todos',
    sort: false,
  },
};
