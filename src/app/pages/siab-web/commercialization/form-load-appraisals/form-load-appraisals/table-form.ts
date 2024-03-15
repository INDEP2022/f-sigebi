export const APPRAISALS_COLUMNS = {
  id_avaluo: {
    title: 'ID',
    type: 'number',
    sort: false,
  },
  cve_avaluo: {
    title: 'Cve Avalúo',
    type: 'string',
    sort: false,
  },
  cve_oficio: {
    title: 'Cve Oficio',
    type: 'string',
    sort: false,
  },
  fecha_insert: {
    title: 'Fecha Inscrito',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
};

export const GOODS_COLUMNS = {
  //estateNumber
  no_bien: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
    width: '15%',
  }, //worthappraisal
  estatus: {
    title: 'Status',
    type: 'number',
    sort: false,
  }, //appraisalDate
  valor_avaluo: {
    title: 'Valor Avalúo',
    type: 'string',
    sort: false,
  }, //sessionNumber
  descripcion: {
    title: 'Descripción',
    type: 'number',
    sort: false,
  }, //ranksEstate
  val34: {
    title: 'Situación Juridica',
    type: 'string',
    sort: false,
  }, //verificar
  description: {
    title: 'Incidencias',
    type: 'string',
    sort: false,
  }, //delegation
  valuado: {
    title: 'Avalúo',
    type: 'string',
    sort: false,
  },
};
export const DETAIL_APPRAISALS_COLUMNS = {
  num: {
    title: 'No.',
    type: 'number',
    sort: false,
  },
  no_bien: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    type: 'number',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  no_clasif_bien: {
    title: 'Clasificador',
    type: 'number',
    sort: false,
  },
  desc_sssubtipo: {
    title: 'Sub Sub Sub Tipo',
    type: 'string',
    sort: false,
  },
  desc_ssubtipo: {
    title: 'Sub Sub Tipo',
    type: 'string',
    sort: false,
  },
  desc_subtipo: {
    title: 'Sub Tipo',
    type: 'string',
    sort: false,
  },
  desc_tipo: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
  fecha_avaluo: {
    title: 'Fecha',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  fecha_vig_avaluo: {
    title: 'Fecha Vigencia',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  nombre_valuador: {
    title: 'Nombre Valuador',
    type: 'string',
    sort: false,
  },
  ref_avaluo: {
    title: 'Referencia',
    type: 'string',
    sort: false,
  },
  apto: {
    title: 'Apto',
    type: 'string',
    sort: false,
  },
  iva: {
    title: 'IVA',
    type: 'string',
    sort: false,
  },
  vri: {
    title: 'Valor de Referencia Inmediata',
    type: 'string',
    sort: false,
  },
  vri_iva: {
    title: 'Valor de Referencia Inmediata IVA',
    type: 'string',
    sort: false,
  },
  vri_iva_redondeado: {
    title: 'VRI IVA Redondeado',
    type: 'string',
    sort: false,
  },
  vc: {
    title: 'Valor Comercial',
    type: 'string',
    sort: false,
  },
  vc_iva: {
    title: 'Valor Comercial IVA',
    type: 'string',
    sort: false,
  },
  dictamen: {
    title: 'Dictamen',
    type: 'string',
    sort: false,
  },
  fecha_dictamen: {
    title: 'Fecha Dictamen',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  fecha_vig_dictamen: {
    title: 'Fecha Vigencia Dictamen',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  descuento_vri: {
    title: 'VRI con Descuento',
    type: 'string',
    sort: false,
  },
  descuento_iva: {
    title: 'VRI IVA con Descuento',
    type: 'string',
    sort: false,
  },
};

export const DT_RECHAZADOS_COLUMNS = {
  NO_BIEN: {
    title: 'No.Bien',
    type: 'string',
    sort: false,
  },
  DESCRIPCION: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  ESTATUS: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  CAUSA: {
    title: 'Causa',
    type: 'string',
    sort: false,
  },
};
