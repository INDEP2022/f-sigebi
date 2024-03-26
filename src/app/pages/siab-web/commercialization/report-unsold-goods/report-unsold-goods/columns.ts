export const GOODS_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  estatus: {
    title: 'Estatus Bien',
    sort: false,
  },
  descripcion: {
    title: 'Descripción del Bien',
    sort: false,
  },

  total_eventos_ref: {
    title: 'Número de Eventos Reforma',
    sort: false,
  },
  dias_sin_vender_ref: {
    title: 'Días Trancurridos Reforma',
    sort: false,
  },
  fec_pub_primer_evento_ref: {
    title: 'Publicación Primer Evento Reforma',
    sort: false,
  },
  fec_fallo_primer_evento_ref: {
    title: 'Fallo Primer Evento Reforma',
    sort: false,
  },
  fec_pub_ultimo_evento_ref: {
    title: 'Publicación Último Evento Reforma',
    sort: false,
  },
  fec_fallo_ultimo_evento_ref: {
    title: 'Fallo Último Evento Reforma',
    sort: false,
  },

  total_eventos: {
    title: 'Número de Eventos Histórico',
    sort: false,
  },
  dias_sin_vender_historico: {
    title: 'Días Trancurridos Histórico',
    sort: false,
  },
  fec_pub_primer_evento_hist: {
    title: 'Publicación Primer Evento Histórico',
    sort: false,
  },
  fec_fallo_primer_evento_hist: {
    title: 'Fallo Primer Evento Histórico',
    sort: false,
  },
  fec_pub_ultimo_evento_hist: {
    title: 'Publicación Último Evento Histórico',
    sort: false,
  },
  fec_fallo_ultimo_evento_hist: {
    title: 'Fallo Último Evento Histórico',
    sort: false,
  },

  tipo_bien: {
    title: 'Tipo de Bien',
    sort: false,
  },
  sub_tipo_bien: {
    title: 'Sub Tipo Bien',
    sort: false,
  },
  delegacion_admin: {
    title: 'Delegación Administra',
    sort: false,
  },
};

export const SUBTYPE_COLUMNS_REPORT = {
  subtypeNumber: {
    title: 'No. Subtipo',
    sort: false,
    type: 'string',
  },
  goodSubtypeName: {
    title: 'Descripción',
    sort: false,
    type: 'string',
  },
};

export const DELEGATION_COLUMNS_REPORT = {
  id: {
    title: 'No. Delegación',
    sort: false,
    type: 'string',
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'string',
  },
};

export const STATUS_COLUMNS_REPORT = {
  status: {
    title: 'Estatus',
    sort: false,
    type: 'string',
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'string',
  },
};

export const HISTORY_COLUMNS_REPORT = {
  descripcion: {
    title: 'Situación',
    sort: false,
    type: 'string',
  },
  no_bien: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
  },
  estatus: {
    title: 'Estatus',
    sort: false,
    type: 'string',
  },
  fec_cambio: {
    title: 'Fecha del Cambio',
    sort: false,
    type: 'string',
  },
  usuario_cambio: {
    title: 'Usuario Cambio',
    sort: false,
    type: 'string',
  },
  programa_cambio_estatus: {
    title: 'Programa Cambio Estatus',
    sort: false,
    type: 'string',
  },
  motivo_cambio: {
    title: 'Motivo del Cambio',
    sort: false,
    type: 'string',
  },
  proceso_ext_dom: {
    title: 'Proceso Ext. Dom.',
    sort: false,
    type: 'string',
  },
};

export const HISTORY_EVENT_COLUMNS_REPORT = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
  },
  descripcion: {
    title: 'Tipo Evento',
    sort: false,
    type: 'string',
  },
  cve_proceso: {
    title: 'Clave Evento',
    sort: false,
    type: 'string',
  },
  fecha_evento: {
    title: 'Fecha Evento',
    sort: false,
    type: 'string',
  },
  fecha_fallo: {
    title: 'Fecha Fallo',
    sort: false,
    type: 'string',
  },
};
