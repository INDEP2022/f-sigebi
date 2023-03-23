import { FieldToSearch } from '../../shared/form-search-handler/form-search-handler.component';

export const JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS = {
  wheelNumber: {
    title: 'No. Volante',
    type: 'number',
    sort: false,
  },
  expedientNumber: {
    title: 'No. Expediente.',
    type: 'string',
    sort: false,
  },
  officeExternalKey: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },
  cityNumber: {
    title: 'No. Ciudad',
    type: 'string',
    sort: false,
  },
  entFedKey: {
    title: 'No. Entidad Federativa',
    type: 'string',
    sort: false,
  },
  endTransferNumber: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
  },
  stationNumber: {
    title: 'No. Emisora',
    type: 'string',
    sort: false,
  },
  autorityNumber: {
    title: 'No. Autoridad',
    type: 'string',
    sort: false,
  },
  indiciadoNumber: {
    title: 'No. Indiciado',
    type: 'string',
    sort: false,
  },
  externalOfficeDate: {
    title: 'Fecha Oficio',
    type: 'number',
    sort: false,
  },
  circumstantialRecord: {
    title: 'Acta Circusnt.',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averig. Previa',
    type: 'number',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  protectionKey: {
    title: 'No. Amparo',
    type: 'number',
    sort: false,
  },
  touchPenaltyKey: {
    title: 'Toca Penal',
    type: 'string',
    sort: false,
  },
  expedientTransferenceNumber: {
    title: 'Exp. Transfer',
    type: 'string',
    sort: false,
  },
};

export const JURIDICAL_FILE_UPDATE_SEARCH_FIELDS: FieldToSearch[] = [
  {
    field: 'wheelNumber',
  },
  {
    field: 'expedientNumber',
  },
  {
    field: 'officeExternalKey',
  },
  {
    field: 'expedientTransferenceNumber',
  },
  {
    field: 'judgementType',
  },
  {
    field: 'circumstantialRecord',
  },
  {
    field: 'preliminaryInquiry',
  },
  {
    field: 'criminalCase',
  },
  {
    field: 'protectionKey',
  },
  {
    field: 'touchPenaltyKey',
  },
  {
    field: 'wheelType',
  },
  {
    field: 'affairKey',
    nestedObjField: 'id',
  },
  {
    field: 'dictumKey',
    nestedObjField: 'id',
  },
  {
    field: 'cityNumber',
    nestedObjField: 'idCity',
  },
  {
    field: 'entFedKey',
    nestedObjField: 'otKey',
  },
  {
    field: 'endTransferNumber',
    nestedObjField: 'id',
  },
  {
    field: 'stationNumber',
    nestedObjField: 'id',
  },
  {
    field: 'autorityNumber',
    nestedObjField: 'idAuthority',
  },
  {
    field: 'indiciadoNumber',
    nestedObjField: 'id',
  },
  {
    field: 'crimeKey',
    nestedObjField: 'otKey',
  },
  {
    field: 'viaKey',
    nestedObjField: 'otKey',
  },
  {
    field: 'institutionNumber',
    nestedObjField: 'id',
  },
];

export const JURIDICAL_FILE_UPDATE_FLYER_COPIES_COLUMNS = {
  copyuser: {
    title: 'Usuario',
    type: 'number',
    sort: false,
  },
  userDetail: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.name;
    },
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
};

export const JURIDICAL_FILE_UPDATE_SHIFT_CHANGE_COLUMNS = {
  flyerNumber: {
    title: 'Usuario',
    type: 'number',
    sort: false,
  },
  userDetail: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.name;
    },
  },
  type: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
};
