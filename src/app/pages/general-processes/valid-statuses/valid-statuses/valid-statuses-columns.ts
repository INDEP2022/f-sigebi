import { IGoodStatus } from 'src/app/core/models/catalogs/good-status.model';

export const VALID_STATUSES_COLUMNS = {
  description: {
    title: 'Operación',
    sort: false,
  },
  status: {
    title: 'Estatus Inicial',
    sort: false,
  },
  statusGood: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (goodStatus: IGoodStatus, row: any) =>
      goodStatus?.description,
  },
  statusFinal: {
    title: 'Estatus Final',
    sort: false,
  },
  descripcion2: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (goodStatus: IGoodStatus, row: any) =>
      row.statusFinal,
  },
  processExtSun: {
    title: 'Proceso Ext Dominio',
    sort: false,
  },
};
