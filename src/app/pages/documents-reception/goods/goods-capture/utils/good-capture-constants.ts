const CVE_PARAMETER = 'CLASINUMER';
const FLYERS_REGISTRATION_CODE = 'FACTOFPREGRECDOCM';
const TYPE_NOT_FOUND_FIELDS = [
  'type',
  'subtype',
  'ssubtype',
  'sssubtype',
  'noClasifBien',
  'descripcion',
  'cantidad',
];
const SUBTYPE_NOT_FOUND_FIELDS = [
  'subtype',
  'ssubtype',
  'sssubtype',
  'noClasifBien',
  'descripcion',
  'cantidad',
];
const SSUBTYPE_NOT_FOUND_FIELDS = [
  'ssubtype',
  'sssubtype',
  'noClasifBien',
  'descripcion',
  'cantidad',
];

const SSSUBTYPE_NOT_FOUND_FIELDS = [
  'sssubtype',
  'noClasifBien',
  'descripcion',
  'cantidad',
];

const SAT_DISABLED_FIELDS = [
  'noClasifBien',
  'capitulo',
  'partida',
  'subpartida',
  'ssubpartida',
  'type',
  'subtype',
  'ssubtype',
  'sssubtype',
  'destino',
  'descripcion',
  'unidadLigie',
  'unidadMedida',
  'cantidad',
];
const CONSERVATION_STATUSES = [{ status: 'Bueno' }, { status: 'Malo' }];
const NATIONAL_CURRENCY_CLASIF_NUM = 1424;
const AMERICAN_DOLLARS_CLASIF_NUM = 1426;
const EURO_CLASIF_NUM = 1590;
const CASH_CODES = [
  NATIONAL_CURRENCY_CLASIF_NUM,
  AMERICAN_DOLLARS_CLASIF_NUM,
  EURO_CLASIF_NUM,
];
const COMPENSATION_GOOD_CLASIF_NUMBER = 1575;
const SIAVI_PARAMETER = 'SSF3_RESULT_NOMS';
export {
  CVE_PARAMETER,
  FLYERS_REGISTRATION_CODE,
  TYPE_NOT_FOUND_FIELDS,
  SUBTYPE_NOT_FOUND_FIELDS,
  SSUBTYPE_NOT_FOUND_FIELDS,
  SSSUBTYPE_NOT_FOUND_FIELDS,
  COMPENSATION_GOOD_CLASIF_NUMBER,
  CASH_CODES,
  SAT_DISABLED_FIELDS,
  CONSERVATION_STATUSES,
  SIAVI_PARAMETER,
};
