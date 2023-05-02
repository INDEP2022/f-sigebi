export const FGR_OPCION: string = 'fgr';

export const COMMON_ACTIONS = [
  {
    value: 'Inserción de menaje',
    title: 'Inserción de menaje',
  },
  {
    value: 'Actualización de datos de bienes',
    title: 'Actualización de datos de bienes',
  },
];
const GOODS_BULK_LOAD_GENERAL_ACTIONS = [
  {
    value: 'Inserción de bienes',
    title: 'Inserción de bienes',
  },
  ...COMMON_ACTIONS,
  {
    value: 'Inserción de volantes',
    title: 'Inserción de volantes',
  },
];

const GOODS_BULK_LOAD_SAT_ACTIONS = [
  {
    value: 'Inserción de bienes de asuntos SAT',
    title: 'Inserción de bienes de asuntos SAT',
  },
  ...COMMON_ACTIONS,
];

const GOODS_BULK_LOAD_PGR_ACTIONS = [
  {
    value: 'Inserción de bienes de asuntos FGR',
    title: 'Inserción de bienes de asuntos FGR',
  },
  // ...COMMON_ACTIONS,
];

export const GOODS_BULK_LOAD_ACTIONS: any = {
  general: GOODS_BULK_LOAD_GENERAL_ACTIONS,
  sat: GOODS_BULK_LOAD_SAT_ACTIONS,
  fgr: GOODS_BULK_LOAD_PGR_ACTIONS,
};

export const GOODS_BULK_LOAD_TARGETS = [
  {
    label: 'General',
    value: 'general',
  },
  {
    label: 'SAT',
    value: 'sat',
  },
  {
    label: 'FGR',
    value: FGR_OPCION,
  },
];
export const SAT_SAE_MUEBLES_PROCESO_4: any = {
  listSearchExist: ['BLINDAJE', 'NUMERO', 'MOTOR'],
  listEqualExist: [
    'ENTIDAD FEDERATIVA',
    'ESTADO FISICO',
    'MARCA',
    'SUBMARCA',
    'MODELO',
    'NUMERO DE PLACAS',
    'NUMERO DE SERIE',
    'PROCEDENCIA',
    'UBICACION',
    'TIPO',
  ],
};
export const SAT_SAE_INMUEBLES_PROCESO_4: any = {
  listSearchExist: [
    'COLONIA',
    'ESTADO FISICO',
    'NOMBRE',
    'CALLE',
    'NUMERO EXTERIOR',
    'NUMERO INTERIOR',
  ],
  listEqualExist: [
    'OFICIO SOLICITUD EN EL RPP',
    'FECHA DE SOLICITUD AL RPP',
    'RPP',
    'MENAJE',
    'DOMICILIO',
    'DELEGACION O MUNICIPIO',
    'ESTADO',
    'SUPERFICIE DEL TERRENO',
    'SUPERFICIE CONSTRUIDA',
    'HABITADO',
    'AGUA',
    'CODIGO POSTAL',
    'ENTIDAD FEDERATIVA',
  ],
};
