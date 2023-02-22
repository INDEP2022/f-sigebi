import { IUsers } from 'src/app/core/models/catalogs/maximum-times-model';

export const MAXIMUM_TIMES_COLUMNS = {
  certificateType: {
    title: 'Tipo de acta',
    sort: false,
  },
  date: {
    title: 'Fecha',
    sort: false,
  },
  tmpMax: {
    title: 'Tiempo máximo',
    sort: false,
  },
  activated: {
    title: 'Activado',
    sort: false,
  },
  user: {
    title: 'Usuario',
    valuePrepareFunction: (value: IUsers) => {
      return value != null ? value.name : '-';
    },
    sort: false,
  },
};
