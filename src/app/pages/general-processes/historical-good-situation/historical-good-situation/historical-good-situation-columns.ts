import { format } from 'date-fns';

export const HISTORICAL_GOOD_SITUATION_COLUMNS = {
  descripcion: {
    title: 'Situación',
    sort: false,
    valuePrepareFunction: (value: string) => value ?? 'Estatus no habilitado',
  },
  fec_cambio: {
    title: 'Fecha Cambio',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'yyyy-MM-dd') : '',
  },
  usuario_cambio: {
    title: 'Usuario',
    sort: false,
  },
  motivo_cambio: {
    title: 'Motivo Cambio',
    sort: false,
  },
  proceso_ext_dom: {
    title: 'Proceso',
    sort: false,
  },
};
