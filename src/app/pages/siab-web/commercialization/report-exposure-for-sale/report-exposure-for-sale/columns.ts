import { DatePipe } from '@angular/common';

export const UNEXPOSED_GOODS_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion_bien: {
    title: 'Descripción',
    sort: false,
  },
  valor_base: {
    title: 'Valor Base',
    sort: false,
  },
  nombre_transferente: {
    title: 'Desc. Transferente',
    sort: false,
  },
  id_estatusvta: {
    title: 'ID Status VTA',
    sort: false,
  },
  fecha_bien: {
    title: 'Fecha Bien',
    sort: false,
  },
  fecha_fallo: {
    title: 'Fecha Fallo',
    sort: false,
  },
  fecha_evento: {
    title: 'Fecha Evento',
    sort: false,
  },
  fecha_creacion: {
    title: 'Fecha Creación',
    sort: false,
  },
  tipo_bien: {
    title: 'Tipo Bien',
    sort: false,
  },
  sub_tipo_bien: {
    title: 'Sub tipo Bien',
    sort: false,
  },
  delegacion_admin: {
    title: 'Delegación Admin',
    sort: false,
  },
};

export const MONTH_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion_bien: {
    title: 'Descripción',
    sort: false,
  },
  valor_base: {
    title: 'Valor Base',
    sort: false,
  },
  nombre_transferente: {
    title: 'Desc. Transferente',
    sort: false,
  },
  id_estatusvta: {
    title: 'ID Status VTA',
    sort: false,
  },
  fecha_bien: {
    title: 'Fecha Bien',
    sort: false,
  },
  fecha_fallo: {
    title: 'Fecha Fallo',
    sort: false,
  },
  fecha_evento: {
    title: 'Fecha Evento',
    sort: false,
  },
  fecha_creacion: {
    title: 'Fecha Creación',
    sort: false,
  },
  tipo_bien: {
    title: 'Tipo Bien',
    sort: false,
  },
  sub_tipo_bien: {
    title: 'Sub tipo Bien',
    sort: false,
  },
  delegacion_admin: {
    title: 'Delegación Admin',
    sort: false,
  },
};

export const CONSULT_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
  valor_base: {
    title: 'Valor Base',
    sort: false,
  },
  desc_transferente: {
    title: 'Desc. Transferente',
    sort: false,
  },
  id_estatusvta: {
    title: 'ID Status VTA',
    sort: false,
  },
  fecha_bien: {
    title: 'Fecha Bien',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  fecha_fallo: {
    title: 'Fecha Fallo',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  fecha_evento: {
    title: 'Fecha Evento',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  fecha_creacion: {
    title: 'Fecha Creación',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
  },
  tipo_bien: {
    title: 'Tipo Bien',
    sort: false,
  },
  sub_tipo_bien: {
    title: 'Sub tipo Bien',
    sort: false,
  },
  delegacion_admin: {
    title: 'Delegación Admin',
    sort: false,
  },
};
