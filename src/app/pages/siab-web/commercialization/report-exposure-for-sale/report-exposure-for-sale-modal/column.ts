import { DatePipe } from '@angular/common';

export const DETAIL_COLUMNS = {
  descripcion: {
    title: 'Situación',
    sort: false,
  },
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  fec_cambio: {
    title: 'Fecha del Cambio',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  usuario_cambio: {
    title: 'Usuario Cambio',
    sort: false,
  },
  programa_cambio_estatus: {
    title: 'Programa Cambio Estatus',
    sort: false,
  },
  motivo_cambio: {
    title: 'Motivo del Cambio',
    sort: false,
  },
  no_registro: {
    title: 'No. Registro',
    sort: false,
  },
  proceso_ext_dom: {
    title: 'Proceso Ext_Dom',
    sort: false,
  },
};
