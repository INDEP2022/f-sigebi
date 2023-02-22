const COMMON_ACTIONS = [
  {
    value: 'Inserción de mensaje',
    title: 'Inserción de mensaje',
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
    value: 'Inserción de bienes de asuntos PGR',
    title: 'Inserción de bienes de asuntos PGR',
  },
  ...COMMON_ACTIONS,
];

export const GOODS_BULK_LOAD_ACTIONS = {
  general: GOODS_BULK_LOAD_GENERAL_ACTIONS,
  sat: GOODS_BULK_LOAD_SAT_ACTIONS,
  pgr: GOODS_BULK_LOAD_PGR_ACTIONS,
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
    label: 'PGR',
    value: 'pgr',
  },
];
